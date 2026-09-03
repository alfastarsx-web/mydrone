#!/usr/bin/env bash
# ============================================================
#  MyDrone.uz — serverni bir marta sozlash skripti
#  Serverda root bo'lib ishga tushiring:
#     bash setup-server.sh
#  Idempotent — bir necha marta ishga tushirsa ham xavfsiz.
# ============================================================
set -euo pipefail

DOMAIN="mydrone.uz"
ADMIN_USER="${ADMIN_USER:-admin}"

say() { printf "\n\033[1;36m▸ %s\033[0m\n" "$1"; }

# --- 0. Tekshiruv ---------------------------------------------------------
[ "$(id -u)" -eq 0 ] || { echo "root bo'lib ishga tushiring (sudo)"; exit 1; }
command -v nginx >/dev/null || { echo "nginx topilmadi"; exit 1; }

say "Nginx konfiguratsiyasi zaxiralanmoqda"
BK="/root/nginx-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar czf "$BK" /etc/nginx 2>/dev/null || true
echo "  zaxira: $BK"

# --- 1. Eski global gzip fayli (agar oldingi urinishdan qolgan bo'lsa) ---
say "Eski gzip qo'shimchasi tekshirilmoqda"
# nginx.conf da odatda "gzip on;" allaqachon bor — conf.d ga qayta yozish
# "duplicate directive" xatosini beradi. Shuning uchun gzip sozlamalari
# quyida sayt server blokining ichiga yoziladi.
if [ -f /etc/nginx/conf.d/gzip.conf ]; then
  rm -f /etc/nginx/conf.d/gzip.conf
  echo "  /etc/nginx/conf.d/gzip.conf o'chirildi"
else
  echo "  tozalash shart emas"
fi

# --- 2. Admin panel uchun parol ------------------------------------------
say "Admin panel uchun parol yaratilmoqda"
command -v htpasswd >/dev/null || apt-get install -y apache2-utils >/dev/null 2>&1
HT="/etc/nginx/.htpasswd-mydrone"
if [ -f "$HT" ] && [ -z "${ADMIN_PASS:-}" ]; then
  echo "  $HT allaqachon mavjud — o'zgartirilmadi"
  echo "  parolni yangilash uchun: htpasswd $HT $ADMIN_USER"
else
  # Parol ADMIN_PASS o'zgaruvchisida berilishi mumkin (CI uchun — ekranga chiqmaydi)
  if [ -n "${ADMIN_PASS:-}" ]; then
    PASS="$ADMIN_PASS"; SHOW=0
  else
    PASS="$(openssl rand -base64 12 | tr -d '/+=' | head -c 14)"; SHOW=1
  fi
  htpasswd -bc "$HT" "$ADMIN_USER" "$PASS" >/dev/null 2>&1
  chmod 640 "$HT"; chown root:www-data "$HT" 2>/dev/null || true
  if [ "$SHOW" = "1" ]; then
    echo "  ┌────────────────────────────────────────────┐"
    echo "  │  ADMIN PANEL KIRISH (saqlab qo'ying!)      │"
    echo "  │  login: $ADMIN_USER"
    echo "  │  parol: $PASS"
    echo "  └────────────────────────────────────────────┘"
  else
    echo "  parol ADMIN_PASS orqali berildi (ekranga chiqarilmadi)"
  fi
fi

# --- 3. Server blokiga admin himoyasi + kesh qo'shish ---------------------
say "Nginx server bloki yangilanmoqda (SPA fallback + admin paroli + kesh)"
# Konfiguratsiya fayli tashqaridan berilishi mumkin (remote-deploy.sh uni aniqlaydi)
CONF="${NGINX_CONF:-}"
[ -n "$CONF" ] || CONF=$(grep -rlE "server_name[^;]*${DOMAIN//./\\.}" /etc/nginx/ 2>/dev/null | head -1 || true)
if [ -z "$CONF" ]; then
  echo "  ${DOMAIN} uchun server bloki topilmadi — quyidagini qo'lda qo'shing:"
  cat deploy/nginx-snippet.conf 2>/dev/null || true
else
  echo "  fayl: $CONF"
  {
    # oxirgi } dan oldin location bloklarini kiritamiz
    python3 - "$CONF" <<'PY'
import sys, re, os
p = sys.argv[1]
s = open(p).read()

SITE_ROOT = os.environ.get('SITE_ROOT', '').strip()
R = ('        root %s;\n' % SITE_ROOT) if SITE_ROOT else ''
print("  sayt papkasi: %s" % (SITE_ROOT or "(berilmagan)"))

A = "    # >>> mydrone-deploy — avtomatik qo'shilgan, qo'lda tahrirlamang"
B = "    # <<< mydrone-deploy"

# 1) Avvalgi ishga tushirishda qo'shilgan blok (markerli) olib tashlanadi
s = re.sub(re.escape(A) + r'.*?' + re.escape(B) + r'\n?', '', s, flags=re.S)

# 2) Markerlar paydo bo'lishidan oldingi versiya qo'shgan bloklar ham tozalanadi
s = re.sub(r'\n[ \t]*#[^\n]*(?:Admin panel: parol|Statik fayllar uchun kesh|Siqish \(|SPA fallback)[^\n]*', '', s)
s = re.sub(r'\n[ \t]*location\s*=\s*/admin\.html\s*\{[^{}]*\}', '', s)
s = re.sub(r'\n[ \t]*location\s+~\*[^{]*\{[^{}]*max-age=(?:604800|2592000)[^{}]*\}', '', s)

has_gzip = re.search(r'^\s*gzip\s+on\s*;', s, re.M) is not None
GZIP = '' if has_gzip else """
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 512;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml image/svg+xml font/ttf font/otf;
"""

EXTRA = A + "\n" + GZIP + """
    location = /admin.html {
        auth_basic "MyDrone admin";
        auth_basic_user_file /etc/nginx/.htpasswd-mydrone;
""" + R + """        try_files $uri =404;
    }

    location ~* \\.(?:css|js)$ {
""" + R + """        expires 7d;
        add_header Cache-Control "public, max-age=604800";
        try_files $uri =404;
    }

    location ~* \\.(?:jpg|jpeg|png|gif|webp|svg|ico|woff2?)$ {
""" + R + """        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }
""" + B + "\n"

# 3) SPA fallback: mavjud "location /" ga try_files qo'shamiz
#    (http->https yo'naltiruvchi blokka tegmaymiz — unda return 30x bo'ladi)
target = None
for m in re.finditer(r'location\s+/\s*\{([^{}]*)\}', s):
    if not re.search(r'return\s+30\d', m.group(1)):
        target = m
        break

if target:
    body = target.group(1)
    if 'try_files' in body:
        body2 = re.sub(r'try_files[^;]*;', 'try_files $uri $uri/ /index.html;', body, count=1)
        print("  mavjud location / dagi try_files yangilandi")
    else:
        body2 = body.rstrip() + "\n        try_files $uri $uri/ /index.html;\n    "
        print("  mavjud location / ga try_files qo'shildi")
    s = s[:target.start(1)] + body2 + s[target.end(1):]
else:
    EXTRA = A + "\n" + GZIP + """
    location / {
""" + R + """        try_files $uri $uri/ /index.html;
    }
""" + EXTRA[len(A) + 1 + len(GZIP):]
    print("  yangi location / bloki qo'shildi")

i = s.rstrip().rfind('}')
s = s[:i] + EXTRA + s[i:]
open(p, 'w').write(s)
print("  gzip: %s | admin himoyasi va kesh: qo'shildi" % ("allaqachon bor" if has_gzip else "qo'shildi"))
PY
  }
fi

# --- 4. Tekshirish va qayta yuklash --------------------------------------
say "Konfiguratsiya tekshirilmoqda"
if nginx -t; then
  systemctl reload nginx
  echo "  ✓ nginx qayta yuklandi"
else
  echo "  ✗ XATO — o'zgarishlar qaytarilmoqda"
  rm -f /etc/nginx/conf.d/gzip.conf          # tar qaytarish yangi fayllarni o'chirmaydi
  tar xzf "$BK" -C /
  nginx -t && systemctl reload nginx && echo "  ✓ eski holat tiklandi"
  exit 1
fi

# --- 5. Natijani tekshirish ----------------------------------------------
say "Natija"
echo -n "  gzip:  "; curl -sI -H "Accept-Encoding: gzip" "https://$DOMAIN/assets/js/app.js" | grep -i content-encoding || echo "ishlamadi"
echo -n "  admin: "; curl -so /dev/null -w "%{http_code} (401 bo'lishi kerak)\n" "https://$DOMAIN/admin.html"
echo -n "  sayt:  "; curl -so /dev/null -w "%{http_code}\n" "https://$DOMAIN/"
echo -n "  ichki manzil: "; curl -so /dev/null -w "%{http_code} (200 bo'lishi kerak)\n" "https://$DOMAIN/mahsulot/dm-air-4k-pro"
echo -n "  sitemap: "; curl -so /dev/null -w "%{http_code}\n" "https://$DOMAIN/sitemap.xml"

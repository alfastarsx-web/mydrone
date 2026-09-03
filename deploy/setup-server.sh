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

# --- 1. Gzip (butun serverga, qo'shimcha fayl orqali) ---------------------
say "Gzip siqish yoqilmoqda"
cat > /etc/nginx/conf.d/gzip.conf <<'EOF'
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_min_length 512;
gzip_proxied any;
gzip_types
  text/plain text/css text/xml text/javascript
  application/javascript application/x-javascript
  application/json application/xml application/rss+xml
  image/svg+xml font/ttf font/otf application/font-woff;
EOF
echo "  /etc/nginx/conf.d/gzip.conf yozildi"

# --- 2. Admin panel uchun parol ------------------------------------------
say "Admin panel uchun parol yaratilmoqda"
command -v htpasswd >/dev/null || apt-get install -y apache2-utils >/dev/null 2>&1
HT="/etc/nginx/.htpasswd-mydrone"
if [ -f "$HT" ]; then
  echo "  $HT allaqachon mavjud — o'zgartirilmadi"
  echo "  parolni yangilash uchun: htpasswd $HT $ADMIN_USER"
else
  PASS="$(openssl rand -base64 12 | tr -d '/+=' | head -c 14)"
  htpasswd -bc "$HT" "$ADMIN_USER" "$PASS" >/dev/null 2>&1
  chmod 640 "$HT"; chown root:www-data "$HT" 2>/dev/null || true
  echo "  ┌────────────────────────────────────────────┐"
  echo "  │  ADMIN PANEL KIRISH (saqlab qo'ying!)      │"
  echo "  │  login: $ADMIN_USER"
  echo "  │  parol: $PASS"
  echo "  └────────────────────────────────────────────┘"
fi

# --- 3. Server blokiga admin himoyasi + kesh qo'shish ---------------------
say "Nginx server bloki yangilanmoqda (SPA fallback + admin paroli + kesh)"
CONF=$(grep -rlE "server_name[^;]*\b${DOMAIN}\b" /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null | head -1 || true)
if [ -z "$CONF" ]; then
  echo "  ${DOMAIN} uchun server bloki topilmadi — quyidagini qo'lda qo'shing:"
  cat deploy/nginx-snippet.conf 2>/dev/null || true
else
  echo "  fayl: $CONF"
  if grep -q "htpasswd-mydrone" "$CONF"; then
    echo "  admin himoyasi allaqachon qo'shilgan"
  else
    # oxirgi } dan oldin location bloklarini kiritamiz
    python3 - "$CONF" <<'PY'
import sys, re
p = sys.argv[1]
s = open(p).read()

SPA = """
    # --- SPA fallback: /katalog, /mahsulot/... manzillari index.html ga ---
    location / {
        try_files $uri $uri/ /index.html;
    }
"""
EXTRA = """
    # --- Admin panel: parol bilan himoyalangan ---
    location = /admin.html {
        auth_basic "MyDrone admin";
        auth_basic_user_file /etc/nginx/.htpasswd-mydrone;
        try_files $uri =404;
    }

    # --- Statik fayllar uchun kesh ---
    location ~* \\.(?:css|js)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }
    location ~* \\.(?:jpg|jpeg|png|gif|webp|svg|ico|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }
"""

# Mavjud "location / { ... }" ni topamiz — lekin http→https yo'naltiruvchi
# blokka tegmaymiz (uning ichida return 301 bo'ladi).
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
    add = EXTRA
else:
    print("  yangi location / bloki qo'shildi")
    add = SPA + EXTRA

i = s.rstrip().rfind('}')
s = s[:i] + add + s[i:]
open(p, 'w').write(s)
print("  admin himoyasi va kesh qoidalari qo'shildi")
PY
  fi
fi

# --- 4. Tekshirish va qayta yuklash --------------------------------------
say "Konfiguratsiya tekshirilmoqda"
if nginx -t; then
  systemctl reload nginx
  echo "  ✓ nginx qayta yuklandi"
else
  echo "  ✗ XATO — o'zgarishlar qaytarilmoqda"
  tar xzf "$BK" -C / && systemctl reload nginx
  exit 1
fi

# --- 5. Natijani tekshirish ----------------------------------------------
say "Natija"
echo -n "  gzip:  "; curl -sI -H "Accept-Encoding: gzip" "https://$DOMAIN/assets/js/app.js" | grep -i content-encoding || echo "ishlamadi"
echo -n "  admin: "; curl -so /dev/null -w "%{http_code} (401 bo'lishi kerak)\n" "https://$DOMAIN/admin.html"
echo -n "  sayt:  "; curl -so /dev/null -w "%{http_code}\n" "https://$DOMAIN/"
echo -n "  ichki manzil: "; curl -so /dev/null -w "%{http_code} (200 bo'lishi kerak)\n" "https://$DOMAIN/mahsulot/dm-air-4k-pro"
echo -n "  sitemap: "; curl -so /dev/null -w "%{http_code}\n" "https://$DOMAIN/sitemap.xml"

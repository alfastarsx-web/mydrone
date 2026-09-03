#!/usr/bin/env bash
# ============================================================
#  MyDrone.uz — serverda bajariladigan deploy skripti
#
#  Bu skript serverning o'zida ishlaydi (GitHub Actions uni ssh orqali
#  chaqiradi). Vazifasi: nginx sozlamalarini to'g'rilash va sayt fayllarini
#  o'z papkasiga ko'chirish.
#
#  Qo'lda ham ishlatsa bo'ladi:
#      cd /opt/mydrone-src && bash deploy/remote-deploy.sh
# ============================================================
set -euo pipefail

DOMAIN="mydrone.uz"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

say() { printf "\n== %s ==\n" "$1"; }

say "Sayt papkasi aniqlanmoqda"

# 1-usul: butun /etc/nginx daraxti bo'ylab qidirish
CONF="$(grep -rlE "server_name[^;]*${DOMAIN//./\\.}" /etc/nginx/ 2>/dev/null | head -1 || true)"

# 2-usul: nginx -T (amaldagi to'liq konfiguratsiya, fayl nomlari bilan)
if [ -z "$CONF" ]; then
  CONF="$(nginx -T 2>/dev/null | awk -v d="${DOMAIN//./\\.}" '
    /^# configuration file /{ f=$4; sub(/:$/,"",f) }
    $0 ~ "server_name[^;]*" d { print f; exit }' || true)"
fi

# 3-usul: /etc dan tashqaridagi panel konfiguratsiyalari
if [ -z "$CONF" ]; then
  CONF="$(grep -rlE "server_name[^;]*${DOMAIN//./\\.}" /etc /usr/local/etc 2>/dev/null | grep -iE 'nginx|vhost|site' | head -1 || true)"
fi

if [ -z "$CONF" ]; then
  echo "XATO: $DOMAIN uchun nginx bloki topilmadi."
  echo
  echo "--- tashxis: /etc/nginx tarkibi ---"
  ls -la /etc/nginx/ 2>/dev/null | head -25
  echo "--- tashxis: nginx -T dagi barcha server_name ---"
  nginx -T 2>/dev/null | grep -nE 'configuration file|server_name' | head -40
  echo "--- tashxis: 'mydrone' so'zi uchraydigan fayllar ---"
  grep -rl mydrone /etc 2>/dev/null | head -20
  exit 1
fi

# server_name topilgan blokdan keyingi birinchi root direktivasi
DIR="$(awk -v d="${DOMAIN//./\\.}" '
  $0 ~ "server_name[^;]*" d { f=1 }
  f && $1=="root" { gsub(/;/,"",$2); print $2; exit }' "$CONF")"

# root shu faylda bo'lmasa — nginx -T dan qidiramiz
if [ -z "${DIR:-}" ]; then
  DIR="$(nginx -T 2>/dev/null | awk -v d="${DOMAIN//./\\.}" '
    $0 ~ "server_name[^;]*" d { f=1 }
    f && $1=="root" { gsub(/;/,"",$2); print $2; exit }' || true)"
fi

if [ -z "${DIR:-}" ] || [ ! -d "$DIR" ]; then
  echo "XATO: root papka topilmadi yoki mavjud emas (konfig: $CONF, root: ${DIR:-topilmadi})"
  echo "--- konfiguratsiya fayli ---"
  sed -n '1,80p' "$CONF"
  exit 1
fi

echo "  konfig: $CONF"
echo "  papka:  $DIR"

say "Nginx sozlanmoqda (gzip, try_files, kesh)"
# admin.html serverga chiqarilmaydi — parol ekranga (va CI logiga) chiqmasin
ADMIN_PASS="${ADMIN_PASS:-$(openssl rand -hex 16)}"
export ADMIN_PASS
NGINX_CONF="$CONF" SITE_ROOT="$DIR" bash "$SRC/deploy/setup-server.sh"

say "Fayllar ko'chirilmoqda"
cd "$SRC"
tar --exclude='./.git' --exclude='./.github' --exclude='./.claude' \
    --exclude='./deploy' --exclude='./README.md' --exclude='./.gitignore' \
    --exclude='./admin.html' --exclude='./assets/js/admin.js' \
    --exclude='./assets/css/admin.css' \
    -cf - . | tar -xf - -C "$DIR"

# ilgari yuklangan admin fayllari qolgan bo'lsa — olib tashlanadi
rm -f "$DIR/admin.html" "$DIR/assets/js/admin.js" "$DIR/assets/css/admin.css"
chown -R www-data:www-data "$DIR" 2>/dev/null || true

echo "  ko'chirildi: $(find "$DIR" -type f | wc -l) ta fayl"
say "Tayyor"

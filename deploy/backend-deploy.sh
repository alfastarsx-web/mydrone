#!/usr/bin/env bash
# ============================================================
#  MyDrone backend — serverda ishga tushirish / yangilash
#
#  remote-deploy.sh shu skriptni chaqiradi. Alohida ham ishlatsa bo'ladi:
#      cd /opt/mydrone-src && bash deploy/backend-deploy.sh
#
#  Idempotent: bazani, foydalanuvchini va .env ni faqat yo'q bo'lsa yaratadi,
#  keyingi ishga tushirishlarda faqat kodni yangilab, jarayonni qayta ishga tushiradi.
# ============================================================
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="mydrone-api"
APP_PORT="${APP_PORT:-4010}"        # CRM backendi 4000 da — to'qnashmasligi uchun
DB_NAME="mydrone"
DB_USER="mydrone"

say() { printf "\n== %s ==\n" "$1"; }

# ---------- 1. Kerakli dasturlar ----------
say "Muhit tekshirilmoqda"
command -v node >/dev/null || { echo "XATO: Node.js topilmadi"; exit 1; }
command -v npm  >/dev/null || { echo "XATO: npm topilmadi"; exit 1; }
echo "  node: $(node -v), npm: $(npm -v)"

if ! command -v psql >/dev/null; then
  echo "XATO: PostgreSQL topilmadi. O'rnating: apt install postgresql"
  exit 1
fi
echo "  postgres: $(psql --version | awk '{print $3}')"

if ! command -v pm2 >/dev/null; then
  echo "  pm2 topilmadi — o'rnatilmoqda"
  npm install -g pm2 >/dev/null 2>&1 || { echo "XATO: pm2 o'rnatilmadi"; exit 1; }
fi
echo "  pm2: $(pm2 -v 2>/dev/null | tail -1)"

# ---------- 2. Baza va foydalanuvchi ----------
say "Ma'lumotlar bazasi"
PSQL="sudo -u postgres psql -tAq"

if [ "$($PSQL -c "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")" = "1" ]; then
  echo "  '$DB_USER' foydalanuvchisi mavjud"
  DB_PASS=""      # parol .env da saqlanadi, o'zgartirmaymiz
else
  DB_PASS="$(openssl rand -hex 24)"
  $PSQL -c "CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASS';" >/dev/null
  echo "  '$DB_USER' foydalanuvchisi yaratildi"
fi

if [ "$($PSQL -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")" = "1" ]; then
  echo "  '$DB_NAME' bazasi mavjud"
else
  sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"
  echo "  '$DB_NAME' bazasi yaratildi"
fi
$PSQL -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" >/dev/null 2>&1 || true

# ---------- 3. Sozlamalar fayli ----------
say "Sozlamalar (.env)"
ENV_FILE="$SRC/backend/.env"
if [ -f "$ENV_FILE" ]; then
  echo "  mavjud — o'zgartirilmadi ($ENV_FILE)"
else
  if [ -z "$DB_PASS" ]; then
    # foydalanuvchi bor, lekin .env yo'q — parolni yangilaymiz
    DB_PASS="$(openssl rand -hex 24)"
    $PSQL -c "ALTER ROLE $DB_USER PASSWORD '$DB_PASS';" >/dev/null
    echo "  baza paroli yangilandi"
  fi
  cat > "$ENV_FILE" <<ENVEOF
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=$DB_USER
DB_PASSWORD=$DB_PASS
DB_NAME=$DB_NAME
TYPEORM_SYNC=true
SEED_DEMO=true
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
PORT=$APP_PORT
HOST=127.0.0.1
ENVEOF
  chmod 600 "$ENV_FILE"
  echo "  yaratildi (parollar tasodifiy, faylda 600 huquq bilan)"
fi

# ---------- 4. Kod va build ----------
say "Backend yig'ilmoqda"
cd "$SRC/backend"
npm install --no-audit --no-fund --loglevel=error
npm run build
echo "  build tayyor"

# ---------- 5. Jarayonni ishga tushirish ----------
say "Jarayon (pm2)"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env >/dev/null
  echo "  $APP_NAME qayta ishga tushirildi"
else
  pm2 start dist/main.js --name "$APP_NAME" --cwd "$SRC/backend" >/dev/null
  echo "  $APP_NAME ishga tushirildi"
fi
pm2 save >/dev/null 2>&1 || true
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

# ---------- 6. Tekshirish ----------
say "Tekshirish"
ok=0
for i in $(seq 1 12); do
  code=$(curl -so /dev/null -w '%{http_code}' -m 5 "http://127.0.0.1:$APP_PORT/api/settings" || true)
  if [ "$code" = "200" ]; then ok=1; break; fi
  sleep 2
done

if [ "$ok" = "1" ]; then
  echo "  API javob bermoqda: http://127.0.0.1:$APP_PORT/api"
  echo -n "  katalog: "
  curl -s -m 5 "http://127.0.0.1:$APP_PORT/api/products?limit=1" | head -c 80; echo
else
  echo "  XATO: API javob bermadi. Loglar:"
  pm2 logs "$APP_NAME" --lines 30 --nostream 2>/dev/null || true
  exit 1
fi

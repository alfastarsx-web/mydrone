# MyDrone backend — NestJS + TypeORM + PostgreSQL

Onlayn-do'kon API'si. Frontend bilan bitta jarayonda ishlaydi: NestJS `/api/*`
so'rovlarini o'zi qayta ishlaydi, qolgan yo'llarga repo ildizidagi `index.html`
va `assets/` fayllarini uzatadi.

## Ishga tushirish

```bash
createdb mydrone            # bazani bir marta yaratish
cd backend
cp .env.example .env        # DB_USERNAME ni o'zingiznikiga moslang
npm install
npm run build
npm start                   # yoki: npm run start:dev
```

So'ng: http://127.0.0.1:4000 — sayt va API bitta manzilda.

| Buyruq | Vazifasi |
|---|---|
| `npm run build` | TypeScript'ni `dist/` ga kompilyatsiya qiladi |
| `npm start` | `dist/main.js` ni ishga tushiradi |
| `npm run start:dev` | O'zgarishlarni kuzatib qayta ishga tushiradi |
| `npm run check` | Faqat tiplarni tekshiradi (test to'plami yo'q) |

`TYPEORM_SYNC=true` bo'lganda sxema entity'lardan avtomatik yasaladi —
migratsiya yozish shart emas. Birinchi ishga tushishda `SEED_DEMO` yoqiq bo'lsa,
demo katalog `../assets/js/data.js` faylidan o'qib bazaga yoziladi (katalog
bitta joyda turadi — backend'siz ishlaganda ham bir xil mahsulotlar ko'rinadi).

Standart administrator: `admin@mydrone.uz` / `admin12345` — **prodda darhol
o'zgartiring**.

## Tuzilma

Feature'lar `src/features/<nom>/` ichida, uch qatlam:
`presentation/` (controller, guard) → `application/` (biznes mantiq) →
`infrastructure/` (TypeORM entity).

| Feature | Vazifasi |
|---|---|
| `auth` | Ro'yxatdan o'tish, kirish, JWT (access + refresh), profil, referal kodlar |
| `catalog` | Kategoriya, subkategoriya, mahsulot, sharhlar |
| `orders` | Buyurtma, buyurtma qatorlari, promokodlar |
| `content` | Blog, FAQ, sayt sozlamalari, murojaatlar |
| `dashboard` | Admin uchun statistika |
| `seed` | Demo katalogni bazaga yozish |

## API

### Ochiq (autorizatsiyasiz)

| Metod | Yo'l | Tavsif |
|---|---|---|
| GET | `/api/categories` | Kategoriyalar va subkategoriyalar |
| GET | `/api/products` | Filtr: `cat, sub, brand, stock, min, max, q, sort, page, limit` |
| GET | `/api/products/brands` | Brendlar ro'yxati |
| GET | `/api/products/suggest?q=` | Qidiruv taklifi (autocomplete) |
| GET | `/api/products/:slug` | Mahsulot + tasdiqlangan sharhlar |
| GET | `/api/posts` · `/api/posts/:slug` | Blog |
| GET | `/api/faq` · `/api/settings` | FAQ va sayt sozlamalari |
| GET | `/api/orders/promo/:code` | Promokodni tekshirish |
| POST | `/api/orders` | Buyurtma berish (mehmon ham, kirgan mijoz ham) |
| POST | `/api/leads` | Qo'ng'iroqqa buyurtma / aloqa formasi |
| POST | `/api/auth/register` · `login` · `refresh` · `logout` | Autentifikatsiya |

### Mijoz uchun (Bearer token)

`GET /api/auth/me`, `PATCH /api/auth/me`, `GET /api/orders/my`,
`POST /api/products/:id/reviews`

### Admin uchun (Bearer token + `role=admin`)

`/api/admin/dashboard/summary` · `/api/admin/catalog/products` (GET/POST/PUT/DELETE) ·
`/api/admin/catalog/categories` · `/api/admin/catalog/subcategories` ·
`/api/admin/catalog/reviews` · `/api/admin/orders` (+ `PUT :id/status`) ·
`/api/admin/promos` · `/api/admin/content/posts` · `/api/admin/content/faq` ·
`/api/admin/content/settings` · `/api/admin/content/leads` · `/api/users`

## Muhim qarorlar

- **Narxlar serverda qayta hisoblanadi.** Brauzerdan kelgan summa qabul
  qilinmaydi: mahsulot narxi, yetkazish, promokod va bonus API tomonida
  hisoblanadi. Aks holda savatdagi narxni o'zgartirib yuborish mumkin bo'lardi.
- **Buyurtma qatorlarida nom va narx nusxasi saqlanadi** — mahsulot keyin
  o'chirilsa yoki narxi o'zgarsa ham eski buyurtma o'zgarmaydi.
- **Referal bonus buyurtma "yetkazildi" bo'lgandagina yoziladi** (FAQ dagi shart
  shunday), foizi sozlamalardan olinadi.
- **Sharhlar moderatsiyadan o'tadi** — admin tasdiqlamaguncha saytda ko'rinmaydi,
  reyting faqat tasdiqlanganlardan hisoblanadi.
- **Parollar bcrypt bilan xeshlanadi**, refresh token bazada saqlanadi va
  ishlatilganda almashtiriladi.

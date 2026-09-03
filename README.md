# MyDrone.uz — onlayn-do'kon (frontend + demo admin panel)

`TZ_drone_import_sayt.pdf` texnik topshirig'i asosida qurilgan onlayn-do'kon prototipi:
Xitoydan dron va texnika import qilib sotuvchi sayt.

**Texnologiya:** sof HTML/CSS/JS (framework yo'q, build qadam yo'q).
Ma'lumotlar `localStorage`da saqlanadi — backend hali ulanmagan.

## Ishga tushirish

```bash
cd ~/Documents/dronmarket
python3 deploy/dev-server.py 5182
```

> Oddiy `python3 -m http.server` **yaramaydi**: sayt haqiqiy manzillar ishlatadi
> (`/mahsulot/dji-mini-4-pro`) va bunday papka mavjud emas — server 404 beradi.
> `deploy/dev-server.py` topilmagan yo'llarga `index.html` qaytaradi, xuddi
> nginx'dagi `try_files` kabi.

So'ng brauzerda oching:

- Sayt: <http://127.0.0.1:5182/index.html>
- Admin panel: <http://127.0.0.1:5182/admin.html>

## Demo kirish ma'lumotlari

| Qayer | Login | Parol |
|---|---|---|
| Sayt (mijoz kabineti) | `demo@mydrone.uz` | `demo12345` |
| Admin panel | `admin@mydrone.uz` | `admin12345` |

Promokodlar: `SALOM10` (−10%), `DRON500` (−500 000 so'm).

## Manzillar (URL)

Sayt History API bilan ishlaydi — har bir sahifaning haqiqiy manzili bor,
shuning uchun Google ularni alohida indekslay oladi.

| Manzil | Sahifa |
|---|---|
| `/` | Bosh sahifa |
| `/katalog` · `/katalog?cat=dronlar&brand=DJI&sort=cheap` | Katalog, filtr va saralash manzilga yoziladi |
| `/mahsulot/<slug>` | Mahsulot kartasi (Product JSON-LD bilan) |
| `/blog` · `/blog/<slug>` | Blog |
| `/yetkazib-berish` `/kafolat` `/biz-haqimizda` `/aloqa` `/savollar` `/referal-dastur` | Statik sahifalar |
| `/savat` `/buyurtma` `/buyurtma/<id>` `/kabinet/...` `/kirish` | Shaxsiy sahifalar — `noindex` |

Eski `#/...` havolalar avtomatik yangi manzilga o'tkaziladi.

**Har bir sahifa uchun** `<title>`, `meta description`, `canonical` va Open Graph
teglari alohida yoziladi; mahsulot sahifalarida qo'shimcha `Product` JSON-LD
(narx, valyuta, mavjudlik) bo'ladi. `sitemap.xml` katalogdan avtomatik yaratiladi
(`node deploy/gen-sitemap.js`) va deploy paytida yangilanadi.

> **Muhim:** haqiqiy manzillar ishlashi uchun nginx'da
> `try_files $uri $uri/ /index.html;` bo'lishi shart — `deploy/setup-server.sh`
> buni avtomatik qo'shadi.

## Fayl tuzilishi

```
index.html          — saytning qobig'i (SPA, hash-router)
admin.html          — administrator paneli qobig'i
assets/css/style.css — sayt uslublari (dizayn tizimi, responsive)
assets/css/admin.css — admin panel uslublari
assets/js/data.js    — demo katalog: 32 mahsulot, 6 kategoriya, 6 maqola, FAQ
assets/js/i18n.js    — o'zbek/rus tarjimalari
assets/js/store.js   — ma'lumot qatlami (localStorage, savat, foydalanuvchi, buyurtma)
assets/js/app.js     — sayt sahifalari va router
assets/js/admin.js   — admin panel sahifalari
assets/img/          — 52 ta rasm (Unsplash, bepul litsenziya)
```

## TZ bo'yicha bajarilgan funksiyalar

**2-bo'lim — sahifalar xaritasi:** bosh sahifa, katalog, mahsulot kartasi, savat,
checkout, shaxsiy kabinet, referal sahifasi, yetkazib berish va to'lov, kafolat va
qaytarish, biz haqimizda, aloqa, blog, FAQ, admin panel — barchasi mavjud.

**3-bo'lim — funksional talablar:**

- Bosh sahifa: banner, ishonch bloklari, top mahsulotlar, yangi kelganlar, sharhlar, blog
- Katalog: kategoriya/subkategoriya, brend, narx oralig'i, mavjudlik bo'yicha filtr;
  narx / mashhurlik / yangilik / reyting bo'yicha saralash
- Mahsulot kartasi: rasm galereyasi, texnik pasport jadvali, mavjudlik holati
  ("omborda mavjud" / "buyurtma asosida, N kunda"), sharhlar, o'xshash mahsulotlar
- Savat va checkout: mehmon yoki ro'yxatdan o'tgan holda, manzil va yetkazish usuli,
  to'lov usuli (Click / Payme / Uzcard / naqd), promokod, bonus ballar
- Shaxsiy kabinet: buyurtmalar tarixi va bosqichma-bosqich kuzatish
  (kutilmoqda → tasdiqlandi → Xitoydan jo'natildi → yo'lda → yetkazildi), profil, saqlanganlar
- Referal dastur: har bir foydalanuvchiga individual havola va kod, taklif statistikasi,
  bonus balans, yangi mijozga chegirma
- Qidiruv: sayt bo'ylab, avtomatik takliflar (autocomplete) bilan
- Aloqa kanallari: Telegram va WhatsApp tugmalari, qo'ng'iroqqa buyurtma formasi
- Bildirishnomalar: buyurtma holati o'zgarganda ko'rsatiladigan xabar (demo)

**6-bo'lim — dizayn:** dron/gadjet mavzusiga mos qorong'i "texnologik" palitra,
mobil qurilmalarga to'liq moslashgan, rasm lazy-loading bilan.

**8-bo'lim — kengaytirilish (eng muhim talab):** admin panelda dasturchisiz
yangi kategoriya va subkategoriya qo'shish mumkin — u darhol menyuda va katalogda paydo bo'ladi.
Mahsulot atributlari (texnik xususiyatlar) erkin "nom / qiymat" juftliklari sifatida
kiritiladi, shuning uchun har xil turkum o'z xususiyatlariga ega bo'la oladi
(dron — parvoz vaqti, kamera — megapiksel, skuter — quvvat zaxirasi).
Ko'p tillilik allaqachon ishlaydi (uz/ru), valyuta bitta joyda sozlanadi.

**Admin panel:** boshqaruv paneli (KPI, 7 kunlik grafik, top mahsulotlar, zaxira ogohlantirishi),
buyurtmalar (holatni o'zgartirish), mahsulotlar (CRUD), kategoriyalar (CRUD),
mijozlar, promokodlar, blog (CRUD), murojaatlar, sozlamalar.

## Serverga chiqarish (deploy)

Sayt **https://mydrone.uz** manzilida ishlaydi (server 46.8.195.59, nginx + Let's Encrypt).

### Avtomatik deploy

`.github/workflows/deploy.yaml` — `main` branch'ga har push bo'lganda fayllarni
serverga rsync qiladi va saytning 200 qaytarishini tekshiradi.

Ishga tushishi uchun GitHub'da **Settings → Secrets and variables → Actions**
bo'limiga uchta secret qo'shiladi:

| Secret | Qiymat |
|---|---|
| `SSH_PRIVATE_KEY` | serverga kiruvchi deploy kalitining yopiq qismi |
| `SSH_HOST` | `46.8.195.59` |
| `DEPLOY_PATH` | saytning serverdagi papkasi (ixtiyoriy, standart `/var/www/mydrone`) |

Secret'lar sozlanmaguncha workflow xato bermaydi — deploy qadamlarini
o'tkazib yuboradi va izoh qoldiradi.

Kalitni terminaldan qo'shish:

```bash
gh secret set SSH_PRIVATE_KEY -R alfastarsx-web/mydrone < ~/.ssh/id_ed25519
gh secret set SSH_HOST -R alfastarsx-web/mydrone --body "46.8.195.59"
gh secret set DEPLOY_PATH -R alfastarsx-web/mydrone --body "/var/www/mydrone"
```

### Serverni bir marta sozlash

`deploy/setup-server.sh` — gzip siqishni yoqadi, admin panelga nginx darajasida
parol qo'yadi va statik fayllarga kesh sarlavhalarini qo'shadi. Serverda root
bo'lib bir marta ishga tushiriladi:

```bash
cd /var/www/mydrone && bash deploy/setup-server.sh
```

Skript o'zgartirishdan oldin `/etc/nginx` ni zaxiralaydi, `nginx -t` bilan
tekshiradi va xato chiqsa hammasini o'z holiga qaytaradi.

### Xavfsizlik eslatmasi

Admin panelning kirish oynasi **faqat brauzer tomonida** ishlaydi — parol
`assets/js/store.js` faylida ochiq turadi va uni istalgan tashrifchi o'qiy oladi.
Hozircha zarari yo'q (ma'lumot har bir tashrifchining o'z brauzerida saqlanadi),
lekin shuning uchun `setup-server.sh` nginx darajasida qo'shimcha parol qo'yadi.
Backend ulangach, autentifikatsiya serverga ko'chirilishi shart.


## Hali qilinmagan (keyingi bosqichlar)

TZ ning 10-bo'limidagi rejaga muvofiq:

1. **Backend** — hozir barcha ma'lumot brauzerda. Keyingi qadam: NestJS/Node yoki Laravel
   API + PostgreSQL. `assets/js/store.js` fayli shu maqsadda ajratilgan: uning
   `save/load` funksiyalarini `fetch('/api/...')` chaqiruvlariga almashtirish yetarli.
2. **Haqiqiy to'lov integratsiyasi** — Click/Payme uchun agregator (azma.uz, inpay.uz)
   bilan shartnoma va yuridik shaxs (YaTT/MChJ) kerak. Bu tashkiliy talab, texnik emas.
3. **SMS / Telegram bildirishnomalari** — hozir faqat ekranda ko'rsatiladi.
4. **Rasmlar** — hozirgi suratlar Unsplash'dan olingan bepul namunalar.
   Sotuvga chiqishdan oldin ular haqiqiy mahsulot fotolari bilan almashtirilishi kerak.
5. **Narxlar va mahsulot ro'yxati** namunaviy — haqiqiy tannarx va ustama asosida yangilanadi.
6. **Sharh va reyting raqamlari namunaviy.** Mahsulot sahifasidagi JSON-LD ga
   `aggregateRating` ataylab kiritilmadi — Google soxta reytinglar uchun jarima
   beradi. Haqiqiy sharhlar yig'ilgach qo'shiladi.
7. **Kontentni oldindan render qilish (SSR/prerender)** — hozir sahifa mazmunini
   JavaScript chizadi. Googlebot buni o'qiy oladi, lekin ba'zi ijtimoiy tarmoq
   botlari (Telegram, Facebook) faqat HTML'ni o'qiydi, shuning uchun ulashilganda
   barcha sahifalar uchun bitta og:image ko'rinadi. Backend qo'shilgach prerender
   qilinsa, bu ham hal bo'ladi.

## Eslatma

Saytdagi dron qonunchiligiga oid matnlar umumiy ma'lumot uchun, yuridik maslahat emas
(TZ 9-bo'limidagi ogohlantirish saqlangan). Sotuvni boshlashdan oldin amaldagi bojxona,
sertifikatlash va ro'yxatdan o'tkazish talablarini rasmiy manbadan aniqlashtirish kerak.

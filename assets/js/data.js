/* ===== DronMarket — demo ma'lumotlar (seed) =====
   Bu fayl saytning boshlang'ich katalogi. Admin panelda o'zgartirilgan
   ma'lumotlar localStorage'da saqlanadi va shu seed ustidan ustuvor bo'ladi. */
window.SEED = {
  settings: {
    brand: 'DronMarket',
    domain: 'dronmarket.uz',
    phone: '+998 90 123 45 67',
    phone2: '+998 71 200 00 11',
    email: 'info@dronmarket.uz',
    telegram: 'dronmarket_uz',
    whatsapp: '998901234567',
    instagram: 'dronmarket.uz',
    address_uz: "Toshkent sh., Chilonzor t., Bunyodkor ko'chasi 12",
    address_ru: 'г. Ташкент, Чиланзарский р-н, ул. Бунёдкор 12',
    workhours_uz: 'Dush–Shan: 09:00–19:00',
    workhours_ru: 'Пн–Сб: 09:00–19:00',
    freeFrom: 5000000,
    deliveryTashkent: 30000,
    deliveryRegion: 55000,
    refPercent: 3,
    refBonusNew: 100000
  },

  categories: [
    { id:'dronlar', name_uz:"Dronlar", name_ru:'Дроны', img:'drone-air-1.jpg', icon:'drone', subs:[
      { id:'foto-video', name_uz:'Foto-video dronlar', name_ru:'Фото-видео дроны' },
      { id:'fpv', name_uz:'FPV / poyga dronlari', name_ru:'FPV / гоночные' },
      { id:'agro', name_uz:'Agrodronlar', name_ru:'Агродроны' },
      { id:'oquv', name_uz:"Boshlang'ich / o'quv", name_ru:'Начальные / учебные' }
    ]},
    { id:'aksessuar', name_uz:'Aksessuarlar', name_ru:'Аксессуары', img:'acc-controller-1.jpg', icon:'box', subs:[
      { id:'batareya', name_uz:'Batareyalar', name_ru:'Аккумуляторы' },
      { id:'pult', name_uz:'Pult va ko\'zoynak', name_ru:'Пульты и очки' },
      { id:'vint', name_uz:'Vintlar va ehtiyot qismlar', name_ru:'Винты и запчасти' },
      { id:'sumka', name_uz:'Sumka va keyslar', name_ru:'Сумки и кейсы' }
    ]},
    { id:'kameralar', name_uz:'Kameralar va gimbal', name_ru:'Камеры и гимбалы', img:'cam-1.jpg', icon:'cam', subs:[
      { id:'action', name_uz:'Action-kameralar', name_ru:'Экшн-камеры' },
      { id:'gimbal', name_uz:'Gimbal / stabilizator', name_ru:'Гимбалы / стабилизаторы' }
    ]},
    { id:'gadjet', name_uz:'Aqlli gadjetlar', name_ru:'Умные гаджеты', img:'gadget-1.jpg', icon:'chip', subs:[
      { id:'aqlli-uy', name_uz:'Aqlli uy', name_ru:'Умный дом' },
      { id:'kiyiladigan', name_uz:'Kiyiladigan gadjetlar', name_ru:'Носимые гаджеты' }
    ]},
    { id:'robot', name_uz:'Robotexnika', name_ru:'Робототехника', img:'robot-1.jpg', icon:'bot', subs:[
      { id:'robot-it', name_uz:'Robot-itlar', name_ru:'Робо-собаки' },
      { id:'oquv-robot', name_uz:"O'quv robotlari", name_ru:'Обучающие роботы' }
    ]},
    { id:'transport', name_uz:'Elektro-transport', name_ru:'Электротранспорт', img:'scooter-1.jpg', icon:'scooter', subs:[
      { id:'skuter', name_uz:'Elektrosamokatlar', name_ru:'Электросамокаты' },
      { id:'giro', name_uz:'Giroskuter / segvey', name_ru:'Гироскутеры / сегвеи' }
    ]}
  ],

  products: [
    /* ---------- FOTO-VIDEO DRONLAR ---------- */
    { id:'p01', slug:'dm-air-4k-pro', cat:'dronlar', sub:'foto-video', brand:'DJI',
      name_uz:'DJI Mini 4 Pro — 4K HDR dron', name_ru:'DJI Mini 4 Pro — дрон 4K HDR',
      price:12490000, old:13900000, stock:'in', qty:7, lead:0, rating:4.9, reviews:41, sold:184, isNew:true, isHit:true,
      imgs:['drone-air-1.jpg','drone-air-2.jpg','drone-air-3.jpg','acc-controller-1.jpg'],
      short_uz:"249 g og'irlik, 34 daqiqa parvoz, 4K/60fps HDR kamera va har tomonlama to'siqni sezish.",
      short_ru:'Вес 249 г, 34 минуты полёта, камера 4K/60fps HDR и всенаправленные датчики препятствий.',
      specs:[['Parvoz vaqti','Время полёта','34 daqiqa'],['Kamera','Камера','4K/60fps HDR'],["Og'irlik",'Вес','249 g'],['Uzatish masofasi','Дальность','20 km'],["To'siq sensori",'Датчики','Har tomonlama'],['Matritsa','Матрица','1/1.3" CMOS']] },

    { id:'p02', slug:'dji-air-3s', cat:'dronlar', sub:'foto-video', brand:'DJI',
      name_uz:'DJI Air 3S — ikkita kamera, 45 daqiqa', name_ru:'DJI Air 3S — две камеры, 45 минут',
      price:21900000, old:0, stock:'pre', qty:0, lead:18, rating:4.8, reviews:23, sold:96, isNew:true,
      imgs:['drone-air-4.jpg','drone-air-5.jpg','drone-air-6.jpg'],
      short_uz:"1 dyuymli asosiy sensor va 70 mm teleobyektiv — professional aerosuratga olish uchun.",
      short_ru:'Основной сенсор 1 дюйм и телеобъектив 70 мм — для профессиональной аэросъёмки.',
      specs:[['Parvoz vaqti','Время полёта','45 daqiqa'],['Kamera','Камера','2× (1" + 70mm)'],["Og'irlik",'Вес','724 g'],['Uzatish masofasi','Дальность','20 km'],['Video','Видео','4K/120fps']] },

    { id:'p03', slug:'autel-evo-lite-plus', cat:'dronlar', sub:'foto-video', brand:'Autel',
      name_uz:'Autel EVO Lite+ — 6K aerosuratga olish', name_ru:'Autel EVO Lite+ — аэросъёмка 6K',
      price:17800000, old:19500000, stock:'in', qty:3, lead:0, rating:4.6, reviews:15, sold:58,
      imgs:['drone-air-7.jpg','drone-air-8.jpg','drone-air-9.jpg'],
      short_uz:"1 dyuymli CMOS sensor, 6K video, kechqurun ham toza tasvir beruvchi f/2.8–f/11 diafragma.",
      short_ru:'CMOS-сенсор 1 дюйм, видео 6K, регулируемая диафрагма f/2.8–f/11 для съёмки ночью.',
      specs:[['Parvoz vaqti','Время полёта','40 daqiqa'],['Kamera','Камера','6K/30fps'],["Og'irlik",'Вес','835 g'],['Diafragma','Диафрагма','f/2.8–f/11'],['Uzatish masofasi','Дальность','12 km']] },

    { id:'p04', slug:'dji-mavic-3-classic', cat:'dronlar', sub:'foto-video', brand:'DJI',
      name_uz:'DJI Mavic 3 Classic — Hasselblad kamera', name_ru:'DJI Mavic 3 Classic — камера Hasselblad',
      price:32500000, old:0, stock:'pre', qty:0, lead:21, rating:4.9, reviews:11, sold:34,
      imgs:['drone-air-10.jpg','drone-air-11.jpg','drone-air-1.jpg'],
      short_uz:"4/3 CMOS Hasselblad kamerasi, 46 daqiqa parvoz — kino sifatidagi aerosuratga olish.",
      short_ru:'Камера Hasselblad 4/3 CMOS, 46 минут полёта — аэросъёмка кинематографического уровня.',
      specs:[['Parvoz vaqti','Время полёта','46 daqiqa'],['Kamera','Камера','Hasselblad 4/3 CMOS'],["Og'irlik",'Вес','895 g'],['Video','Видео','5.1K/50fps'],['Uzatish masofasi','Дальность','15 km']] },

    { id:'p05', slug:'hubsan-zino-mini-se', cat:'dronlar', sub:'foto-video', brand:'Hubsan',
      name_uz:'Hubsan Zino Mini SE — arzon 4K dron', name_ru:'Hubsan Zino Mini SE — доступный 4K дрон',
      price:6900000, old:7800000, stock:'in', qty:12, lead:0, rating:4.3, reviews:28, sold:143, isHit:true,
      imgs:['drone-air-3.jpg','drone-air-5.jpg'],
      short_uz:"249 g dan yengil, 4K kamera va 3 o'qli gimbal — birinchi dron sifatida ideal tanlov.",
      short_ru:'Легче 249 г, камера 4K и 3-осевой гимбал — идеальный выбор для первого дрона.',
      specs:[['Parvoz vaqti','Время полёта','30 daqiqa'],['Kamera','Камера','4K/30fps'],["Og'irlik",'Вес','249 g'],['Gimbal','Гимбал',"3 o'qli"],['Uzatish masofasi','Дальность','6 km']] },

    /* ---------- FPV ---------- */
    { id:'p06', slug:'dji-avata-2', cat:'dronlar', sub:'fpv', brand:'DJI',
      name_uz:'DJI Avata 2 — FPV kombo (ko\'zoynak bilan)', name_ru:'DJI Avata 2 — FPV комбо (с очками)',
      price:14200000, old:15400000, stock:'in', qty:5, lead:0, rating:4.8, reviews:19, sold:77, isHit:true,
      imgs:['fpv-1.jpg','fpv-2.jpg','fpv-3.jpg','acc-controller-2.jpg'],
      short_uz:"Goggles 3 ko'zoynagi va Motion Control 3 pulti bilan to'liq FPV to'plami.",
      short_ru:'Полный FPV-комплект с очками Goggles 3 и пультом Motion Control 3.',
      specs:[['Parvoz vaqti','Время полёта','23 daqiqa'],['Kamera','Камера','4K/60fps'],['Tezlik','Скорость','27 m/s'],["Ko'zoynak",'Очки','Goggles 3'],['Himoya','Защита','Vint himoyasi']] },

    { id:'p07', slug:'speedybee-master-5-v2', cat:'dronlar', sub:'fpv', brand:'SpeedyBee',
      name_uz:'SpeedyBee Master 5 V2 — 5 dyuym poyga droni', name_ru:'SpeedyBee Master 5 V2 — 5-дюймовый гоночный',
      price:5400000, old:0, stock:'in', qty:9, lead:0, rating:4.7, reviews:12, sold:62,
      imgs:['fpv-4.jpg','fpv-5.jpg','fpv-6.jpg'],
      short_uz:"Freestyle uchun tayyor yig'ilgan ram, analog/digital video uzatish bilan mos.",
      short_ru:'Готовая рама для фристайла, совместима с аналоговой и цифровой видеопередачей.',
      specs:[['Ram','Рама','5 dyuym'],['Motor','Мотор','2306.5 1900KV'],['Kontroller','Контроллер','F7 V3'],['Video','Видео','Analog / DJI O3'],["Og'irlik",'Вес','420 g']] },

    { id:'p08', slug:'betafpv-cetus-x', cat:'dronlar', sub:'fpv', brand:'BetaFPV',
      name_uz:'BetaFPV Cetus X — o\'quv FPV to\'plami', name_ru:'BetaFPV Cetus X — учебный FPV набор',
      price:3200000, old:3700000, stock:'in', qty:14, lead:0, rating:4.5, reviews:34, sold:121,
      imgs:['fpv-7.jpg','fpv-2.jpg'],
      short_uz:"Uy ichida ham uchirsa bo'ladigan, ko'zoynak va pult bilan keladigan boshlang'ich FPV to'plami.",
      short_ru:'Стартовый FPV-набор с очками и пультом, летает даже в помещении.',
      specs:[['Turi','Тип','RTF to\'plam'],['Parvoz vaqti','Время полёта','5–7 daqiqa'],["Ko'zoynak",'Очки','VR03'],['Rejim','Режим','3 daraja'],["Og'irlik",'Вес','96 g']] },

    { id:'p09', slug:'iflight-nazgul-evoque', cat:'dronlar', sub:'fpv', brand:'iFlight',
      name_uz:'iFlight Nazgul Evoque F5 — cinematic FPV', name_ru:'iFlight Nazgul Evoque F5 — cinematic FPV',
      price:7600000, old:0, stock:'pre', qty:0, lead:16, rating:4.6, reviews:8, sold:29, isNew:true,
      imgs:['fpv-5.jpg','fpv-1.jpg','fpv-6.jpg'],
      short_uz:"GoPro o'rnatiladigan, DJI O3 raqamli video uzatish bilan sinxron ishlaydigan FPV dron.",
      short_ru:'FPV-дрон с креплением для GoPro и поддержкой цифровой передачи DJI O3.',
      specs:[['Ram','Рама','5 dyuym'],['Video','Видео','DJI O3 Air Unit'],['Motor','Мотор','2207 1800KV'],['Kamera','Камера','GoPro mos'],['Batareya','Батарея','6S 1300mAh']] },

    /* ---------- AGRO ---------- */
    { id:'p10', slug:'agro-spray-16l', cat:'dronlar', sub:'agro', brand:'EFT',
      name_uz:'EFT G420 — 16 L purkagich agrodron', name_ru:'EFT G420 — агродрон-опрыскиватель 16 л',
      price:58000000, old:0, stock:'pre', qty:0, lead:28, rating:4.7, reviews:6, sold:14,
      imgs:['agro-1.jpg','agro-2.jpg','agro-3.jpg'],
      short_uz:"16 litrli bak, soatiga 8–10 gektar ishlov berish quvvati, GPS bo'yicha avtomatik marshrut.",
      short_ru:'Бак 16 л, обработка 8–10 га в час, автоматический маршрут по GPS.',
      specs:[['Bak hajmi','Объём бака','16 L'],['Unumdorlik','Производительность','8–10 ga/soat'],['Parvoz vaqti','Время полёта','12 daqiqa'],['Navigatsiya','Навигация','RTK GPS'],['Radar','Радар','Relyef kuzatuvchi']] },

    { id:'p11', slug:'agro-survey-multispectral', cat:'dronlar', sub:'agro', brand:'Foxtech',
      name_uz:'Foxtech Agri-Scan — multispektral monitoring droni', name_ru:'Foxtech Agri-Scan — мультиспектральный дрон',
      price:44500000, old:0, stock:'pre', qty:0, lead:30, rating:4.5, reviews:4, sold:9, isNew:true,
      imgs:['agro-4.jpg','agro-5.jpg','agro-1.jpg'],
      short_uz:"Ekin holatini NDVI xaritasi orqali baholash uchun 5 kanalli multispektral kamera.",
      short_ru:'5-канальная мультиспектральная камера для оценки состояния посевов по NDVI.',
      specs:[['Kamera','Камера','5 kanal multispektral'],['Parvoz vaqti','Время полёта','55 daqiqa'],['Qamrov','Покрытие','120 ga / parvoz'],['Navigatsiya','Навигация','RTK'],['Dastur','ПО','NDVI xarita']] },

    /* ---------- O'QUV ---------- */
    { id:'p12', slug:'ryze-tello-edu', cat:'dronlar', sub:'oquv', brand:'Ryze',
      name_uz:'Ryze Tello EDU — dasturlash o\'rgatuvchi dron', name_ru:'Ryze Tello EDU — дрон для обучения программированию',
      price:1850000, old:2100000, stock:'in', qty:22, lead:0, rating:4.6, reviews:52, sold:263, isHit:true,
      imgs:['drone-air-9.jpg','drone-air-6.jpg'],
      short_uz:"Scratch va Python orqali boshqariladi — maktab va to'garaklar uchun eng mashhur o'quv droni.",
      short_ru:'Управляется через Scratch и Python — самый популярный учебный дрон для школ и кружков.',
      specs:[['Parvoz vaqti','Время полёта','13 daqiqa'],['Kamera','Камера','5 MP / 720p'],['Dasturlash','Программирование','Scratch, Python'],["Og'irlik",'Вес','87 g'],['Yosh','Возраст','10+']] },

    { id:'p13', slug:'syma-x500-pro', cat:'dronlar', sub:'oquv', brand:'Syma',
      name_uz:'Syma X500 Pro — arzon GPS dron', name_ru:'Syma X500 Pro — недорогой GPS дрон',
      price:1250000, old:1490000, stock:'in', qty:31, lead:0, rating:4.1, reviews:76, sold:341,
      imgs:['drone-air-4.jpg','drone-air-8.jpg'],
      short_uz:"GPS bilan avtomatik qaytish funksiyasi — birinchi tajriba uchun xavfsiz va arzon variant.",
      short_ru:'Автовозврат по GPS — безопасный и недорогой вариант для первого опыта.',
      specs:[['Parvoz vaqti','Время полёта','18 daqiqa'],['Kamera','Камера','4K interpolatsiya'],['GPS','GPS','Bor, auto-return'],['Uzatish masofasi','Дальность','300 m'],['Yosh','Возраст','14+']] },

    /* ---------- AKSESSUAR ---------- */
    { id:'p14', slug:'mini4-intelligent-battery', cat:'aksessuar', sub:'batareya', brand:'DJI',
      name_uz:'DJI Mini 4 Pro aqlli batareyasi (Plus)', name_ru:'Умный аккумулятор DJI Mini 4 Pro (Plus)',
      price:1290000, old:0, stock:'in', qty:26, lead:0, rating:4.8, reviews:31, sold:212,
      imgs:['acc-battery-1.jpg','acc-battery-2.jpg'],
      short_uz:"Parvoz vaqtini 45 daqiqagacha uzaytiradigan kengaytirilgan batareya.",
      short_ru:'Расширенный аккумулятор, увеличивающий время полёта до 45 минут.',
      specs:[['Sig\'im','Ёмкость','3850 mAh'],['Kuchlanish','Напряжение','14.76 V'],['Parvoz vaqti','Время полёта','45 daqiqagacha'],['Mos','Совместимость','Mini 4 Pro / Mini 3']] },

    { id:'p15', slug:'lipo-6s-1300', cat:'aksessuar', sub:'batareya', brand:'Tattu',
      name_uz:'Tattu R-Line 6S 1300mAh 120C LiPo', name_ru:'Tattu R-Line 6S 1300mAh 120C LiPo',
      price:520000, old:610000, stock:'in', qty:48, lead:0, rating:4.7, reviews:44, sold:389, isHit:true,
      imgs:['acc-battery-3.jpg','acc-battery-2.jpg'],
      short_uz:"FPV poyga dronlari uchun yuqori oqim beruvchi professional LiPo batareya.",
      short_ru:'Профессиональный LiPo-аккумулятор с высокой токоотдачей для гоночных FPV.',
      specs:[['Sig\'im','Ёмкость','1300 mAh'],['Konfiguratsiya','Конфигурация','6S (22.2V)'],['Razryad','Разряд','120C'],['Konnektor','Разъём','XT60'],["Og'irlik",'Вес','218 g']] },

    { id:'p16', slug:'dji-rc-2-controller', cat:'aksessuar', sub:'pult', brand:'DJI',
      name_uz:'DJI RC 2 — ekranli pult', name_ru:'DJI RC 2 — пульт со встроенным экраном',
      price:4300000, old:0, stock:'in', qty:6, lead:0, rating:4.8, reviews:17, sold:64,
      imgs:['acc-controller-1.jpg','acc-controller-3.jpg','acc-controller-4.jpg'],
      short_uz:"5.5 dyuymli yorqin ekran, telefon kerak emas — 700 nit yorqinlik quyoshda ham ko'rinadi.",
      short_ru:'Яркий 5,5" экран, телефон не нужен — 700 нит видно даже на солнце.',
      specs:[['Ekran','Экран','5.5" 700 nit'],['Ishlash vaqti','Автономность','3 soat'],['Uzatish','Передача','O4 / 20 km'],['Mos','Совместимость','Mini 4 Pro, Air 3']] },

    { id:'p17', slug:'dji-goggles-3', cat:'aksessuar', sub:'pult', brand:'DJI',
      name_uz:'DJI Goggles 3 — FPV ko\'zoynagi', name_ru:'DJI Goggles 3 — FPV очки',
      price:8700000, old:9400000, stock:'in', qty:4, lead:0, rating:4.9, reviews:13, sold:41, isNew:true,
      imgs:['acc-controller-2.jpg','fpv-3.jpg'],
      short_uz:"Micro-OLED ekranlar, 1080p/100fps jonli tasvir va real vaqtdagi ko'rish rejimi.",
      short_ru:'Micro-OLED экраны, живая картинка 1080p/100fps и режим сквозного обзора.',
      specs:[['Ekran','Экран','Micro-OLED 1080p'],['Kechikish','Задержка','24 ms'],['Ishlash vaqti','Автономность','3 soat'],['Diopter','Диоптрии','-6.0 dan +2.0 gacha']] },

    { id:'p18', slug:'propeller-set-5inch', cat:'aksessuar', sub:'vint', brand:'Gemfan',
      name_uz:'Gemfan 51466 vintlar to\'plami (8 dona)', name_ru:'Комплект пропеллеров Gemfan 51466 (8 шт)',
      price:145000, old:0, stock:'in', qty:120, lead:0, rating:4.6, reviews:63, sold:512,
      imgs:['fpv-6.jpg','fpv-4.jpg'],
      short_uz:"5 dyuymli FPV dronlar uchun chidamli polikarbonat vintlar, 4 juft.",
      short_ru:'Прочные поликарбонатные пропеллеры для 5-дюймовых FPV, 4 пары.',
      specs:[['O\'lcham','Размер','5.1×4.66"'],['Material','Материал','Polikarbonat'],['Soni','Количество','8 dona'],['Val','Вал','5 mm']] },

    { id:'p19', slug:'hardcase-drone-bag', cat:'aksessuar', sub:'sumka', brand:'PGYTECH',
      name_uz:'PGYTECH OneMo — dron uchun ryukzak-keys', name_ru:'PGYTECH OneMo — рюкзак-кейс для дрона',
      price:1750000, old:1950000, stock:'in', qty:11, lead:0, rating:4.7, reviews:22, sold:97,
      imgs:['acc-controller-4.jpg','drone-air-2.jpg'],
      short_uz:"Dron, pult, batareya va noutbuk uchun ajratilgan bo'limlar; suv o'tkazmaydigan mato.",
      short_ru:'Отделения для дрона, пульта, батарей и ноутбука; водоотталкивающая ткань.',
      specs:[['Hajm','Объём','25 L'],['Material','Материал','Suv o\'tkazmas'],['Noutbuk','Ноутбук','16" gacha'],["Og'irlik",'Вес','1.6 kg']] },

    /* ---------- KAMERA ---------- */
    { id:'p20', slug:'gopro-hero-13', cat:'kameralar', sub:'action', brand:'GoPro',
      name_uz:'GoPro HERO13 Black — 5.3K action kamera', name_ru:'GoPro HERO13 Black — экшн-камера 5.3K',
      price:7950000, old:8900000, stock:'in', qty:8, lead:0, rating:4.8, reviews:37, sold:158, isHit:true,
      imgs:['cam-1.jpg','cam-2.jpg','cam-3.jpg'],
      short_uz:"5.3K/60fps video, HyperSmooth 6.0 stabilizatsiya, 10 m gacha suvga chidamli.",
      short_ru:'Видео 5.3K/60fps, стабилизация HyperSmooth 6.0, водозащита до 10 м.',
      specs:[['Video','Видео','5.3K/60fps'],['Stabilizatsiya','Стабилизация','HyperSmooth 6.0'],['Suvga chidamlilik','Водозащита','10 m'],['Foto','Фото','27 MP'],['Ekran','Экран','2× sensorli']] },

    { id:'p21', slug:'insta360-x4', cat:'kameralar', sub:'action', brand:'Insta360',
      name_uz:'Insta360 X4 — 8K 360° kamera', name_ru:'Insta360 X4 — 360° камера 8K',
      price:8400000, old:0, stock:'in', qty:5, lead:0, rating:4.9, reviews:26, sold:112, isNew:true,
      imgs:['cam-3.jpg','cam-4.jpg','cam-2.jpg'],
      short_uz:"360 gradus 8K video — avval yozib oling, keyin kadrni tanlang. Ko'rinmas selfi-tayoq effekti.",
      short_ru:'Панорамное видео 8K — снимай сначала, кадрируй потом. Эффект невидимого моноpod.',
      specs:[['Video','Видео','8K 360°'],['Batareya','Батарея','2290 mAh'],['Suvga chidamlilik','Водозащита','10 m'],['Ekran','Экран','2.5" sensorli'],['Rejim','Режим','360° / bir tomonlama']] },

    { id:'p22', slug:'dji-osmo-action-5', cat:'kameralar', sub:'action', brand:'DJI',
      name_uz:'DJI Osmo Action 5 Pro', name_ru:'DJI Osmo Action 5 Pro',
      price:6300000, old:6900000, stock:'in', qty:10, lead:0, rating:4.7, reviews:19, sold:88,
      imgs:['cam-2.jpg','cam-1.jpg'],
      short_uz:"1/1.3\" sensor, 4 soatgacha yozuv, sovuqqa chidamli batareya — sayohat uchun mos.",
      short_ru:'Сенсор 1/1.3", до 4 часов записи, морозостойкая батарея — идеально для поездок.',
      specs:[['Video','Видео','4K/120fps'],['Sensor','Сенсор','1/1.3"'],['Batareya','Батарея','4 soat'],['Suvga chidamlilik','Водозащита','20 m']] },

    { id:'p23', slug:'dji-osmo-mobile-7', cat:'kameralar', sub:'gimbal', brand:'DJI',
      name_uz:'DJI Osmo Mobile 7P — telefon gimbali', name_ru:'DJI Osmo Mobile 7P — гимбал для телефона',
      price:2350000, old:2650000, stock:'in', qty:15, lead:0, rating:4.7, reviews:41, sold:203, isHit:true,
      imgs:['gimbal-1.jpg','gimbal-2.jpg','gimbal-3.jpg'],
      short_uz:"3 o'qli stabilizatsiya, ActiveTrack kuzatuv moduli va o'rnatilgan uzaytirgich tayoq.",
      short_ru:'3-осевая стабилизация, модуль слежения ActiveTrack и встроенный удлинитель.',
      specs:[['O\'qlar','Оси',"3 o'qli"],['Ishlash vaqti','Автономность','10 soat'],['Kuzatuv','Слежение','ActiveTrack 7.0'],["Og'irlik",'Вес','368 g']] },

    { id:'p24', slug:'zhiyun-crane-m3s', cat:'kameralar', sub:'gimbal', brand:'Zhiyun',
      name_uz:'Zhiyun Crane M3S — kamera stabilizatori', name_ru:'Zhiyun Crane M3S — стабилизатор для камер',
      price:4200000, old:0, stock:'pre', qty:0, lead:14, rating:4.5, reviews:9, sold:31,
      imgs:['gimbal-3.jpg','gimbal-2.jpg'],
      short_uz:"Beshigacha kg og'irlikdagi kameralarni ushlaydi, o'rnatilgan LED yorug'lik bilan.",
      short_ru:'Держит камеры весом до 2 кг, со встроенной LED-подсветкой.',
      specs:[['Yuk','Нагрузка','2 kg'],['Ishlash vaqti','Автономность','13 soat'],['Yorug\'lik','Подсветка','1000 lux LED'],['Ekran','Экран','1.22" sensorli']] },

    /* ---------- GADJET ---------- */
    { id:'p25', slug:'smart-home-kit', cat:'gadjet', sub:'aqlli-uy', brand:'Aqara',
      name_uz:'Aqara Smart Home Starter Kit', name_ru:'Aqara Smart Home Starter Kit',
      price:1650000, old:1890000, stock:'in', qty:18, lead:0, rating:4.6, reviews:24, sold:134,
      imgs:['gadget-1.jpg','gadget-2.jpg','gadget-3.jpg'],
      short_uz:"Hub, harakat sensori, eshik sensori va aqlli rozetka — aqlli uyni boshlash to'plami.",
      short_ru:'Хаб, датчик движения, датчик двери и умная розетка — стартовый набор умного дома.',
      specs:[['Tarkib','Состав','4 qurilma'],['Protokol','Протокол','Zigbee 3.0'],['Ilova','Приложение','Aqara Home'],['Mos','Совместимость','HomeKit, Alexa']] },

    { id:'p26', slug:'smart-projector-mini', cat:'gadjet', sub:'aqlli-uy', brand:'Xiaomi',
      name_uz:'Xiaomi Mi Smart Projector 2 Mini', name_ru:'Xiaomi Mi Smart Projector 2 Mini',
      price:3450000, old:0, stock:'in', qty:7, lead:0, rating:4.4, reviews:16, sold:71,
      imgs:['gadget-4.jpg','gadget-5.jpg'],
      short_uz:"1080p portativ proyektor, avtomatik fokus va Android TV o'rnatilgan.",
      short_ru:'Портативный проектор 1080p с автофокусом и встроенным Android TV.',
      specs:[['Ruxsat','Разрешение','1920×1080'],['Yorqinlik','Яркость','500 ANSI lm'],['OS','ОС','Android TV'],['Ovoz','Звук','2× 5W']] },

    { id:'p27', slug:'smart-watch-gt5', cat:'gadjet', sub:'kiyiladigan', brand:'Huawei',
      name_uz:'Huawei Watch GT 5 Pro', name_ru:'Huawei Watch GT 5 Pro',
      price:4100000, old:4500000, stock:'in', qty:13, lead:0, rating:4.7, reviews:29, sold:167,
      imgs:['gadget-3.jpg','gadget-5.jpg'],
      short_uz:"Titan korpus, 14 kunlik batareya, GPS va sog'liq monitoringi.",
      short_ru:'Титановый корпус, 14 дней автономности, GPS и мониторинг здоровья.',
      specs:[['Ekran','Экран','1.43" AMOLED'],['Batareya','Батарея','14 kun'],['Korpus','Корпус','Titan'],['Suvga chidamlilik','Водозащита','5 ATM']] },

    /* ---------- ROBOT ---------- */
    { id:'p28', slug:'unitree-go2-air', cat:'robot', sub:'robot-it', brand:'Unitree',
      name_uz:'Unitree Go2 Air — robot-it', name_ru:'Unitree Go2 Air — робо-собака',
      price:38900000, old:0, stock:'pre', qty:0, lead:25, rating:4.8, reviews:5, sold:12, isNew:true,
      imgs:['robot-1.jpg','robot-2.jpg','robot-3.jpg'],
      short_uz:"To'siqlarni aylanib o'tuvchi, ovozli boshqariladigan va SDK orqali dasturlanadigan robot-it.",
      short_ru:'Робо-собака с обходом препятствий, голосовым управлением и программированием через SDK.',
      specs:[['Tezlik','Скорость','2.5 m/s'],['Ishlash vaqti','Автономность','2 soat'],['Sensor','Сенсор','4D LiDAR'],['SDK','SDK','Python / C++'],["Og'irlik",'Вес','15 kg']] },

    { id:'p29', slug:'makeblock-mbot-2', cat:'robot', sub:'oquv-robot', brand:'Makeblock',
      name_uz:"Makeblock mBot 2 — o'quv roboti", name_ru:'Makeblock mBot 2 — обучающий робот',
      price:1950000, old:2250000, stock:'in', qty:20, lead:0, rating:4.6, reviews:33, sold:189,
      imgs:['robot-3.jpg','robot-2.jpg'],
      short_uz:"Scratch va Python o'rgatuvchi STEM robot — maktab to'garaklari uchun mos.",
      short_ru:'STEM-робот для обучения Scratch и Python — подходит для школьных кружков.',
      specs:[['Dasturlash','Программирование','Scratch, Python'],['Sensor','Сенсор','Ultratovush, chiziq'],['Wi-Fi','Wi-Fi','Bor'],['Yosh','Возраст','8+']] },

    /* ---------- TRANSPORT ---------- */
    { id:'p30', slug:'xiaomi-scooter-5-pro', cat:'transport', sub:'skuter', brand:'Xiaomi',
      name_uz:'Xiaomi Electric Scooter 5 Pro', name_ru:'Xiaomi Electric Scooter 5 Pro',
      price:6800000, old:7400000, stock:'in', qty:9, lead:0, rating:4.6, reviews:38, sold:176, isHit:true,
      imgs:['scooter-1.jpg','scooter-2.jpg','scooter-3.jpg'],
      short_uz:"60 km quvvat zaxirasi, 25 km/soat tezlik va ikki tomonlama amortizatsiya.",
      short_ru:'Запас хода 60 км, скорость 25 км/ч и двойная амортизация.',
      specs:[['Quvvat zaxirasi','Запас хода','60 km'],['Tezlik','Скорость','25 km/soat'],['Motor','Мотор','700 W'],['Yuk','Нагрузка','120 kg'],["Og'irlik",'Вес','19.5 kg']] },

    { id:'p31', slug:'segway-ninebot-f2', cat:'transport', sub:'skuter', brand:'Segway',
      name_uz:'Segway Ninebot F2 Plus', name_ru:'Segway Ninebot F2 Plus',
      price:8300000, old:0, stock:'pre', qty:0, lead:20, rating:4.5, reviews:11, sold:43,
      imgs:['scooter-4.jpg','scooter-2.jpg'],
      short_uz:"55 km masofa, o'z-o'zini tiklovchi shinalar va mobil ilova bilan boshqaruv.",
      short_ru:'55 км хода, самовосстанавливающиеся шины и управление через приложение.',
      specs:[['Quvvat zaxirasi','Запас хода','55 km'],['Tezlik','Скорость','25 km/soat'],['Shina','Шины','10" tubeless'],['Ilova','Приложение','Segway-Ninebot']] },

    { id:'p32', slug:'hoverboard-pro-8', cat:'transport', sub:'giro', brand:'Smart Balance',
      name_uz:'Smart Balance Pro 8" — giroskuter', name_ru:'Smart Balance Pro 8" — гироскутер',
      price:2450000, old:2800000, stock:'in', qty:16, lead:0, rating:4.2, reviews:47, sold:238,
      imgs:['scooter-3.jpg','scooter-1.jpg'],
      short_uz:"Bluetooth kolonka, LED yoritish va mobil ilova bilan boshqariladigan giroskuter.",
      short_ru:'Гироскутер с Bluetooth-колонкой, LED-подсветкой и управлением через приложение.',
      specs:[['Quvvat zaxirasi','Запас хода','20 km'],['Tezlik','Скорость','15 km/soat'],['Yuk','Нагрузка','120 kg'],['Qo\'shimcha','Дополнительно','Bluetooth, LED']] }
  ],

  posts: [
    { id:'b1', slug:'dron-tanlash-2026', img:'drone-air-2.jpg', date:'2026-08-24', cat_uz:'Qo\'llanma', cat_ru:'Гид',
      title_uz:"2026-yilda birinchi dronni qanday tanlash kerak?", title_ru:'Как выбрать первый дрон в 2026 году?',
      lead_uz:"Byudjet, og'irlik toifasi, kamera va parvoz vaqti — xarid qilishdan oldin e'tibor beriladigan 6 mezon.",
      lead_ru:'Бюджет, весовая категория, камера и время полёта — 6 критериев перед покупкой.',
      body_uz:"<h2>1. Og'irlik toifasi eng muhim mezon</h2><p>249 grammdan yengil dronlar ko'p mamlakatlarda soddalashtirilgan tartibda ro'yxatdan o'tkaziladi. Shuning uchun birinchi dron sifatida <strong>Mini</strong> turkumidagi modellar tavsiya etiladi.</p><h2>2. Parvoz vaqti va batareya</h2><p>Reklamada ko'rsatilgan vaqt ideal sharoitdagi ko'rsatkich. Amalda shamol va sovuq havoda 20–25% kamayadi. Shuning uchun kamida bitta zaxira batareya olishni rejalashtiring.</p><h2>3. Kamera va gimbal</h2><p>Kontent yaratish uchun <strong>3 o'qli mexanik gimbal</strong> shart. Elektron stabilizatsiya (EIS) uni to'liq almashtira olmaydi.</p><h2>4. To'siqni sezish sensorlari</h2><p>Boshlang'ich uchuvchi uchun bu funksiya dronni sindirib qo'yishdan saqlaydi va o'zini oqlaydi.</p><h2>5. Uzatish masofasi</h2><p>Shahar sharoitida Wi-Fi shovqini ko'p bo'lgani uchun haqiqiy masofa e'lon qilingandan sezilarli kam bo'ladi.</p><h2>6. Xizmat ko'rsatish va ehtiyot qismlar</h2><p>Vint, batareya va motor kabi qismlar bozorda oson topiladigan model tanlash uzoq muddatda arzonga tushadi.</p>",
      body_ru:"<h2>1. Весовая категория — главный критерий</h2><p>Дроны легче 249 граммов во многих странах регистрируются по упрощённой процедуре. Поэтому в качестве первого дрона рекомендуются модели серии <strong>Mini</strong>.</p><h2>2. Время полёта и батарея</h2><p>Заявленное время — показатель в идеальных условиях. На практике ветер и холод сокращают его на 20–25%. Планируйте как минимум одну запасную батарею.</p><h2>3. Камера и гимбал</h2><p>Для создания контента нужен <strong>3-осевой механический гимбал</strong>. Электронная стабилизация не заменит его полностью.</p><h2>4. Датчики препятствий</h2><p>Для начинающего пилота эта функция окупается — она спасает дрон от поломки.</p><h2>5. Дальность передачи</h2><p>В городе из-за помех Wi-Fi реальная дальность заметно ниже заявленной.</p><h2>6. Сервис и запчасти</h2><p>Модель, для которой легко найти винты, батареи и моторы, в долгую обходится дешевле.</p>" },

    { id:'b2', slug:'dron-royxatdan-otkazish', img:'agro-2.jpg', date:'2026-08-12', cat_uz:'Qonunchilik', cat_ru:'Законодательство',
      title_uz:"O'zbekistonda dronni ro'yxatdan o'tkazish: nimalarni bilish kerak", title_ru:'Регистрация дрона в Узбекистане: что нужно знать',
      lead_uz:"Qoidalar o'zgarish bosqichida. Xaridordan ko'pincha so'raladigan savollarga qisqacha javoblar.",
      lead_ru:'Правила меняются. Краткие ответы на частые вопросы покупателей.',
      body_uz:"<p><strong>Diqqat:</strong> quyidagi ma'lumot yuridik maslahat emas. Rasmiy qadam tashlashdan oldin tegishli davlat organiga murojaat qiling.</p><h2>Ro'yxatdan o'tkazish kimga tegishli</h2><p>Amaliyotda talablar dronning og'irligi va foydalanish maqsadiga (shaxsiy yoki tijorat) bog'liq bo'ladi. 249 g dan yengil modellar odatda eng yumshoq tartibga tushadi.</p><h2>Uchirish taqiqlangan hududlar</h2><p>Aeroport atrofidagi zona, harbiy obyektlar, davlat muassasalari ustidan uchirish taqiqlanadi. Uchirishdan oldin hududni tekshiring.</p><h2>Tijorat maqsadida foydalanish</h2><p>Aerosuratga olish xizmatini ko'rsatish yoki agrodron bilan ishlash uchun qo'shimcha ruxsat talab qilinishi mumkin.</p><h2>Bizning yordamimiz</h2><p>Xarid qilgan mijozlarimizga hujjatlarni rasmiylashtirish bo'yicha maslahat va amaldagi talablar ro'yxatini beramiz.</p>",
      body_ru:"<p><strong>Внимание:</strong> информация ниже не является юридической консультацией. Перед официальными шагами обратитесь в соответствующий госорган.</p><h2>Кого касается регистрация</h2><p>На практике требования зависят от веса дрона и цели использования (личная или коммерческая). Модели легче 249 г обычно попадают под самый мягкий режим.</p><h2>Запрещённые зоны</h2><p>Полёты запрещены вблизи аэропортов, над военными объектами и госучреждениями. Проверяйте зону перед полётом.</p><h2>Коммерческое использование</h2><p>Для услуг аэросъёмки или работы с агродроном может потребоваться дополнительное разрешение.</p><h2>Наша помощь</h2><p>Покупателям мы даём консультацию по оформлению документов и список актуальных требований.</p>" },

    { id:'b3', slug:'xitoydan-olib-kelish-jarayoni', img:'drone-air-7.jpg', date:'2026-07-30', cat_uz:'Logistika', cat_ru:'Логистика',
      title_uz:"Xitoydan buyurtma: 1688 dan sizning eshigingizgacha", title_ru:'Заказ из Китая: от 1688 до вашей двери',
      lead_uz:"Buyurtma berilgandan keyin mahsulot qanday yo'l bosib o'tadi va nega 2–4 hafta kerak bo'ladi.",
      lead_ru:'Какой путь проходит товар после заказа и почему нужно 2–4 недели.',
      body_uz:"<h2>1-bosqich: tekshiruv va sotib olish (1–3 kun)</h2><p>Buyurtmangiz tasdiqlangach, biz yetkazib beruvchining reytingi va mahsulot partiyasini tekshiramiz, so'ng to'lovni amalga oshiramiz.</p><h2>2-bosqich: Xitoy ombori (2–5 kun)</h2><p>Mahsulot Guanchjoudagi konsolidatsiya omborimizga keladi, u yerda tekshiriladi va qayta qadoqlanadi. Batareyali tovarlar alohida tartibda jo'natiladi.</p><h2>3-bosqich: transport (7–18 kun)</h2><p>Avtomobil yoki temir yo'l orqali Toshkentga jo'natiladi. Aviayetkazib berish tezroq, lekin litiy batareyalar uchun cheklovlar bor.</p><h2>4-bosqich: bojxona va yetkazib berish (2–4 kun)</h2><p>Rasmiylashtiruvdan so'ng kuryer sizga yetkazadi. Har bir bosqich shaxsiy kabinetingizda ko'rinib turadi.</p>",
      body_ru:"<h2>Этап 1: проверка и закупка (1–3 дня)</h2><p>После подтверждения заказа мы проверяем рейтинг поставщика и партию товара, затем оплачиваем.</p><h2>Этап 2: склад в Китае (2–5 дней)</h2><p>Товар поступает на наш консолидационный склад в Гуанчжоу, проверяется и переупаковывается. Товары с батареями отправляются отдельно.</p><h2>Этап 3: транспортировка (7–18 дней)</h2><p>Отправка в Ташкент авто или ж/д. Авиа быстрее, но для литиевых батарей есть ограничения.</p><h2>Этап 4: таможня и доставка (2–4 дня)</h2><p>После оформления курьер доставляет вам. Каждый этап виден в личном кабинете.</p>" },

    { id:'b4', slug:'fpv-boshlash', img:'fpv-1.jpg', date:'2026-07-15', cat_uz:'Qo\'llanma', cat_ru:'Гид',
      title_uz:"FPV uchishni noldan boshlash: kerakli jihozlar ro'yxati", title_ru:'Начать FPV с нуля: список необходимого',
      lead_uz:"Simulyator, o'quv dron, ko'zoynak, batareyalar va zaryadlagich — real byudjet hisobi bilan.",
      lead_ru:'Симулятор, учебный дрон, очки, батареи и зарядка — с реальным расчётом бюджета.',
      body_uz:"<h2>Avval simulyator</h2><p>Birinchi 10–15 soatni simulyatorda o'tkazing. Bu bitta singan dron narxini tejaydi.</p><h2>O'quv dron</h2><p>Uy sharoitida uchadigan kichik whoop-dron (masalan, Cetus X) eng xavfsiz boshlash nuqtasi.</p><h2>Ko'zoynak</h2><p>Analog arzonroq, raqamli (DJI O3) tasviri ancha toza. Byudjetga qarab tanlanadi.</p><h2>Batareya va zaryadlagich</h2><p>Kamida 4 ta batareya va normal balans-zaryadlagich oling — bitta uchish sessiyasi shuncha talab qiladi.</p><h2>Taxminiy byudjet</h2><p>To'liq boshlang'ich to'plam 4–7 mln so'm oralig'ida chiqadi.</p>",
      body_ru:"<h2>Сначала симулятор</h2><p>Первые 10–15 часов проведите в симуляторе. Это экономит стоимость одного разбитого дрона.</p><h2>Учебный дрон</h2><p>Маленький whoop (например, Cetus X) для дома — самая безопасная точка старта.</p><h2>Очки</h2><p>Аналог дешевле, цифра (DJI O3) даёт куда более чистую картинку. Выбор по бюджету.</p><h2>Батареи и зарядка</h2><p>Возьмите минимум 4 батареи и нормальное балансирное зарядное — столько уходит за одну сессию.</p><h2>Примерный бюджет</h2><p>Полный стартовый набор выходит в 4–7 млн сум.</p>" },

    { id:'b5', slug:'agrodron-fermerga', img:'agro-1.jpg', date:'2026-06-28', cat_uz:'Agro', cat_ru:'Агро',
      title_uz:"Agrodron fermerga qancha tejaydi?", title_ru:'Сколько агродрон экономит фермеру?',
      lead_uz:"16 litrli purkagich dron bilan an'anaviy usulni taqqoslash — gektar hisobidagi real raqamlar.",
      lead_ru:'Сравнение опрыскивателя 16 л с традиционным методом — реальные цифры на гектар.',
      body_uz:"<h2>Vaqt bo'yicha</h2><p>Bir gektarga qo'lda ishlov berish 40–60 daqiqa vaqt oladi, dron esa 6–8 daqiqada bajaradi.</p><h2>Kimyoviy moddalar sarfi</h2><p>Aniq purkash tufayli preparat sarfi 20–30% ga kamayadi, suv sarfi esa bir necha barobar tushadi.</p><h2>Xavfsizlik</h2><p>Ishchi kimyoviy modda bilan bevosita kontaktga kirmaydi.</p><h2>Qoplanish muddati</h2><p>200 gektardan katta maydonlarda qurilma odatda bir mavsumda o'zini oqlaydi.</p>",
      body_ru:"<h2>По времени</h2><p>Ручная обработка гектара занимает 40–60 минут, дрон справляется за 6–8 минут.</p><h2>Расход химикатов</h2><p>За счёт точного распыления расход препарата падает на 20–30%, воды — в несколько раз.</p><h2>Безопасность</h2><p>Работник не контактирует с химикатами напрямую.</p><h2>Срок окупаемости</h2><p>На площадях свыше 200 га техника обычно окупается за один сезон.</p>" },

    { id:'b6', slug:'dron-qish-parvoz', img:'drone-air-10.jpg', date:'2026-06-10', cat_uz:'Maslahat', cat_ru:'Советы',
      title_uz:"Sovuq havoda dron uchirish: 7 ta qoida", title_ru:'Полёты в холод: 7 правил',
      lead_uz:"Qishda batareya sig'imi keskin tushadi. Dronni yo'qotmaslik uchun nima qilish kerak.",
      lead_ru:'Зимой ёмкость батареи резко падает. Что делать, чтобы не потерять дрон.',
      body_uz:"<h2>1. Batareyani isiting</h2><p>Uchirishdan oldin batareyani 20–25°C gacha isiting, cho'ntakda olib yuring.</p><h2>2. Havoda 30 soniya turing</h2><p>Ko'tarilgach bir joyda turib, batareya ish haroratiga chiqishini kuting.</p><h2>3. Zaxirani 30% da qoldiring</h2><p>Sovuqda kuchlanish keskin tushadi — 30% da qaytishni boshlang.</p><h2>4. Namlikdan saqlaning</h2><p>Qor va tuman elektronikaga kondensat beradi.</p><h2>5. Kompasni kalibrlang</h2><p>Yangi joyda har safar kalibrlash shart.</p><h2>6. Qo'lqop bilan uchirmang</h2><p>Stiklarni his qilish yo'qoladi — yupqa sensorli qo'lqop ishlating.</p><h2>7. Qaytgach isitmang</h2><p>Sovuq dronni birdan issiq xonaga olib kirmang, sekin isishiga qo'ying.</p>",
      body_ru:"<h2>1. Грейте батарею</h2><p>Перед взлётом прогрейте батарею до 20–25°C, носите во внутреннем кармане.</p><h2>2. Повисите 30 секунд</h2><p>После взлёта дайте батарее выйти на рабочую температуру.</p><h2>3. Возврат при 30%</h2><p>На холоде напряжение падает резко — начинайте возврат уже на 30%.</p><h2>4. Берегите от влаги</h2><p>Снег и туман дают конденсат на электронике.</p><h2>5. Калибруйте компас</h2><p>На новом месте калибровка обязательна каждый раз.</p><h2>6. Не летайте в толстых перчатках</h2><p>Теряется чувство стиков — используйте тонкие сенсорные.</p><h2>7. Не грейте резко</h2><p>Не заносите холодный дрон сразу в тёплую комнату.</p>" }
  ],

  faq: [
    { q_uz:"Buyurtma qancha vaqtda yetib keladi?", q_ru:'Сколько идёт доставка?',
      a_uz:"Omborda mavjud mahsulotlar Toshkent bo'ylab 1–2 kunda, viloyatlarga 2–4 kunda yetkaziladi. \"Buyurtma asosida\" belgisi bo'lgan mahsulotlar Xitoydan olib kelinadi — bu odatda 14–28 kun.",
      a_ru:'Товары в наличии доставляются по Ташкенту за 1–2 дня, в регионы за 2–4 дня. Товары с пометкой «под заказ» везём из Китая — обычно 14–28 дней.' },
    { q_uz:"Dronni O'zbekistonda ro'yxatdan o'tkazish shartmi?", q_ru:'Нужно ли регистрировать дрон в Узбекистане?',
      a_uz:"Talablar dronning og'irligi va foydalanish maqsadiga bog'liq va hozirda o'zgarish bosqichida. Xarid qilgan mijozlarimizga amaldagi tartib bo'yicha maslahat beramiz. Bu yuridik maslahat emas — rasmiy tasdiq uchun tegishli organga murojaat qiling.",
      a_ru:'Требования зависят от веса и цели использования и сейчас меняются. Покупателям мы консультируем по действующему порядку. Это не юридическая консультация — за официальным подтверждением обращайтесь в госорган.' },
    { q_uz:"Kafolat necha oy?", q_ru:'Какая гарантия?',
      a_uz:"Barcha dronlarga 12 oy, aksessuarlarga 6 oy kafolat. Kafolat noto'g'ri foydalanish natijasida sinishni (masalan, urilib tushish) qamrab olmaydi.",
      a_ru:'На все дроны 12 месяцев, на аксессуары 6 месяцев. Гарантия не покрывает поломки из-за неправильной эксплуатации (например, падение).' },
    { q_uz:"Mahsulotni qaytarish mumkinmi?", q_ru:'Можно ли вернуть товар?',
      a_uz:"Ha, tovar ko'rinishi va to'liq to'plami saqlangan holda 14 kun ichida qaytarish yoki almashtirish mumkin. Individual buyurtma bilan olib kelingan mahsulotlar bundan mustasno.",
      a_ru:'Да, в течение 14 дней при сохранении товарного вида и комплектности. Исключение — товары, привезённые под индивидуальный заказ.' },
    { q_uz:"To'lovni qanday amalga oshirish mumkin?", q_ru:'Как можно оплатить?',
      a_uz:"Click, Payme, Uzcard/Humo kartalari orqali onlayn yoki kuryerga naqd. Buyurtma asosida keladigan mahsulotlar uchun 50% oldindan to'lov olinadi.",
      a_ru:'Онлайн через Click, Payme, Uzcard/Humo или наличными курьеру. Для товаров под заказ берётся предоплата 50%.' },
    { q_uz:"Referal dasturi qanday ishlaydi?", q_ru:'Как работает реферальная программа?',
      a_uz:"Shaxsiy kabinetdagi havolangizni do'stingizga yuborasiz. U ro'yxatdan o'tib birinchi buyurtmasini rasmiylashtirsa — u 100 000 so'm chegirma oladi, siz esa uning har bir buyurtmasidan 3% bonus ball olasiz. Ballarni keyingi xaridda ishlatish mumkin.",
      a_ru:'Отправляете другу свою ссылку из личного кабинета. Он регистрируется и делает первый заказ — получает скидку 100 000 сум, а вы 3% бонусных баллов с каждого его заказа. Баллы можно тратить на следующие покупки.' },
    { q_uz:"Dron uchun ehtiyot qism topib berasizmi?", q_ru:'Поможете найти запчасти?',
      a_ru:'Да. Даже если запчасти нет на сайте, напишите в Telegram — привезём под заказ из Китая.',
      a_uz:"Ha. Saytda yo'q bo'lsa ham Telegram orqali yozing — Xitoydan buyurtma asosida olib kelamiz." },
    { q_uz:"Viloyatlarga yetkazib berasizmi?", q_ru:'Доставляете в регионы?',
      a_uz:"Ha, O'zbekistonning barcha viloyatlariga pochta va yetkazib berish xizmatlari orqali jo'natamiz. Narxi 55 000 so'mdan boshlanadi, 5 mln so'mdan yuqori buyurtmalarga bepul.",
      a_ru:'Да, отправляем во все регионы через почту и службы доставки. От 55 000 сум, при заказе свыше 5 млн сум — бесплатно.' }
  ],

  demoReviews: [
    { name:'Jasur R.', rate:5, date:'2026-08-18', text_uz:"Buyurtma 3 kunda yetib keldi, quti ochilmagan. Dron ishlayapti, kamera sifati zo'r.", text_ru:'Заказ пришёл за 3 дня, коробка запечатана. Дрон работает, качество камеры отличное.' },
    { name:'Nodira A.', rate:5, date:'2026-08-05', text_uz:"Telegram orqali barcha savollarimga sabr bilan javob berishdi. Tavsiya qilaman.", text_ru:'В Telegram терпеливо ответили на все вопросы. Рекомендую.' },
    { name:'Sardor T.', rate:4, date:'2026-07-22', text_uz:"Mahsulot yaxshi, lekin Xitoydan kutish 3 hafta cho'zildi. Oldindan ogohlantirishgan edi.", text_ru:'Товар хороший, но ждать из Китая пришлось 3 недели. Предупредили заранее.' },
    { name:'Bekzod M.', rate:5, date:'2026-07-11', text_uz:"Narxi bozordagidan arzon chiqdi, kafolat hujjati ham berildi.", text_ru:'Цена вышла ниже рыночной, гарантийный талон выдали.' }
  ]
};

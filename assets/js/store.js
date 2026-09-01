/* ===== Ma'lumot qatlami: localStorage + demo baza =====
   Backend qo'shilganda faqat shu fayldagi save/load funksiyalarini
   `fetch('/api/...')` chaqiruvlariga almashtirish yetarli bo'ladi. */
(function () {
  const K = {
    db: 'dm_db_v2', cart: 'dm_cart_v1', user: 'dm_user_v1',
    favs: 'dm_favs_v1', lang: 'dm_lang_v1', ref: 'dm_ref_v1', theme: 'dm_theme_v1'
  };

  const clone = o => JSON.parse(JSON.stringify(o));
  const read = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('localStorage yozib bo\'lmadi', e); } };

  /* ---------- Baza ---------- */
  function freshDb() {
    return {
      settings: clone(SEED.settings),
      categories: clone(SEED.categories),
      products: clone(SEED.products),
      posts: clone(SEED.posts),
      faq: clone(SEED.faq),
      reviews: {},                    // { productId: [ {name,rate,date,text} ] }
      users: [{ id: 'u_demo', name: 'Aziz Karimov', email: 'demo@mydrone.uz', pass: 'demo12345',
                phone: '+998 90 777 12 34', ref: 'AZIZ7734', refBy: null, bonus: 250000,
                invited: 2, earned: 412000, created: '2026-05-14' }],
      admins: [{ email: 'admin@mydrone.uz', pass: 'admin12345', name: 'Administrator' }],
      orders: demoOrders(),
      promos: [
        { code: 'SALOM10', type: 'percent', value: 10, active: true, note_uz: 'Birinchi xarid uchun 10%', note_ru: 'Первая покупка −10%' },
        { code: 'DRON500', type: 'fixed', value: 500000, active: true, note_uz: '500 000 so\'m chegirma', note_ru: 'Скидка 500 000 сум' }
      ],
      leads: []                       // callback / aloqa formasi
    };
  }

  function demoOrders() {
    return [
      { id: 'DM-24081', userId: 'u_demo', created: '2026-08-21T10:12:00', status: 'done',
        name: 'Aziz Karimov', phone: '+998 90 777 12 34', region: 'Toshkent sh.', city: 'Chilonzor',
        addr: 'Bunyodkor 12', pay: 'click', dlv: 'courier', note: '',
        items: [{ id: 'p05', qty: 1, price: 6900000 }, { id: 'p18', qty: 2, price: 145000 }],
        goods: 7190000, delivery: 0, discount: 0, total: 7190000 },
      { id: 'DM-24096', userId: 'u_demo', created: '2026-08-29T16:40:00', status: 'way',
        name: 'Aziz Karimov', phone: '+998 90 777 12 34', region: 'Toshkent sh.', city: 'Chilonzor',
        addr: 'Bunyodkor 12', pay: 'cash', dlv: 'courier', note: 'Kechqurun qo\'ng\'iroq qiling',
        items: [{ id: 'p14', qty: 1, price: 1290000 }],
        goods: 1290000, delivery: 30000, discount: 0, total: 1320000 },
      { id: 'DM-24103', userId: null, created: '2026-08-31T09:05:00', status: 'new',
        name: 'Shohrux Yusupov', phone: '+998 93 401 22 09', region: 'Samarqand', city: 'Samarqand sh.',
        addr: 'Registon 4', pay: 'payme', dlv: 'region', note: '',
        items: [{ id: 'p20', qty: 1, price: 7950000 }],
        goods: 7950000, delivery: 0, discount: 0, total: 7950000 },
      { id: 'DM-24107', userId: null, created: '2026-08-31T14:22:00', status: 'shipped',
        name: 'Dilnoza Rahimova', phone: '+998 97 155 88 40', region: 'Toshkent sh.', city: 'Yunusobod',
        addr: 'Amir Temur 108', pay: 'click', dlv: 'courier', note: '',
        items: [{ id: 'p02', qty: 1, price: 21900000 }],
        goods: 21900000, delivery: 0, discount: 0, total: 21900000 }
    ];
  }

  let db = read(K.db, null);
  if (!db || !db.products || !db.products.length) { db = freshDb(); write(K.db, db); }
  /* seed yangilansa yetishmayotgan bo'limlarni to'ldirish */
  ['settings','categories','products','posts','faq','users','admins','orders','promos','leads','reviews']
    .forEach(k => { if (db[k] === undefined) { db[k] = freshDb()[k]; } });

  const save = () => write(K.db, db);

  /* ---------- Til ---------- */
  let lang = read(K.lang, 'uz');
  const setLang = l => { lang = l; write(K.lang, l); };
  const t = k => (I18N[lang] && I18N[lang][k]) || (I18N.uz[k] || k);
  const L = (obj, field) => obj ? (obj[field + '_' + lang] ?? obj[field + '_uz'] ?? obj[field] ?? '') : '';

  /* ---------- Mavzu (yorug' / qorong'i) ---------- */
  let theme = read(K.theme, null);          // null = tizim sozlamasiga ergashadi
  function sysTheme() {
    try { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    catch (e) { return 'light'; }
  }
  const effTheme = () => theme || sysTheme();
  function setTheme(v) {
    theme = v; write(K.theme, v);
    document.documentElement.dataset.theme = v;
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.content = v === 'dark' ? '#080c17' : '#f5f7fb';
  }
  if (theme) { document.documentElement.dataset.theme = theme; }

  /* ---------- Savat ---------- */
  let cart = read(K.cart, []);
  const saveCart = () => write(K.cart, cart);
  function addToCart(id, qty) {
    qty = qty || 1;
    const row = cart.find(r => r.id === id);
    if (row) { row.qty += qty; } else { cart.push({ id, qty }); }
    saveCart();
  }
  function setQty(id, qty) {
    const row = cart.find(r => r.id === id);
    if (!row) return;
    row.qty = Math.max(1, Math.min(99, qty));
    saveCart();
  }
  const removeFromCart = id => { cart = cart.filter(r => r.id !== id); saveCart(); };
  const clearCart = () => { cart = []; saveCart(); };
  const cartCount = () => cart.reduce((s, r) => s + r.qty, 0);
  const cartRows = () => cart.map(r => ({ ...r, p: Store.product(r.id) })).filter(r => r.p);
  const cartGoods = () => cartRows().reduce((s, r) => s + r.p.price * r.qty, 0);

  /* ---------- Sevimlilar ---------- */
  let favs = read(K.favs, []);
  const isFav = id => favs.includes(id);
  const toggleFav = id => { favs = isFav(id) ? favs.filter(f => f !== id) : favs.concat(id); write(K.favs, favs); return isFav(id); };

  /* ---------- Foydalanuvchi ---------- */
  let user = read(K.user, null);
  function refreshUser() { if (user) { const u = db.users.find(x => x.id === user.id); user = u ? { ...u } : null; write(K.user, user); } }
  function login(email, pass) {
    const u = db.users.find(x => x.email.toLowerCase() === String(email).toLowerCase() && x.pass === pass);
    if (!u) return null;
    user = { ...u }; write(K.user, user); return user;
  }
  function register(name, email, pass, phone, refCode) {
    if (db.users.some(x => x.email.toLowerCase() === String(email).toLowerCase())) return { err: 'exists' };
    const inviter = refCode ? db.users.find(x => x.ref === String(refCode).toUpperCase()) : null;
    const u = {
      id: 'u_' + Date.now().toString(36),
      name, email, pass, phone: phone || '',
      ref: (String(name).replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DRON') + Math.floor(1000 + Math.random() * 9000),
      refBy: inviter ? inviter.id : null,
      bonus: inviter ? db.settings.refBonusNew : 0,
      invited: 0, earned: 0, created: new Date().toISOString().slice(0, 10)
    };
    db.users.push(u);
    if (inviter) { inviter.invited = (inviter.invited || 0) + 1; }
    save();
    user = { ...u }; write(K.user, user);
    return { user };
  }
  const logout = () => { user = null; localStorage.removeItem(K.user); };

  /* ---------- Buyurtma ---------- */
  function placeOrder(data) {
    const id = 'DM-' + Math.floor(24110 + Math.random() * 800);
    const order = {
      id, userId: user ? user.id : null, created: new Date().toISOString(), status: 'new',
      ...data,
      items: cartRows().map(r => ({ id: r.id, qty: r.qty, price: r.p.price }))
    };
    db.orders.unshift(order);
    /* zaxirani kamaytirish + referal bonusni hisoblash */
    order.items.forEach(it => {
      const p = db.products.find(x => x.id === it.id);
      if (p && p.stock === 'in') { p.qty = Math.max(0, (p.qty || 0) - it.qty); if (!p.qty) p.stock = 'out'; }
      if (p) p.sold = (p.sold || 0) + it.qty;
    });
    if (user && user.refBy) {
      const inv = db.users.find(x => x.id === user.refBy);
      if (inv) {
        const bonus = Math.round(order.total * (db.settings.refPercent / 100));
        inv.bonus = (inv.bonus || 0) + bonus;
        inv.earned = (inv.earned || 0) + bonus;
      }
    }
    if (user && data.bonusUsed) {
      const me = db.users.find(x => x.id === user.id);
      if (me) me.bonus = Math.max(0, (me.bonus || 0) - data.bonusUsed);
    }
    save(); refreshUser(); clearCart();
    return order;
  }

  /* ---------- Qidiruv / filtr ---------- */
  const norm = s => String(s || '').toLowerCase().replace(/[''`]/g, "'");
  function search(q) {
    q = norm(q).trim();
    if (!q) return [];
    return db.products.filter(p =>
      norm(p.name_uz).includes(q) || norm(p.name_ru).includes(q) ||
      norm(p.brand).includes(q) || norm(p.slug).includes(q)
    ).slice(0, 6);
  }

  /* ---------- Umumiy API ---------- */
  window.Store = {
    K, db, save, freshDb,
    get lang() { return lang; }, setLang, t, L,
    effTheme, setTheme, toggleTheme: () => setTheme(effTheme() === 'dark' ? 'light' : 'dark'),
    get user() { return user; }, login, register, logout, refreshUser,
    get cart() { return cart; }, addToCart, setQty, removeFromCart, clearCart,
    cartCount, cartRows, cartGoods,
    favs: () => favs, isFav, toggleFav,
    placeOrder, search,
    product: id => db.products.find(p => p.id === id),
    bySlug: s => db.products.find(p => p.slug === s),
    category: id => db.categories.find(c => c.id === id),
    post: s => db.posts.find(p => p.slug === s),
    brands: () => [...new Set(db.products.map(p => p.brand))].sort(),
    money: n => (Number(n) || 0).toLocaleString('ru-RU').replace(/,/g, ' '),
    reset: () => { localStorage.removeItem(K.db); location.reload(); }
  };
})();

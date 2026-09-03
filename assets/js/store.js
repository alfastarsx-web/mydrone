/* ===== Ma'lumot qatlami =====
 *
 * Ikki rejimda ishlaydi:
 *   1) ONLAYN  — backend (/api/*) mavjud bo'lsa, hamma narsa bazadan olinadi
 *   2) DEMO    — backend javob bermasa, avvalgidek localStorage va data.js dan
 *
 * Sahifalar kodi (app.js, admin.js) ikkala holatda ham bir xil ishlaydi:
 * API'dan kelgan ma'lumot shu yerda eski (frontend) shakliga o'giriladi.
 */
(function () {
  const K = {
    db: 'dm_db_v2', cart: 'dm_cart_v2', user: 'dm_user_v2',
    favs: 'dm_favs_v1', lang: 'dm_lang_v1', ref: 'dm_ref_v1', theme: 'dm_theme_v1',
    access: 'dm_access_v1', refresh: 'dm_refresh_v1'
  };

  const clone = o => JSON.parse(JSON.stringify(o));
  const read = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('localStorage yozib bo\'lmadi', e); } };
  const del = k => { try { localStorage.removeItem(k); } catch (e) {} };

  let online = false;                     // backend mavjudmi
  let access = read(K.access, null);
  let refreshToken = read(K.refresh, null);

  /* ---------- API chaqiruvi ---------- */
  async function api(path, opts = {}) {
    const o = { method: opts.method || 'GET', headers: { ...(opts.headers || {}) } };
    if (opts.body !== undefined) {
      o.headers['Content-Type'] = 'application/json';
      o.body = JSON.stringify(opts.body);
    }
    if (access && !opts.noAuth) o.headers.Authorization = 'Bearer ' + access;

    let res = await fetch('/api' + path, o);

    /* Token muddati tugagan bo'lsa — bir marta yangilab, qayta urinamiz */
    if (res.status === 401 && refreshToken && !opts.noAuth && !opts._retry) {
      const ok = await doRefresh();
      if (ok) return api(path, { ...opts, _retry: true });
    }
    if (!res.ok) {
      let msg = 'Xatolik yuz berdi';
      try { const body = await res.json(); msg = Array.isArray(body.message) ? body.message[0] : (body.message || msg); } catch (e) {}
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  async function doRefresh() {
    try {
      const r = await api('/auth/refresh', { method: 'POST', body: { refresh: refreshToken }, noAuth: true });
      setTokens(r.access, r.refresh);
      user = fromApi.user(r.user); write(K.user, user);
      return true;
    } catch (e) {
      setTokens(null, null); user = null; del(K.user);
      return false;
    }
  }

  function setTokens(a, r) {
    access = a; refreshToken = r;
    a ? write(K.access, a) : del(K.access);
    r ? write(K.refresh, r) : del(K.refresh);
  }

  /* ---------- API → frontend shakli ---------- */
  const fromApi = {
    product: p => ({
      id: p.id, slug: p.slug, cat: p.categoryId, sub: p.subId, brand: p.brand,
      name_uz: p.nameUz, name_ru: p.nameRu,
      price: Number(p.price), old: Number(p.oldPrice || 0),
      stock: p.stock, qty: p.qty, lead: p.lead,
      rating: Number(p.rating), reviews: p.reviewsCount, sold: p.sold,
      isNew: p.isNew, isHit: p.isHit, imgs: p.imgs && p.imgs.length ? p.imgs : ['drone-air-1.jpg'],
      short_uz: p.shortUz, short_ru: p.shortRu, specs: p.specs || [],
      active: p.active,
      reviewList: (p.reviews || []).map(fromApi.review)
    }),
    category: c => ({
      id: c.id, name_uz: c.nameUz, name_ru: c.nameRu, img: c.img, icon: c.icon,
      subs: (c.subs || []).map(s => ({ id: s.id, name_uz: s.nameUz, name_ru: s.nameRu }))
    }),
    post: b => ({
      id: b.id, slug: b.slug, img: b.img, date: String(b.date).slice(0, 10),
      cat_uz: b.catUz, cat_ru: b.catRu, title_uz: b.titleUz, title_ru: b.titleRu,
      lead_uz: b.leadUz, lead_ru: b.leadRu, body_uz: b.bodyUz, body_ru: b.bodyRu,
      published: b.published
    }),
    faq: f => ({ id: f.id, q_uz: f.qUz, q_ru: f.qRu, a_uz: f.aUz, a_ru: f.aRu }),
    review: r => ({ id: r.id, name: r.name, rate: r.rate, text: r.text,
      date: String(r.createdAt || '').slice(0, 10), approved: r.approved, productId: r.productId }),
    user: u => u && ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role,
      ref: u.ref, bonus: Number(u.bonus || 0), invited: u.invited || 0, earned: Number(u.earned || 0),
      created: String(u.created || '').slice(0, 10) }),
    order: o => ({
      id: o.id, userId: o.userId, created: o.createdAt || o.created, status: o.status,
      name: o.name, phone: o.phone, email: o.email, region: o.region, city: o.city,
      addr: o.addr, note: o.note, pay: o.pay, dlv: o.dlv,
      goods: Number(o.goods), delivery: Number(o.delivery), discount: Number(o.discount),
      bonusUsed: Number(o.bonusUsed || 0), total: Number(o.total), promo: o.promoCode,
      items: (o.items || []).map(i => ({
        id: i.productId, qty: i.qty, price: Number(i.price),
        name: i.nameSnapshot, img: i.imgSnapshot, slug: i.slugSnapshot
      }))
    }),
    promo: p => ({ code: p.code, type: p.type, value: Number(p.value), active: p.active,
      note_uz: p.noteUz, note_ru: p.noteRu, used: p.usedCount }),
    lead: l => ({ id: l.id, type: l.type, name: l.name, phone: l.phone, msg: l.msg,
      handled: l.handled, at: l.createdAt })
  };

  /* frontend → API (admin yozuvlari uchun) */
  const toApi = {
    product: p => ({
      id: p.id, slug: p.slug, categoryId: p.cat, subId: p.sub || null, brand: p.brand,
      nameUz: p.name_uz, nameRu: p.name_ru, price: p.price, oldPrice: p.old || 0,
      stock: p.stock, qty: p.qty, lead: p.lead, isNew: !!p.isNew, isHit: !!p.isHit,
      imgs: p.imgs, shortUz: p.short_uz, shortRu: p.short_ru, specs: p.specs || []
    }),
    category: c => ({ id: c.id, nameUz: c.name_uz, nameRu: c.name_ru, img: c.img, icon: c.icon || 'box' }),
    sub: (catId, s) => ({ id: s.id, categoryId: catId, nameUz: s.name_uz, nameRu: s.name_ru }),
    post: b => ({
      id: b.id, slug: b.slug, img: b.img, date: b.date, catUz: b.cat_uz, catRu: b.cat_ru,
      titleUz: b.title_uz, titleRu: b.title_ru, leadUz: b.lead_uz, leadRu: b.lead_ru,
      bodyUz: b.body_uz, bodyRu: b.body_ru
    }),
    promo: p => ({ code: p.code, type: p.type, value: p.value, active: p.active,
      noteUz: p.note_uz, noteRu: p.note_ru })
  };

  /* ---------- Demo baza (backend bo'lmaganda) ---------- */
  function freshDb() {
    return {
      settings: clone(SEED.settings),
      categories: clone(SEED.categories),
      products: clone(SEED.products),
      posts: clone(SEED.posts),
      faq: clone(SEED.faq),
      reviews: {},
      users: [{ id: 'u_demo', name: 'Aziz Karimov', email: 'demo@mydrone.uz', pass: 'demo12345',
                phone: '+998 90 777 12 34', ref: 'AZIZ7734', refBy: null, bonus: 250000,
                invited: 2, earned: 412000, created: '2026-05-14' }],
      admins: [{ email: 'admin@mydrone.uz', pass: 'admin12345', name: 'Administrator' }],
      orders: demoOrders(),
      promos: [
        { code: 'SALOM10', type: 'percent', value: 10, active: true, note_uz: 'Birinchi xarid uchun 10%', note_ru: 'Первая покупка −10%' },
        { code: 'DRON500', type: 'fixed', value: 500000, active: true, note_uz: '500 000 so\'m chegirma', note_ru: 'Скидка 500 000 сум' }
      ],
      leads: []
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
  if (!db || !db.products || !db.products.length) { db = freshDb(); }
  ['settings','categories','products','posts','faq','users','admins','orders','promos','leads','reviews']
    .forEach(k => { if (db[k] === undefined) { db[k] = freshDb()[k]; } });

  /** Demo rejimda o'zgarishlar brauzerda saqlanadi; onlayn rejimda kesh saqlanmaydi */
  const save = () => { if (!online) write(K.db, db); };

  /* ---------- Til ---------- */
  let lang = read(K.lang, 'uz');
  const setLang = l => { lang = l; write(K.lang, l); };
  const t = k => (I18N[lang] && I18N[lang][k]) || (I18N.uz[k] || k);
  const L = (obj, field) => obj ? (obj[field + '_' + lang] ?? obj[field + '_uz'] ?? obj[field] ?? '') : '';

  /* ---------- Mavzu ---------- */
  let theme = read(K.theme, null);
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

  async function login(email, pass) {
    if (online) {
      try {
        const r = await api('/auth/login', { method: 'POST', body: { email, password: pass }, noAuth: true });
        setTokens(r.access, r.refresh);
        user = fromApi.user(r.user); write(K.user, user);
        return user;
      } catch (e) { return null; }
    }
    const u = db.users.find(x => x.email.toLowerCase() === String(email).toLowerCase() && x.pass === pass);
    if (!u) return null;
    user = { ...u }; write(K.user, user); return user;
  }

  async function register(name, email, pass, phone, refCode) {
    if (online) {
      try {
        const r = await api('/auth/register', {
          method: 'POST', noAuth: true,
          body: { name, email, password: pass, phone, ref: refCode || undefined }
        });
        setTokens(r.access, r.refresh);
        user = fromApi.user(r.user); write(K.user, user);
        return { user };
      } catch (e) { return { err: e.message }; }
    }
    if (db.users.some(x => x.email.toLowerCase() === String(email).toLowerCase())) return { err: 'exists' };
    const inviter = refCode ? db.users.find(x => x.ref === String(refCode).toUpperCase()) : null;
    const u = {
      id: 'u_' + Date.now().toString(36), name, email, pass, phone: phone || '',
      ref: (String(name).replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DRON') + Math.floor(1000 + Math.random() * 9000),
      refBy: inviter ? inviter.id : null,
      bonus: inviter ? db.settings.refBonusNew : 0,
      invited: 0, earned: 0, created: new Date().toISOString().slice(0, 10)
    };
    db.users.push(u);
    if (inviter) inviter.invited = (inviter.invited || 0) + 1;
    save();
    user = { ...u }; write(K.user, user);
    return { user };
  }

  async function logout() {
    if (online && refreshToken) { try { await api('/auth/logout', { method: 'POST', body: { refresh: refreshToken } }); } catch (e) {} }
    setTokens(null, null);
    user = null; del(K.user);
  }

  async function refreshUser() {
    if (online) {
      try { user = fromApi.user(await api('/auth/me')); write(K.user, user); } catch (e) {}
      return;
    }
    if (user) { const u = db.users.find(x => x.id === user.id); user = u ? { ...u } : null; write(K.user, user); }
  }

  async function updateProfile(dto) {
    if (online) {
      user = fromApi.user(await api('/auth/me', { method: 'PATCH', body: { name: dto.name, phone: dto.phone, email: dto.email } }));
      write(K.user, user);
      return user;
    }
    const u = db.users.find(x => x.id === user.id);
    Object.assign(u, dto); save(); user = { ...u }; write(K.user, user);
    return user;
  }

  /* ---------- Buyurtma ---------- */
  async function placeOrder(data) {
    if (online) {
      const payload = {
        name: data.name, phone: data.phone, email: data.email || '',
        region: data.region, city: data.city, addr: data.addr, note: data.note,
        pay: data.pay, dlv: data.dlv,
        promo: data.promo || undefined,
        useBonus: !!data.bonusUsed,
        items: cart.map(r => ({ productId: r.id, qty: r.qty }))
      };
      const order = fromApi.order(await api('/orders', { method: 'POST', body: payload }));
      await Promise.all([refreshUser(), reloadProducts()]);
      clearCart();
      return order;
    }

    /* demo rejim */
    const id = 'DM-' + Math.floor(24110 + Math.random() * 800);
    const order = { id, userId: user ? user.id : null, created: new Date().toISOString(), status: 'new',
      ...data, items: cartRows().map(r => ({ id: r.id, qty: r.qty, price: r.p.price })) };
    db.orders.unshift(order);
    order.items.forEach(it => {
      const p = db.products.find(x => x.id === it.id);
      if (p && p.stock === 'in') { p.qty = Math.max(0, (p.qty || 0) - it.qty); if (!p.qty) p.stock = 'out'; }
      if (p) p.sold = (p.sold || 0) + it.qty;
    });
    if (user && user.refBy) {
      const inv = db.users.find(x => x.id === user.refBy);
      if (inv) { const b = Math.round(order.total * (db.settings.refPercent / 100)); inv.bonus += b; inv.earned += b; }
    }
    if (user && data.bonusUsed) {
      const me = db.users.find(x => x.id === user.id);
      if (me) me.bonus = Math.max(0, (me.bonus || 0) - data.bonusUsed);
    }
    save(); await refreshUser(); clearCart();
    return order;
  }

  async function orderById(id) {
    if (online) {
      try { return fromApi.order(await api('/orders/' + encodeURIComponent(id), { noAuth: true })); }
      catch (e) { return null; }
    }
    return db.orders.find(o => o.id === id) || null;
  }

  async function myOrders() {
    if (!user) return [];
    if (online) return (await api('/orders/my')).map(fromApi.order);
    return db.orders.filter(o => o.userId === user.id);
  }

  async function checkPromo(code) {
    if (online) {
      try { return fromApi.promo(await api('/orders/promo/' + encodeURIComponent(code))); }
      catch (e) { return null; }
    }
    return db.promos.find(x => x.code === String(code).toUpperCase() && x.active) || null;
  }

  async function sendLead(dto) {
    if (online) { await api('/leads', { method: 'POST', body: dto, noAuth: true }); return; }
    db.leads.push({ ...dto, at: new Date().toISOString() }); save();
  }

  async function addReview(productId, dto) {
    if (online) {
      await api('/products/' + productId + '/reviews', { method: 'POST', body: dto });
      return { pending: true };   // moderatsiyadan keyin ko'rinadi
    }
    (db.reviews[productId] = db.reviews[productId] || []).unshift({
      name: user.name, rate: dto.rate, date: new Date().toISOString().slice(0, 10), text: dto.text
    });
    save();
    return { pending: false };
  }

  /* ---------- Mahsulotlar keshini yangilash ---------- */
  async function reloadProducts() {
    if (!online) return;
    const r = await api('/products?limit=200', { noAuth: true });
    db.products = r.items.map(fromApi.product);
  }

  /** Mahsulot sahifasi uchun to'liq ma'lumot (sharhlar bilan) */
  async function ensureProduct(slug) {
    const cached = db.products.find(p => p.slug === slug);
    if (!online) return cached;
    try {
      const full = fromApi.product(await api('/products/' + encodeURIComponent(slug), { noAuth: true }));
      const i = db.products.findIndex(p => p.slug === slug);
      if (i >= 0) db.products[i] = full; else db.products.push(full);
      return full;
    } catch (e) { return cached; }
  }

  /* ---------- Qidiruv ---------- */
  const norm = s => String(s || '').toLowerCase().replace(/[''`]/g, "'");
  function search(q) {
    q = norm(q).trim();
    if (!q) return [];
    return db.products.filter(p =>
      norm(p.name_uz).includes(q) || norm(p.name_ru).includes(q) ||
      norm(p.brand).includes(q) || norm(p.slug).includes(q)
    ).slice(0, 6);
  }

  /* ---------- Boshlang'ich yuklash ---------- */
  async function init() {
    try {
      const [settings, cats, prods, posts, faq] = await Promise.all([
        api('/settings', { noAuth: true }),
        api('/categories', { noAuth: true }),
        api('/products?limit=200', { noAuth: true }),
        api('/posts', { noAuth: true }),
        api('/faq', { noAuth: true })
      ]);
      online = true;
      db = {
        settings: { ...clone(SEED.settings), ...settings },
        categories: cats.map(fromApi.category),
        products: prods.items.map(fromApi.product),
        posts: posts.map(fromApi.post),
        faq: faq.map(fromApi.faq),
        reviews: {}, users: [], admins: [], orders: [], promos: [], leads: []
      };
      Store.db = db;
      if (access) await refreshUser();
    } catch (e) {
      online = false;
      console.warn('API ulanmadi — demo rejimda ishlaymiz:', e.message);
      if (user && !user.pass && !db.users.some(u => u.id === (user || {}).id)) {
        /* onlayn sessiya qolgan bo'lsa, demo rejimda uni bekor qilamiz */
        user = null; del(K.user);
      }
    }
    return online;
  }

  /* ---------- Admin amallari (faqat onlayn rejimda) ---------- */
  const admin = {
    dashboard: () => api('/admin/dashboard/summary'),
    products: async () => (await api('/admin/catalog/products?limit=200')).items.map(fromApi.product),
    saveProduct: async p => fromApi.product(p.id
      ? await api('/admin/catalog/products/' + p.id, { method: 'PUT', body: toApi.product(p) })
      : await api('/admin/catalog/products', { method: 'POST', body: toApi.product(p) })),
    deleteProduct: id => api('/admin/catalog/products/' + id, { method: 'DELETE' }),
    saveCategory: c => api('/admin/catalog/categories', { method: 'POST', body: toApi.category(c) }),
    deleteCategory: id => api('/admin/catalog/categories/' + id, { method: 'DELETE' }),
    saveSub: (catId, s) => api('/admin/catalog/subcategories', { method: 'POST', body: toApi.sub(catId, s) }),
    deleteSub: id => api('/admin/catalog/subcategories/' + id, { method: 'DELETE' }),
    orders: async status => (await api('/admin/orders' + (status ? '?status=' + status : ''))).map(fromApi.order),
    setOrderStatus: (id, status) => api('/admin/orders/' + id + '/status', { method: 'PUT', body: { status } }),
    deleteOrder: id => api('/admin/orders/' + id, { method: 'DELETE' }),
    users: async () => (await api('/users')).map(fromApi.user),
    promos: async () => (await api('/admin/promos')).map(fromApi.promo),
    savePromo: p => api('/admin/promos', { method: 'POST', body: toApi.promo(p) }),
    deletePromo: code => api('/admin/promos/' + code, { method: 'DELETE' }),
    posts: async () => (await api('/admin/content/posts')).map(fromApi.post),
    savePost: async b => fromApi.post(b.id
      ? await api('/admin/content/posts/' + b.id, { method: 'PUT', body: toApi.post(b) })
      : await api('/admin/content/posts', { method: 'POST', body: toApi.post(b) })),
    deletePost: id => api('/admin/content/posts/' + id, { method: 'DELETE' }),
    leads: async () => (await api('/admin/content/leads')).map(fromApi.lead),
    reviews: async approved => (await api('/admin/catalog/reviews' + (approved === undefined ? '' : '?approved=' + approved))).map(fromApi.review),
    moderateReview: (id, approved) => api('/admin/catalog/reviews/' + id, { method: 'PUT', body: { approved } }),
    deleteReview: id => api('/admin/catalog/reviews/' + id, { method: 'DELETE' }),
    saveSettings: s => api('/admin/content/settings', { method: 'PUT', body: s })
  };

  /* ---------- Tashqi API ---------- */
  window.Store = {
    K, db, save, freshDb, api, init, admin,
    get online() { return online; },
    get lang() { return lang; }, setLang, t, L,
    effTheme, setTheme, toggleTheme: () => setTheme(effTheme() === 'dark' ? 'light' : 'dark'),
    get user() { return user; }, login, register, logout, refreshUser, updateProfile,
    get cart() { return cart; }, addToCart, setQty, removeFromCart, clearCart,
    cartCount, cartRows, cartGoods,
    favs: () => favs, isFav, toggleFav,
    placeOrder, myOrders, orderById, checkPromo, sendLead, addReview, ensureProduct, reloadProducts, search,
    product: id => db.products.find(p => p.id === id),
    bySlug: s => db.products.find(p => p.slug === s),
    category: id => db.categories.find(c => c.id === id),
    post: s => db.posts.find(p => p.slug === s),
    brands: () => [...new Set(db.products.map(p => p.brand))].sort(),
    money: n => (Number(n) || 0).toLocaleString('ru-RU').replace(/,/g, ' '),
    reset: () => { del(K.db); location.reload(); }
  };
})();

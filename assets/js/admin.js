/* ===== MyDrone — administrator paneli (demo, localStorage) ===== */
(function () {
  const S = window.Store, money = n => S.money(n);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const IMG = f => '/assets/img/' + f;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const root = $('#root');
  const AUTH = 'dm_admin_v1';

  /* Sahifa uchun kerakli ma'lumot shu yerga yuklanadi:
     onlayn rejimda API'dan, demo rejimda S.db dan */
  const state = { products: [], orders: [], categories: [], users: [], promos: [], posts: [], leads: [], dash: null };

  async function loadFor(page) {
    if (!S.online) {
      state.products = S.db.products; state.orders = S.db.orders;
      state.categories = S.db.categories; state.users = S.db.users;
      state.promos = S.db.promos; state.posts = S.db.posts; state.leads = S.db.leads;
      state.dash = null;
      return;
    }
    if (page === 'dash') {
      const [dash, products] = await Promise.all([S.admin.dashboard(), S.admin.products()]);
      state.dash = dash; state.products = products;
      state.orders = dash.recent || [];
    }
    if (page === 'orders') state.orders = await S.admin.orders();
    if (page === 'products' || page === 'cats') {
      state.products = await S.admin.products();
      state.categories = (await S.api('/categories', { noAuth: true })).map(c => ({
        id: c.id, name_uz: c.nameUz, name_ru: c.nameRu, img: c.img, icon: c.icon,
        subs: (c.subs || []).map(x => ({ id: x.id, name_uz: x.nameUz, name_ru: x.nameRu }))
      }));
    }
    if (page === 'customers') state.users = await S.admin.users();
    if (page === 'promos') state.promos = await S.admin.promos();
    if (page === 'posts') state.posts = await S.admin.posts();
    if (page === 'leads') state.leads = await S.admin.leads();
  }

  const ST = { new: ['Kutilmoqda', 'st-new'], confirmed: ['Tasdiqlandi', 'st-cn'], shipped: ["Xitoydan jo'natildi", 'st-sh'],
    way: ["Yo'lda", 'st-wy'], done: ['Yetkazildi', 'st-dn'], cancel: ['Bekor qilingan', 'st-cx'] };

  /* ---------- Toast / modal ---------- */
  function toast(msg, kind) {
    let box = $('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.appendChild(box); }
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || ''); el.innerHTML = msg;
    box.appendChild(el); setTimeout(() => el.remove(), 2800);
  }
  function modal(title, body, wide, onOpen) {
    closeModal();
    const m = document.createElement('div');
    m.className = 'mask';
    m.innerHTML = '<div class="modal' + (wide ? ' wide' : '') + '"><div class="modal-hd"><h3>' + title + '</h3>' +
      '<button class="x" data-x>&times;</button></div><div class="modal-b">' + body + '</div></div>';
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-x]')) closeModal(); });
    document.body.appendChild(m); document.body.style.overflow = 'hidden';
    if (onOpen) onOpen(m);
  }
  function closeModal() { $$('.mask').forEach(m => m.remove()); document.body.style.overflow = ''; }
  const fld = (n, l, v, type) => '<div class="field"><label>' + l + '</label><input name="' + n + '" type="' + (type || 'text') + '" value="' + esc(v == null ? '' : v) + '"></div>';
  const area = (n, l, v) => '<div class="field"><label>' + l + '</label><textarea name="' + n + '">' + esc(v || '') + '</textarea></div>';
  const sel = (n, l, v, opts) => '<div class="field"><label>' + l + '</label><select name="' + n + '">' +
    opts.map(o => '<option value="' + esc(o[0]) + '"' + (String(v) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select></div>';

  /* ---------- Kirish ---------- */
  function isAuthed() { return sessionStorage.getItem(AUTH) === '1'; }
  function loginScreen() {
    root.innerHTML = '<div class="login-wrap"><div class="card" style="width:100%;max-width:380px">' +
      '<div class="logo" style="margin-bottom:6px"><span class="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><circle cx="5" cy="5" r="2.6"/><circle cx="19" cy="5" r="2.6"/><circle cx="5" cy="19" r="2.6"/><circle cx="19" cy="19" r="2.6"/><rect x="8.5" y="8.5" width="7" height="7" rx="1.6"/></svg></span>My<b>Drone</b></div>' +
      '<p class="mut sm">Administrator paneli</p>' +
      '<form id="fl" style="margin-top:16px">' + fld('email', 'Email', 'admin@mydrone.uz', 'email') + fld('pass', 'Parol', 'admin12345', 'password') +
      '<button class="btn btn-p btn-block" type="submit">Kirish</button>' +
      '<div class="hint">Demo: <b>admin@mydrone.uz</b> / <b>admin12345</b></div></form>' +
      '<a class="btn btn-ghost btn-block btn-sm" style="margin-top:10px" href="/">← Saytga qaytish</a>' +
      '</div></div>';
    $('#fl').addEventListener('submit', async e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target));
      const btn = $('button[type=submit]', e.target); btn.disabled = true;

      if (S.online) {
        const u = await S.login(d.email.trim(), d.pass);
        btn.disabled = false;
        if (!u) { toast('Email yoki parol noto\'g\'ri', 'err'); return; }
        if (u.role !== 'admin') { await S.logout(); toast('Bu hisob administrator emas', 'err'); return; }
      } else {
        btn.disabled = false;
        const ok = S.db.admins.some(a => a.email.toLowerCase() === d.email.toLowerCase().trim() && a.pass === d.pass);
        if (!ok) { toast('Email yoki parol noto\'g\'ri', 'err'); return; }
      }
      sessionStorage.setItem(AUTH, '1'); render();
    });
  }

  /* ---------- Shell ---------- */
  const PAGES = [
    ['dash', 'Boshqaruv paneli'], ['orders', 'Buyurtmalar'], ['products', 'Mahsulotlar'],
    ['cats', 'Kategoriyalar'], ['customers', 'Mijozlar'], ['promos', 'Promokodlar'],
    ['posts', 'Blog'], ['leads', 'Murojaatlar'], ['settings', 'Sozlamalar']
  ];
  let page = 'dash';

  async function render() {
    if (!isAuthed()) return loginScreen();
    try {
      await loadFor(page);
    } catch (e) {
      if (e.status === 401 || e.status === 403) { sessionStorage.removeItem(AUTH); return loginScreen(); }
      toast('Ma\'lumot yuklanmadi: ' + e.message, 'err');
    }
    const counts = S.online
      ? { orders: state.dash ? state.dash.orders : state.orders.length, products: state.products.length,
          cats: state.categories.length, customers: state.users.length, promos: state.promos.length,
          posts: state.posts.length, leads: state.leads.length }
      : { orders: S.db.orders.length, products: S.db.products.length, cats: S.db.categories.length,
          customers: S.db.users.length, promos: S.db.promos.length, posts: S.db.posts.length, leads: S.db.leads.length };
    root.innerHTML = '<div class="adm"><aside class="side">' +
      '<div class="logo"><span class="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><circle cx="5" cy="5" r="2.6"/><circle cx="19" cy="5" r="2.6"/><circle cx="5" cy="19" r="2.6"/><circle cx="19" cy="19" r="2.6"/><rect x="8.5" y="8.5" width="7" height="7" rx="1.6"/></svg></span>My<b>Drone</b></div>' +
      PAGES.map(p => '<a data-p="' + p[0] + '" class="' + (page === p[0] ? 'on' : '') + '">' + p[1] +
        (counts[p[0]] ? '<span class="n">' + counts[p[0]] + '</span>' : '') + '</a>').join('') +
      '<div class="sep"></div>' +
      '<a href="/" target="_blank">Saytni ochish ↗</a>' +
      '<a data-act="reset">Demo bazani tiklash</a>' +
      '<a data-act="theme">' + (S.effTheme() === 'dark' ? "☀ Yorug' rejim" : "☾ Qorong'i rejim") + '</a>' +
      '<a data-act="exit">Chiqish</a>' +
      '<div class="sep"></div>' +
      '<div style="padding:8px 12px;font-size:12px" class="mut">' +
        (S.online
          ? '<span style="color:var(--ok)">\u25CF</span> Bazaga ulangan'
          : '<span style="color:var(--warn)">\u25CF</span> Demo rejim — o\'zgarishlar faqat shu brauzerda') +
      '</div>' +
      '</aside><div class="main" id="pane"></div></div>';
    $$('[data-p]').forEach(a => a.addEventListener('click', () => { page = a.dataset.p; render(); }));
    $('[data-act="exit"]').addEventListener('click', async () => {
      sessionStorage.removeItem(AUTH);
      if (S.online) await S.logout();
      render();
    });
    $('[data-act="theme"]').addEventListener('click', () => { S.toggleTheme(); render(); });
    $('[data-act="reset"]').addEventListener('click', () => {
      if (S.online) { toast('Bazaga ulanganda bu tugma ishlamaydi — ma\'lumot serverda', 'err'); return; }
      if (confirm('Barcha o\'zgarishlar o\'chib, demo baza qayta tiklanadi. Davom etamizmi?')) S.reset();
    });
    ({ dash: pgDash, orders: pgOrders, products: pgProducts, cats: pgCats, customers: pgCustomers,
       promos: pgPromos, posts: pgPosts, leads: pgLeads, settings: pgSettings }[page])();
  }
  const pane = html => { $('#pane').innerHTML = html; };
  const hd = (title, right) => '<div class="adm-hd"><h1>' + title + '</h1><span class="sp"></span>' + (right || '') + '</div>';

  /* ---------- 1. Boshqaruv paneli ---------- */
  function pgDash() {
    const D = state.dash;
    const O = D ? (D.recent || []) : S.db.orders;
    const done = D ? null : O.filter(o => o.status !== 'cancel');
    const revenue = D ? D.revenue : done.reduce((s, o) => s + o.total, 0);
    const avg = D ? D.avgCheck : (done.length ? Math.round(revenue / done.length) : 0);
    const ordersTotal = D ? D.orders : O.length;
    const newOrders = D ? D.newOrders : O.filter(o => o.status === 'new').length;
    const customers = D ? D.customers : S.db.users.length;
    const leadCount = D ? D.leads : S.db.leads.length;

    const low = D ? D.lowStock.map(x => ({ name_uz: x.name, qty: x.qty }))
      : S.db.products.filter(p => p.stock === 'in' && p.qty <= 5).sort((a, b) => a.qty - b.qty).slice(0, 6);
    const top = D ? D.top.map(x => ({ name_uz: x.name, sold: x.sold }))
      : S.db.products.slice().sort((a, b) => b.sold - a.sold).slice(0, 6);
    const maxSold = top[0] ? top[0].sold || 1 : 1;

    /* oxirgi 7 kun bo'yicha buyurtmalar */
    const days = D
      ? D.days.map(d => [d.day.slice(5), d.count])
      : (() => {
          const out = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            out.push([key.slice(5), O.filter(o => (o.created || '').slice(0, 10) === key).length]);
          }
          return out;
        })();
    const maxDay = Math.max(1, ...days.map(d => d[1]));

    pane(hd('Boshqaruv paneli', '<span class="mut sm">' + new Date().toLocaleDateString('ru-RU') + '</span>') +
      '<div class="kpis">' +
      [['Buyurtmalar', ordersTotal, newOrders + ' ta yangi'],
       ['Tushum', money(revenue), 'so\'m'],
       ['O\'rtacha chek', money(avg), 'so\'m'],
       ['Mijozlar', customers, leadCount + ' ta murojaat']]
        .map(k => '<div class="kpi"><b>' + k[1] + '</b><span>' + k[0] + ' · ' + k[2] + '</span></div>').join('') +
      '</div>' +
      '<div class="grid g-2" style="align-items:start">' +
      '<div class="card"><h3 style="font-size:16px;margin-bottom:6px">Oxirgi 7 kun</h3>' +
      '<div class="chart" style="margin-bottom:26px">' + days.map(d =>
        '<div style="height:' + Math.max(4, d[1] / maxDay * 100) + '%"><b>' + (d[1] || '') + '</b><span>' + d[0] + '</span></div>').join('') + '</div></div>' +
      '<div class="card"><h3 style="font-size:16px;margin-bottom:12px">Eng ko\'p sotilganlar</h3>' +
      top.map(p => '<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;gap:10px;font-size:13.5px;margin-bottom:5px">' +
        '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(p.name_uz) + '</span><b>' + p.sold + '</b></div>' +
        '<div class="bar"><i style="width:' + (p.sold / maxSold * 100) + '%"></i></div></div>').join('') + '</div>' +
      '</div>' +
      '<div class="grid g-2" style="align-items:start;margin-top:18px">' +
      '<div class="tbl-wrap"><div class="tbl-top"><b>Oxirgi buyurtmalar</b></div><div class="tbl-scroll"><table class="dt" style="min-width:0">' +
      '<tr><th>№</th><th>Mijoz</th><th>Summa</th><th>Holat</th></tr>' +
      O.slice(0, 6).map(o => '<tr><td><b>' + o.id + '</b></td><td>' + esc(o.name) + '</td><td>' + money(o.total) + '</td>' +
        '<td><span class="st ' + ST[o.status][1] + '">' + ST[o.status][0] + '</span></td></tr>').join('') +
      '</table></div></div>' +
      '<div class="tbl-wrap"><div class="tbl-top"><b>Zaxira tugayapti</b></div><div class="tbl-scroll"><table class="dt" style="min-width:0">' +
      '<tr><th>Mahsulot</th><th>Qoldi</th></tr>' +
      (low.length ? low.map(p => '<tr><td>' + esc(p.name_uz) + '</td><td><b style="color:' + (p.qty <= 3 ? 'var(--bad)' : 'var(--warn)') + '">' + p.qty + '</b></td></tr>').join('')
        : '<tr><td colspan="2" class="mut">Zaxira yetarli</td></tr>') +
      '</table></div></div></div>');
  }

  /* ---------- 2. Buyurtmalar ---------- */
  let ordFilter = '';
  function pgOrders() {
    const list = state.orders.filter(o => !ordFilter || o.status === ordFilter);
    pane(hd('Buyurtmalar') +
      '<div class="tbl-wrap"><div class="tbl-top">' +
      '<select id="ofil"><option value="">Barcha holatlar</option>' +
      Object.keys(ST).map(k => '<option value="' + k + '"' + (ordFilter === k ? ' selected' : '') + '>' + ST[k][0] + '</option>').join('') + '</select>' +
      '<span class="mut sm">' + list.length + ' ta buyurtma</span></div>' +
      '<div class="tbl-scroll"><table class="dt">' +
      '<tr><th>№</th><th>Sana</th><th>Mijoz</th><th>Telefon</th><th>Mahsulot</th><th>Summa</th><th>To\'lov</th><th>Holat</th><th></th></tr>' +
      (list.length ? list.map(o => '<tr><td><b>' + o.id + '</b></td>' +
        '<td class="mut sm">' + o.created.slice(0, 10) + '</td>' +
        '<td>' + esc(o.name) + '</td><td class="mut sm">' + esc(o.phone) + '</td>' +
        '<td>' + o.items.length + ' ta</td><td><b>' + money(o.total) + '</b></td>' +
        '<td class="mut sm">' + esc(o.pay) + '</td>' +
        '<td><span class="st ' + ST[o.status][1] + '">' + ST[o.status][0] + '</span></td>' +
        '<td><div class="acts"><button class="ib" data-view="' + o.id + '">👁</button>' +
        '<button class="ib del" data-delo="' + o.id + '">✕</button></div></td></tr>').join('')
        : '<tr><td colspan="9" class="mut" style="padding:26px;text-align:center">Buyurtma yo\'q</td></tr>') +
      '</table></div></div>');
    $('#ofil').addEventListener('change', e => { ordFilter = e.target.value; pgOrders(); });
    $$('[data-view]').forEach(b => b.addEventListener('click', () => viewOrder(b.dataset.view)));
    $$('[data-delo]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('Buyurtma o\'chirilsinmi?')) return;
      try {
        if (S.online) await S.admin.deleteOrder(b.dataset.delo);
        else { S.db.orders = S.db.orders.filter(o => o.id !== b.dataset.delo); S.save(); }
        toast('O\'chirildi', 'ok'); render();
      } catch (e) { toast(e.message, 'err'); }
    }));
  }

  function viewOrder(id) {
    const o = state.orders.find(x => x.id === id);
    if (!o) return;
    modal('Buyurtma ' + o.id,
      '<div class="grid g-2" style="gap:12px">' +
      '<div><span class="mut xs">Mijoz</span><div><b>' + esc(o.name) + '</b></div></div>' +
      '<div><span class="mut xs">Telefon</span><div><b>' + esc(o.phone) + '</b></div></div>' +
      '<div><span class="mut xs">Manzil</span><div>' + esc([o.region, o.city, o.addr].filter(Boolean).join(', ')) + '</div></div>' +
      '<div><span class="mut xs">To\'lov / yetkazish</span><div>' + esc(o.pay) + ' · ' + esc(o.dlv) + '</div></div>' +
      '</div>' + (o.note ? '<div class="hint" style="margin-top:10px">Izoh: ' + esc(o.note) + '</div>' : '') +
      '<div style="margin:16px 0 8px"><b>Mahsulotlar</b></div>' +
      o.items.map(it => { const p = S.product(it.id);
        const img = (p && p.imgs[0]) || it.img, nm = (p && p.name_uz) || it.name || it.id;
        return '<div style="display:flex;gap:11px;align-items:center;padding:7px 0;border-bottom:1px solid var(--line-soft)">' +
          (img ? '<img src="' + IMG(img) + '" style="width:44px;height:34px;object-fit:cover;border-radius:7px">' : '') +
          '<div style="flex:1" class="sm">' + esc(nm) + '</div>' +
          '<div class="sm mut">' + it.qty + ' × ' + money(it.price) + '</div></div>'; }).join('') +
      '<div class="sum-row" style="margin-top:10px"><span class="mut">Mahsulotlar</span><span>' + money(o.goods) + '</span></div>' +
      (o.discount ? '<div class="sum-row"><span class="mut">Chegirma</span><span>−' + money(o.discount) + '</span></div>' : '') +
      (o.bonusUsed ? '<div class="sum-row"><span class="mut">Bonus</span><span>−' + money(o.bonusUsed) + '</span></div>' : '') +
      '<div class="sum-row"><span class="mut">Yetkazib berish</span><span>' + money(o.delivery) + '</span></div>' +
      '<div class="sum-row total"><span>Jami</span><span>' + money(o.total) + ' so\'m</span></div>' +
      '<div class="field" style="margin-top:16px"><label>Holatni o\'zgartirish</label><select id="ost">' +
      Object.keys(ST).map(k => '<option value="' + k + '"' + (o.status === k ? ' selected' : '') + '>' + ST[k][0] + '</option>').join('') +
      '</select></div><button class="btn btn-p btn-block" id="osave">Saqlash</button>', true,
      m => $('#osave', m).addEventListener('click', async () => {
        const status = $('#ost', m).value;
        try {
          if (S.online) await S.admin.setOrderStatus(o.id, status);
          else { o.status = status; S.save(); }
          closeModal();
          toast('Holat yangilandi' + (status === 'done' ? ' · referal bonus hisoblandi' : ''), 'ok');
          render();
        } catch (e) { toast(e.message, 'err'); }
      }));
  }

  /* ---------- 3. Mahsulotlar ---------- */
  let pq = '', pcat = '';
  function pgProducts() {
    let list = state.products;
    if (pcat) list = list.filter(p => p.cat === pcat);
    if (pq) list = list.filter(p => (p.name_uz + p.name_ru + p.brand).toLowerCase().includes(pq.toLowerCase()));
    pane(hd('Mahsulotlar', '<button class="btn btn-p btn-sm" id="padd">+ Yangi mahsulot</button>') +
      '<div class="tbl-wrap"><div class="tbl-top">' +
      '<input id="psearch" placeholder="Qidirish..." value="' + esc(pq) + '" style="min-width:200px">' +
      '<select id="pcat"><option value="">Barcha kategoriyalar</option>' +
      state.categories.map(c => '<option value="' + c.id + '"' + (pcat === c.id ? ' selected' : '') + '>' + esc(c.name_uz) + '</option>').join('') + '</select>' +
      '<span class="mut sm">' + list.length + ' ta</span></div>' +
      '<div class="tbl-scroll"><table class="dt">' +
      '<tr><th></th><th>Nomi</th><th>Kategoriya</th><th>Brend</th><th>Narx</th><th>Zaxira</th><th>Sotilgan</th><th></th></tr>' +
      list.map(p => '<tr><td><img class="th" src="' + IMG(p.imgs[0]) + '"></td>' +
        '<td><b>' + esc(p.name_uz) + '</b><div class="mut xs">' + esc(p.slug) + '</div></td>' +
        '<td class="sm">' + esc((state.categories.find(c => c.id === p.cat) || {}).name_uz || '') + '</td>' +
        '<td class="sm">' + esc(p.brand) + '</td>' +
        '<td><b>' + money(p.price) + '</b>' + (p.old > p.price ? '<div class="mut xs" style="text-decoration:line-through">' + money(p.old) + '</div>' : '') + '</td>' +
        '<td>' + (p.stock === 'in' ? '<span class="st st-dn">' + p.qty + ' dona</span>' :
          p.stock === 'pre' ? '<span class="st st-new">Buyurtma · ' + p.lead + ' kun</span>' : '<span class="st st-cx">Tugagan</span>') + '</td>' +
        '<td class="mut">' + p.sold + '</td>' +
        '<td><div class="acts"><button class="ib" data-ep="' + p.id + '">✎</button>' +
        '<button class="ib del" data-dp="' + p.id + '">✕</button></div></td></tr>').join('') +
      '</table></div></div>');
    $('#psearch').addEventListener('input', e => { pq = e.target.value; const c = e.target.selectionStart; pgProducts(); const i = $('#psearch'); i.focus(); i.setSelectionRange(c, c); });
    $('#pcat').addEventListener('change', e => { pcat = e.target.value; pgProducts(); });
    $('#padd').addEventListener('click', () => editProduct(null));
    $$('[data-ep]').forEach(b => b.addEventListener('click', () => editProduct(b.dataset.ep)));
    $$('[data-dp]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('Mahsulot o\'chirilsinmi?')) return;
      try {
        if (S.online) await S.admin.deleteProduct(b.dataset.dp);
        else { S.db.products = S.db.products.filter(p => p.id !== b.dataset.dp); S.save(); }
        toast('O\'chirildi', 'ok'); render();
      } catch (e) { toast(e.message, 'err'); }
    }));
  }

  function editProduct(id) {
    const p = id ? state.products.find(x => x.id === id) : { id: '', slug: '', cat: S.db.categories[0].id, sub: S.db.categories[0].subs[0].id,
      brand: '', name_uz: '', name_ru: '', price: 0, old: 0, stock: 'in', qty: 1, lead: 0, rating: 5, reviews: 0,
      sold: 0, isNew: true, isHit: false, imgs: ['drone-air-1.jpg'], short_uz: '', short_ru: '', specs: [] };
    const cats = state.categories.length ? state.categories : S.db.categories;
    const catOpts = cats.map(c => [c.id, c.name_uz]);
    const subOpts = (cats.find(c => c.id === p.cat) || cats[0]).subs.map(s => [s.id, s.name_uz]);
    modal(id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot',
      '<form id="pf">' +
      '<div class="grid g-2">' + fld('name_uz', 'Nomi (uz)', p.name_uz) + fld('name_ru', 'Nomi (ru)', p.name_ru) + '</div>' +
      '<div class="grid g-2">' + fld('slug', 'Slug (URL)', p.slug) + fld('brand', 'Brend', p.brand) + '</div>' +
      '<div class="grid g-2">' + sel('cat', 'Kategoriya', p.cat, catOpts) + sel('sub', 'Subkategoriya', p.sub, subOpts) + '</div>' +
      '<div class="grid g-2">' + fld('price', 'Narx (so\'m)', p.price, 'number') + fld('old', 'Eski narx (0 = yo\'q)', p.old, 'number') + '</div>' +
      '<div class="grid g-2">' + sel('stock', 'Holat', p.stock, [['in', 'Omborda mavjud'], ['pre', 'Buyurtma asosida'], ['out', 'Tugagan']]) +
      fld('qty', 'Zaxira (dona)', p.qty, 'number') + '</div>' +
      '<div class="grid g-2">' + fld('lead', 'Yetkazish muddati (kun)', p.lead, 'number') + fld('imgs', 'Rasmlar (vergul bilan)', p.imgs.join(',')) + '</div>' +
      area('short_uz', 'Qisqa tavsif (uz)', p.short_uz) + area('short_ru', 'Qisqa tavsif (ru)', p.short_ru) +
      '<div class="field"><label>Bayroqlar</label>' +
      '<label class="chk"><input type="checkbox" name="isNew" ' + (p.isNew ? 'checked' : '') + '><span>Yangi (NEW)</span></label>' +
      '<label class="chk"><input type="checkbox" name="isHit" ' + (p.isHit ? 'checked' : '') + '><span>Hit sotuv (HIT)</span></label></div>' +
      '<div class="field"><label>Texnik xususiyatlar (uz nomi / ru nomi / qiymat)</label><div id="specs">' +
      (p.specs.length ? p.specs : [['', '', '']]).map(specRow).join('') + '</div>' +
      '<button type="button" class="btn btn-ghost btn-sm" id="addspec">+ Qator qo\'shish</button></div>' +
      '<button class="btn btn-p btn-block" type="submit">Saqlash</button></form>', true,
      m => {
        $('[name="cat"]', m).addEventListener('change', e => {
          const c = cats.find(x => x.id === e.target.value) || cats[0];
          $('[name="sub"]', m).innerHTML = c.subs.map(s => '<option value="' + s.id + '">' + esc(s.name_uz) + '</option>').join('');
        });
        $('#addspec', m).addEventListener('click', () => $('#specs', m).insertAdjacentHTML('beforeend', specRow(['', '', ''])));
        $('#specs', m).addEventListener('click', e => { if (e.target.closest('[data-rmspec]')) e.target.closest('.spec-row').remove(); });
        $('#pf', m).addEventListener('submit', async e => {
          e.preventDefault();
          const d = Object.fromEntries(new FormData(e.target));
          const specs = $$('.spec-row', m).map(r => $$('input', r).map(i => i.value)).filter(x => x[0] && x[2]);
          const obj = {
            ...p, name_uz: d.name_uz, name_ru: d.name_ru || d.name_uz,
            slug: (d.slug || d.name_uz).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            brand: d.brand, cat: d.cat, sub: d.sub, price: +d.price, old: +d.old,
            stock: d.stock, qty: +d.qty, lead: +d.lead,
            imgs: d.imgs.split(',').map(s => s.trim()).filter(Boolean),
            short_uz: d.short_uz, short_ru: d.short_ru || d.short_uz,
            isNew: !!d.isNew, isHit: !!d.isHit, specs
          };
          if (!obj.name_uz || !obj.price) { toast('Nomi va narxi to\'ldirilishi shart', 'err'); return; }
          if (!obj.imgs.length) obj.imgs = ['drone-air-1.jpg'];
          try {
            if (S.online) { await S.admin.saveProduct({ ...obj, id }); await S.reloadProducts(); }
            else if (id) { Object.assign(state.products.find(x => x.id === id), obj); S.save(); }
            else { obj.id = 'p_' + Date.now().toString(36); S.db.products.unshift(obj); S.save(); }
            closeModal(); toast('Saqlandi', 'ok'); render();
          } catch (err) { toast(err.message, 'err'); }
        });
      });
  }
  const specRow = s => '<div class="spec-row"><input value="' + esc(s[0]) + '" placeholder="Parvoz vaqti">' +
    '<input value="' + esc(s[1]) + '" placeholder="Время полёта"><input value="' + esc(s[2]) + '" placeholder="34 daqiqa">' +
    '<button type="button" class="ib del" data-rmspec>✕</button></div>';

  /* ---------- 4. Kategoriyalar ---------- */
  function pgCats() {
    pane(hd('Kategoriyalar', '<button class="btn btn-p btn-sm" id="cadd">+ Yangi kategoriya</button>') +
      '<p class="mut sm" style="margin:-12px 0 18px">Yangi kategoriya qo\'shsangiz, u avtomatik ravishda saytdagi menyuda va katalogda paydo bo\'ladi — dasturchi aralashuvi shart emas.</p>' +
      state.categories.map(c => '<div class="tbl-wrap" style="margin-bottom:14px"><div class="tbl-top">' +
        '<img class="th" src="' + IMG(c.img) + '" style="width:46px;height:36px;object-fit:cover;border-radius:8px">' +
        '<b>' + esc(c.name_uz) + '</b><span class="mut sm">' + esc(c.name_ru) + '</span>' +
        '<span class="mut sm">· ' + state.products.filter(p => p.cat === c.id).length + ' ta mahsulot</span>' +
        '<span style="flex:1"></span>' +
        '<button class="btn btn-ghost btn-sm" data-ec="' + c.id + '">Tahrirlash</button>' +
        '<button class="btn btn-ghost btn-sm" data-as="' + c.id + '">+ Subkategoriya</button>' +
        '<button class="ib del" data-dc="' + c.id + '">✕</button></div>' +
        '<div class="tbl-scroll"><table class="dt" style="min-width:0"><tr><th>Subkategoriya</th><th>Ru</th><th>Mahsulot</th><th></th></tr>' +
        c.subs.map(s => '<tr><td>' + esc(s.name_uz) + '</td><td class="mut sm">' + esc(s.name_ru) + '</td>' +
          '<td>' + state.products.filter(p => p.sub === s.id).length + '</td>' +
          '<td><div class="acts"><button class="ib del" data-ds="' + c.id + '|' + s.id + '">✕</button></div></td></tr>').join('') +
        '</table></div></div>').join(''));

    $('#cadd').addEventListener('click', () => editCat(null));
    $$('[data-ec]').forEach(b => b.addEventListener('click', () => editCat(b.dataset.ec)));
    $$('[data-as]').forEach(b => b.addEventListener('click', () => {
      const c = state.categories.find(x => x.id === b.dataset.as);
      modal('Yangi subkategoriya', '<form id="sf">' + fld('name_uz', 'Nomi (uz)', '') + fld('name_ru', 'Nomi (ru)', '') +
        '<button class="btn btn-p btn-block" type="submit">Qo\'shish</button></form>', false,
        m => $('#sf', m).addEventListener('submit', async e => {
          e.preventDefault();
          const d = Object.fromEntries(new FormData(e.target));
          if (!d.name_uz) return;
          const sub = { id: slugify(d.name_uz) + '-' + Math.floor(Math.random() * 900 + 100),
            name_uz: d.name_uz, name_ru: d.name_ru || d.name_uz };
          try {
            if (S.online) await S.admin.saveSub(c.id, sub); else { c.subs.push(sub); S.save(); }
            closeModal(); toast('Qo\'shildi', 'ok'); render();
          } catch (err) { toast(err.message, 'err'); }
        }));
    }));
    $$('[data-dc]').forEach(b => b.addEventListener('click', async () => {
      const n = state.products.filter(p => p.cat === b.dataset.dc).length;
      if (n) { toast('Avval ' + n + ' ta mahsulotni boshqa kategoriyaga o\'tkazing', 'err'); return; }
      if (!confirm('Kategoriya o\'chirilsinmi?')) return;
      try {
        if (S.online) await S.admin.deleteCategory(b.dataset.dc);
        else { S.db.categories = S.db.categories.filter(c => c.id !== b.dataset.dc); S.save(); }
        toast('O\'chirildi', 'ok'); render();
      } catch (e) { toast(e.message, 'err'); }
    }));
    $$('[data-ds]').forEach(b => b.addEventListener('click', async () => {
      const [cid, sid] = b.dataset.ds.split('|');
      try {
        if (S.online) await S.admin.deleteSub(sid);
        else { const c = state.categories.find(x => x.id === cid); c.subs = c.subs.filter(s => s.id !== sid); S.save(); }
        toast('O\'chirildi', 'ok'); render();
      } catch (e) { toast(e.message, 'err'); }
    }));
  }
  const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cat';

  function editCat(id) {
    const c = id ? state.categories.find(x => x.id === id) : { id: '', name_uz: '', name_ru: '', img: 'drone-air-1.jpg', icon: 'box', subs: [] };
    modal(id ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya',
      '<form id="cf">' + fld('name_uz', 'Nomi (uz)', c.name_uz) + fld('name_ru', 'Nomi (ru)', c.name_ru) +
      fld('img', 'Rasm fayli (assets/img/ ichida)', c.img) +
      '<button class="btn btn-p btn-block" type="submit">Saqlash</button></form>', false,
      m => $('#cf', m).addEventListener('submit', async e => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        if (!d.name_uz) return;
        const obj = { id: id || slugify(d.name_uz), name_uz: d.name_uz,
          name_ru: d.name_ru || d.name_uz, img: d.img || 'drone-air-1.jpg', icon: 'box' };
        try {
          if (S.online) {
            await S.admin.saveCategory(obj);
            if (!id) await S.admin.saveSub(obj.id, { id: obj.id + '-all', name_uz: 'Barchasi', name_ru: 'Все' });
          } else if (id) {
            Object.assign(c, obj);
          } else {
            S.db.categories.push({ ...obj, subs: [{ id: obj.id + '-all', name_uz: 'Barchasi', name_ru: 'Все' }] });
          }
          S.save(); closeModal(); toast('Saqlandi', 'ok'); render();
        } catch (err) { toast(err.message, 'err'); }
      }));
  }

  /* ---------- 5. Mijozlar ---------- */
  function pgCustomers() {
    pane(hd('Mijozlar') +
      '<div class="tbl-wrap"><div class="tbl-scroll"><table class="dt">' +
      '<tr><th>Ism</th><th>Email</th><th>Telefon</th><th>Referal kod</th><th>Taklif qilgan</th><th>Bonus</th><th>Ro\'yxatdan</th></tr>' +
      state.users.map(u => '<tr><td><b>' + esc(u.name) + '</b></td><td class="mut sm">' + esc(u.email) + '</td>' +
        '<td class="mut sm">' + esc(u.phone || '—') + '</td><td><code style="color:var(--acc)">' + esc(u.ref) + '</code></td>' +
        '<td>' + (u.invited || 0) + '</td><td>' + money(u.bonus || 0) + '</td>' +
        '<td class="mut sm">' + esc(u.created || '') + '</td></tr>').join('') +
      '</table></div></div>');
  }

  /* ---------- 6. Promokodlar ---------- */
  function pgPromos() {
    pane(hd('Promokodlar', '<button class="btn btn-p btn-sm" id="mkpromo">+ Yangi promokod</button>') +
      '<div class="tbl-wrap"><div class="tbl-scroll"><table class="dt">' +
      '<tr><th>Kod</th><th>Turi</th><th>Qiymat</th><th>Izoh</th><th>Holat</th><th></th></tr>' +
      state.promos.map((p, i) => '<tr><td><b style="color:var(--acc)">' + esc(p.code) + '</b></td>' +
        '<td>' + (p.type === 'percent' ? 'Foiz' : 'Qat\'iy summa') + '</td>' +
        '<td>' + (p.type === 'percent' ? p.value + '%' : money(p.value) + ' so\'m') + '</td>' +
        '<td class="mut sm">' + esc(p.note_uz || '') + '</td>' +
        '<td><span class="st ' + (p.active ? 'st-dn' : 'st-cx') + '">' + (p.active ? 'Faol' : 'O\'chirilgan') + '</span></td>' +
        '<td><div class="acts"><button class="ib" data-tp="' + i + '">⏻</button><button class="ib del" data-dpr="' + i + '">✕</button></div></td></tr>').join('') +
      '</table></div></div>');
    $('#mkpromo').addEventListener('click', () => {
      modal('Yangi promokod', '<form id="prf">' + fld('code', 'Kod (masalan SALOM10)', '') +
        sel('type', 'Turi', 'percent', [['percent', 'Foiz (%)'], ['fixed', 'Qat\'iy summa (so\'m)']]) +
        fld('value', 'Qiymat', 10, 'number') + fld('note_uz', 'Izoh', '') +
        '<button class="btn btn-p btn-block" type="submit">Qo\'shish</button></form>', false,
        m => $('#prf', m).addEventListener('submit', async e => {
          e.preventDefault();
          const d = Object.fromEntries(new FormData(e.target));
          if (!d.code) return;
          const promo = { code: d.code.toUpperCase().trim(), type: d.type, value: +d.value,
            active: true, note_uz: d.note_uz, note_ru: d.note_uz };
          try {
            if (S.online) await S.admin.savePromo(promo); else { S.db.promos.push(promo); S.save(); }
            closeModal(); toast('Qo\'shildi', 'ok'); render();
          } catch (err) { toast(err.message, 'err'); }
        }));
    });
    $$('[data-tp]').forEach(b => b.addEventListener('click', async () => {
      const p = state.promos[+b.dataset.tp]; p.active = !p.active;
      try { if (S.online) await S.admin.savePromo(p); else S.save(); render(); }
      catch (e) { toast(e.message, 'err'); }
    }));
    $$('[data-dpr]').forEach(b => b.addEventListener('click', async () => {
      const p = state.promos[+b.dataset.dpr];
      try {
        if (S.online) await S.admin.deletePromo(p.code); else { S.db.promos.splice(+b.dataset.dpr, 1); S.save(); }
        render();
      } catch (e) { toast(e.message, 'err'); }
    }));
  }

  /* ---------- 7. Blog ---------- */
  function pgPosts() {
    pane(hd('Blog', '<button class="btn btn-p btn-sm" id="badd">+ Yangi maqola</button>') +
      '<div class="tbl-wrap"><div class="tbl-scroll"><table class="dt">' +
      '<tr><th></th><th>Sarlavha</th><th>Bo\'lim</th><th>Sana</th><th></th></tr>' +
      state.posts.map(p => '<tr><td><img class="th" src="' + IMG(p.img) + '"></td>' +
        '<td><b>' + esc(p.title_uz) + '</b><div class="mut xs">' + esc(p.slug) + '</div></td>' +
        '<td class="sm">' + esc(p.cat_uz) + '</td><td class="mut sm">' + p.date + '</td>' +
        '<td><div class="acts"><button class="ib" data-eb="' + p.id + '">✎</button><button class="ib del" data-db="' + p.id + '">✕</button></div></td></tr>').join('') +
      '</table></div></div>');
    $('#badd').addEventListener('click', () => editPost(null));
    $$('[data-eb]').forEach(b => b.addEventListener('click', () => editPost(b.dataset.eb)));
    $$('[data-db]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('Maqola o\'chirilsinmi?')) return;
      try {
        if (S.online) await S.admin.deletePost(b.dataset.db);
        else { S.db.posts = S.db.posts.filter(p => p.id !== b.dataset.db); S.save(); }
        render();
      } catch (e) { toast(e.message, 'err'); }
    }));
  }
  function editPost(id) {
    const p = id ? state.posts.find(x => x.id === id) : { id: '', slug: '', img: 'drone-air-2.jpg', date: new Date().toISOString().slice(0, 10),
      cat_uz: 'Qo\'llanma', cat_ru: 'Гид', title_uz: '', title_ru: '', lead_uz: '', lead_ru: '', body_uz: '', body_ru: '' };
    modal(id ? 'Maqolani tahrirlash' : 'Yangi maqola',
      '<form id="bf">' + '<div class="grid g-2">' + fld('title_uz', 'Sarlavha (uz)', p.title_uz) + fld('title_ru', 'Sarlavha (ru)', p.title_ru) + '</div>' +
      '<div class="grid g-2">' + fld('cat_uz', 'Bo\'lim (uz)', p.cat_uz) + fld('date', 'Sana', p.date, 'date') + '</div>' +
      fld('img', 'Rasm fayli', p.img) +
      area('lead_uz', 'Qisqa matn (uz)', p.lead_uz) + area('lead_ru', 'Qisqa matn (ru)', p.lead_ru) +
      area('body_uz', 'Matn (uz, HTML)', p.body_uz) + area('body_ru', 'Matn (ru, HTML)', p.body_ru) +
      '<button class="btn btn-p btn-block" type="submit">Saqlash</button></form>', true,
      m => $('#bf', m).addEventListener('submit', async e => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        if (!d.title_uz) { toast('Sarlavha kerak', 'err'); return; }
        const obj = { ...p, ...d, title_ru: d.title_ru || d.title_uz, cat_ru: p.cat_ru || d.cat_uz,
          slug: p.slug || slugify(d.title_uz) };
        try {
          if (S.online) await S.admin.savePost({ ...obj, id });
          else if (id) Object.assign(p, obj);
          else { obj.id = 'b_' + Date.now().toString(36); S.db.posts.unshift(obj); }
          S.save(); closeModal(); toast('Saqlandi', 'ok'); render();
        } catch (err) { toast(err.message, 'err'); }
      }));
  }

  /* ---------- 8. Murojaatlar ---------- */
  function pgLeads() {
    const L = S.online ? state.leads : S.db.leads.slice().reverse();
    pane(hd('Murojaatlar', '<span class="mut sm">Qo\'ng\'iroqqa buyurtma va aloqa formasi</span>') +
      '<div class="tbl-wrap"><div class="tbl-scroll"><table class="dt">' +
      '<tr><th>Sana</th><th>Turi</th><th>Ism</th><th>Telefon</th><th>Xabar</th></tr>' +
      (L.length ? L.map(l => '<tr><td class="mut sm">' + (l.at || '').slice(0, 16).replace('T', ' ') + '</td>' +
        '<td><span class="st ' + (l.type === 'callback' ? 'st-wy' : 'st-cn') + '">' + (l.type === 'callback' ? 'Qo\'ng\'iroq' : 'Xabar') + '</span></td>' +
        '<td>' + esc(l.name) + '</td><td>' + esc(l.phone) + '</td><td class="mut sm">' + esc(l.msg || '—') + '</td></tr>').join('')
        : '<tr><td colspan="5" class="mut" style="padding:26px;text-align:center">Hozircha murojaat yo\'q. Saytdagi "Qo\'ng\'iroqqa buyurtma" tugmasi orqali kelgan so\'rovlar shu yerda ko\'rinadi.</td></tr>') +
      '</table></div></div>');
  }

  /* ---------- 9. Sozlamalar ---------- */
  function pgSettings() {
    const s = S.db.settings;
    pane(hd('Sozlamalar') +
      '<form id="sf" class="card" style="max-width:720px">' +
      '<h3 style="font-size:16px;margin-bottom:14px">Aloqa ma\'lumotlari</h3>' +
      '<div class="grid g-2">' + fld('phone', 'Asosiy telefon', s.phone) + fld('phone2', 'Qo\'shimcha telefon', s.phone2) + '</div>' +
      '<div class="grid g-2">' + fld('email', 'Email', s.email) + fld('telegram', 'Telegram (@siz)', s.telegram) + '</div>' +
      '<div class="grid g-2">' + fld('whatsapp', 'WhatsApp raqami', s.whatsapp) + fld('instagram', 'Instagram', s.instagram) + '</div>' +
      fld('address_uz', 'Manzil (uz)', s.address_uz) + fld('address_ru', 'Manzil (ru)', s.address_ru) +
      '<div class="grid g-2">' + fld('workhours_uz', 'Ish vaqti (uz)', s.workhours_uz) + fld('workhours_ru', 'Ish vaqti (ru)', s.workhours_ru) + '</div>' +
      '<h3 style="font-size:16px;margin:22px 0 14px">Yetkazib berish va bonus</h3>' +
      '<div class="grid g-2">' + fld('deliveryTashkent', 'Toshkent (so\'m)', s.deliveryTashkent, 'number') + fld('deliveryRegion', 'Viloyat (so\'m)', s.deliveryRegion, 'number') + '</div>' +
      '<div class="grid g-2">' + fld('freeFrom', 'Bepul yetkazish chegarasi', s.freeFrom, 'number') + fld('refPercent', 'Referal foizi (%)', s.refPercent, 'number') + '</div>' +
      fld('refBonusNew', 'Yangi mijozga bonus (so\'m)', s.refBonusNew, 'number') +
      '<button class="btn btn-p" type="submit">Saqlash</button></form>');
    $('#sf').addEventListener('submit', async e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target));
      ['deliveryTashkent', 'deliveryRegion', 'freeFrom', 'refPercent', 'refBonusNew'].forEach(k => d[k] = +d[k]);
      try {
        if (S.online) await S.admin.saveSettings(d);
        Object.assign(S.db.settings, d); S.save();
        toast('Sozlamalar saqlandi', 'ok');
      } catch (err) { toast(err.message, 'err'); }
    });
  }

  /* ---------- Boot ---------- */
  S.init().then(render);
})();

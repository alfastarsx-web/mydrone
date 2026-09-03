/* ===== MyDrone — frontend ilovasi (vanilla JS, hash-router) ===== */
(function () {
  const S = window.Store, t = k => S.t(k), L = (o, f) => S.L(o, f);
  const money = n => S.money(n);
  const IMG = f => '/assets/img/' + f;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Ikonkalar ---------- */
  const ic = {
    drone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><circle cx="5" cy="5" r="2.6"/><circle cx="19" cy="5" r="2.6"/><circle cx="5" cy="19" r="2.6"/><circle cx="19" cy="19" r="2.6"/><rect x="8.5" y="8.5" width="7" height="7" rx="1.6"/><path d="M7 7l1.6 1.6M17 7l-1.6 1.6M7 17l1.6-1.6M17 17l-1.6-1.6"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.7a2 2 0 002-1.5L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4S18.3 16.4 19.5 20"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="17" height="17"><path d="M12 20s-7-4.4-7-9.3A3.9 3.9 0 0112 8a3.9 3.9 0 017 2.7C19 15.6 12 20 12 20z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" width="18" height="18"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.6-3.6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="19" height="19"><path d="M12 6v12M6 12h12"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6z"/><path d="M9.2 12.2l2 2 3.6-4"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M3 6h10v9H3zM13 9h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><rect x="2.5" y="5.5" width="19" height="13" rx="2.4"/><path d="M2.5 10h19"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M9 5l-6 7 6 7"/><path d="M3 12h13a5 5 0 015 5v2"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><path d="M3 8l9-4 9 4-9 4z"/><path d="M3 8v8l9 4 9-4V8"/></svg>',
    cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><rect x="2.5" y="6.5" width="14" height="11" rx="2.2"/><path d="M16.5 11l5-2.5v7l-5-2.5z"/></svg>',
    chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><rect x="4" y="8" width="16" height="11" rx="3"/><circle cx="9" cy="13.5" r="1.3"/><circle cx="15" cy="13.5" r="1.3"/><path d="M12 4v4M8 19v2M16 19v2"/></svg>',
    scooter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><circle cx="5.5" cy="17.5" r="2.4"/><circle cx="18.5" cy="17.5" r="2.4"/><path d="M16 5h3l-2 12.5M8 17.5h8"/></svg>',
    tg: '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M21.9 4.3L18.9 19c-.2 1-.8 1.2-1.7.8l-4.6-3.4-2.2 2.2c-.3.3-.5.5-1 .5l.4-4.9 9-8.1c.4-.3-.1-.5-.6-.2L7.1 12.7l-4.8-1.5c-1-.3-1-1 .2-1.5L20.6 3c.9-.3 1.6.2 1.3 1.3z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2a9.9 9.9 0 00-8.6 14.9L2 22l5.3-1.4A9.9 9.9 0 1012 2zm5.4 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a12 12 0 01-5.6-4.9c-.4-.6-.9-1.6-.9-2.5 0-.9.5-1.4.7-1.6.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.8 1.9c.1.2 0 .4-.1.5l-.4.5c-.1.1-.2.3-.1.5.3.6 1 1.5 1.6 2 .7.6 1.3.8 1.6.9.2.1.4 0 .5-.1l.7-.8c.2-.2.3-.2.5-.1l1.8.9c.2.1.4.2.4.3.1.2.1.6-.1 1z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" width="20" height="20"><path d="M5 3.5h3.2l1.5 4-2 1.4a12 12 0 005.4 5.4l1.4-2 4 1.5V17c0 1.4-1.2 2.6-2.6 2.4C9.4 18.8 5.2 14.6 4.6 6.1 4.4 4.7 5.6 3.5 7 3.5z"/></svg>',
    inst: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="17" height="17"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    burger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" width="20" height="20"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.5-4.5"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="19" height="19"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="19" height="19"><path d="M20 14.5A8.2 8.2 0 019.5 4a8.3 8.3 0 106.9 12.4c1.4 0 2.6-.7 3.6-1.9z"/></svg>'
  };

  /* ---------- Marshrut (History API — haqiqiy manzillar) ---------- */
  function parseRoute() {
    const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    const q = {};
    new URLSearchParams(location.search).forEach((v, k) => q[k] = v);
    return { parts, q };
  }
  function go(url, replace) {
    if (replace) history.replaceState({}, '', url);
    else history.pushState({}, '', url);
    route();
  }
  window.go = go;

  /* Ichki havolalarni ushlab olish — sahifa qayta yuklanmasin */
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
    if (/^(https?:|mailto:|tel:|#)/.test(href) || href.endsWith('.html')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(href);
  });
  window.addEventListener('popstate', () => route());

  /* ---------- Toast / modal ---------- */
  function toast(msg, kind) {
    let box = $('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.appendChild(box); }
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.innerHTML = msg;
    box.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; el.style.transition = '.25s'; }, 2600);
    setTimeout(() => el.remove(), 2950);
  }
  window.toast = toast;

  function modal(title, bodyHtml, onOpen) {
    closeModal();
    const m = document.createElement('div');
    m.className = 'mask';
    m.innerHTML = '<div class="modal"><div class="modal-hd"><h3>' + title + '</h3>' +
      '<button class="x" data-act="close-modal">&times;</button></div><div class="modal-b">' + bodyHtml + '</div></div>';
    m.addEventListener('click', e => { if (e.target === m) closeModal(); });
    document.body.appendChild(m);
    document.body.style.overflow = 'hidden';
    if (onOpen) onOpen(m);
  }
  function closeModal() { $$('.mask').forEach(m => m.remove()); document.body.style.overflow = ''; }
  window.closeModal = closeModal;

  /* ---------- Umumiy bo'laklar ---------- */
  function stockBadge(p) {
    if (p.stock === 'in') return '<span class="stock in"><i></i>' + t('inStock') + '</span>';
    if (p.stock === 'pre') return '<span class="stock pre"><i></i>' + t('preOrder') + ' · ' + p.lead + ' ' + t('leadDays') + '</span>';
    return '<span class="stock out"><i></i>' + t('outStock') + '</span>';
  }
  function productCard(p) {
    const tags = [];
    if (p.isNew) tags.push('<span class="tag tag-new">NEW</span>');
    if (p.isHit) tags.push('<span class="tag tag-hit">HIT</span>');
    if (p.old > p.price) tags.push('<span class="tag tag-sale">-' + Math.round((1 - p.price / p.old) * 100) + '%</span>');
    const specs = (p.specs || []).slice(0, 2)
      .map(s => '<span>' + esc(S.lang === 'ru' ? s[1] : s[0]) + ': ' + esc(s[2]) + '</span>').join('');
    return '<article class="pc">' +
      '<a class="pc-img" href="/mahsulot/' + p.slug + '"><img src="' + IMG(p.imgs[0]) + '" alt="' + esc(L(p, 'name')) + '" loading="lazy">' +
      '<div class="pc-tags">' + tags.join('') + '</div></a>' +
      '<button class="fav' + (S.isFav(p.id) ? ' on' : '') + '" data-act="fav" data-id="' + p.id + '" title="' + t('favs') + '">' + ic.heart + '</button>' +
      '<div class="pc-b">' +
      '<span class="pc-cat">' + esc(L(S.category(p.cat), 'name')) + '</span>' +
      '<h3><a href="/mahsulot/' + p.slug + '">' + esc(L(p, 'name')) + '</a></h3>' +
      '<div class="pc-specs">' + specs + '</div>' +
      stockBadge(p) +
      '<div class="pc-foot"><div class="price">' + money(p.price) + ' <span style="font-size:12px;font-weight:500">' + t('currency') + '</span>' +
      (p.old > p.price ? '<small>' + money(p.old) + '</small>' : '') + '</div>' +
      (p.stock === 'out' ? '' : '<button class="add-btn" data-act="add" data-id="' + p.id + '" title="' + t('addCart') + '">' + ic.plus + '</button>') +
      '</div></div></article>';
  }
  const grid = (arr, cls) => '<div class="grid ' + (cls || 'g-4') + '">' + arr.map(productCard).join('') + '</div>';

  function crumbs(items) {
    return '<div class="wrap"><div class="crumb">' +
      items.map((i, n) => (i.href ? '<a href="' + i.href + '">' + esc(i.label) + '</a>' : '<span>' + esc(i.label) + '</span>') +
        (n < items.length - 1 ? '<span>/</span>' : '')).join('') + '</div></div>';
  }

  /* ---------- Header / footer ---------- */
  function renderHeader() {
    const st = S.db.settings, u = S.user;
    $('#hd').innerHTML =
      '<div class="topbar"><div class="wrap">' +
      '<span class="hide-m">' + ic.truck.replace('width="20" height="20"', 'width="14" height="14"') + ' ' + t('topDelivery') + '</span>' +
      '<span class="spacer"></span>' +
      '<span class="hide-m">' + t('topWork') + '</span>' +
      '<a href="tel:' + st.phone.replace(/\s/g, '') + '">' + st.phone + '</a>' +
      '</div></div>' +
      '<header class="hd"><div class="wrap hd-in">' +
      '<a class="logo" href="/"><span class="logo-mark">' + ic.drone + '</span>My<b>Drone</b></a>' +
      '<div class="search"><input id="q" type="search" placeholder="' + t('searchPh') + '" autocomplete="off">' +
      '<button class="s-btn">' + ic.search + '</button><div id="ac"></div></div>' +
      '<div class="hd-acts">' +
      '<button class="icon-btn" data-theme-toggle title="' + t('themeSwitch') + '">' + (S.effTheme() === 'dark' ? ic.sun : ic.moon) + '</button>' +
      '<div class="lang"><button data-lang="uz" class="' + (S.lang === 'uz' ? 'on' : '') + '">UZ</button>' +
      '<button data-lang="ru" class="' + (S.lang === 'ru' ? 'on' : '') + '">RU</button></div>' +
      '<a class="icon-btn" href="/kabinet/saqlanganlar" title="' + t('favs') + '">' + ic.heart.replace('17', '19').replace('17', '19') + '</a>' +
      '<a class="icon-btn" href="/savat" title="' + t('cart') + '">' + ic.cart +
      (S.cartCount() ? '<span class="badge">' + S.cartCount() + '</span>' : '') + '</a>' +
      '<a class="icon-btn" href="' + (u ? '/kabinet' : '/kirish') + '" title="' + (u ? esc(u.name) : t('login')) + '">' + ic.user + '</a>' +
      '</div></div>' +
      '<nav class="cats"><div class="wrap">' +
      '<a href="/katalog">' + t('allCats') + '</a>' +
      S.db.categories.map(c => '<a href="/katalog?cat=' + c.id + '">' + esc(L(c, 'name')) + '</a>').join('') +
      '<a href="/blog">' + t('fBlog') + '</a><a href="/referal-dastur">' + t('fRef') + '</a><a href="/savollar">' + t('fFaq') + '</a>' +
      '</div></nav></header>';
  }

  function renderFooter() {
    const st = S.db.settings;
    $('#ft').innerHTML = '<footer><div class="wrap"><div class="f-grid">' +
      '<div><a class="logo" href="/"><span class="logo-mark">' + ic.drone + '</span>My<b>Drone</b></a>' +
      '<p class="mut sm" style="margin:14px 0 0;max-width:290px">' +
      (S.lang === 'ru' ? 'Импорт дронов и техники из Китая с официальной гарантией и доставкой по Узбекистану.'
        : "Xitoydan dron va texnika importi — rasmiy kafolat va O'zbekiston bo'ylab yetkazib berish bilan.") + '</p>' +
      '<div class="pays"><span>Click</span><span>Payme</span><span>Uzcard</span><span>Humo</span><span>' + (S.lang === 'ru' ? 'Наличные' : 'Naqd') + '</span></div>' +
      '<div class="socs"><a href="https://t.me/' + st.telegram + '" target="_blank" rel="noopener">' + ic.tg + '</a>' +
      '<a href="https://wa.me/' + st.whatsapp + '" target="_blank" rel="noopener">' + ic.wa + '</a>' +
      '<a href="https://instagram.com/' + st.instagram + '" target="_blank" rel="noopener">' + ic.inst + '</a></div></div>' +
      '<div><h4>' + t('fAbout') + '</h4>' +
      '<a href="/biz-haqimizda">' + t('fAboutUs') + '</a><a href="/blog">' + t('fBlog') + '</a>' +
      '<a href="/referal-dastur">' + t('fRef') + '</a><a href="/aloqa">' + t('fContact') + '</a></div>' +
      '<div><h4>' + t('fHelp') + '</h4>' +
      '<a href="/yetkazib-berish">' + t('fDelivery') + '</a><a href="/kafolat">' + t('fWarranty') + '</a>' +
      '<a href="/savollar">' + t('fFaq') + '</a><a href="/kabinet">' + t('account') + '</a></div>' +
      '<div><h4>' + t('fContact') + '</h4>' +
      '<a href="tel:' + st.phone.replace(/\s/g, '') + '">' + st.phone + '</a>' +
      '<a href="tel:' + st.phone2.replace(/\s/g, '') + '">' + st.phone2 + '</a>' +
      '<a href="mailto:' + st.email + '">' + st.email + '</a>' +
      '<span class="mut sm" style="display:block;padding:5px 0">' + esc(L(st, 'address')) + '</span>' +
      '<span class="mut sm" style="display:block">' + esc(L(st, 'workhours')) + '</span></div>' +
      '</div><div class="f-bot"><span>© 2026 MyDrone.uz — ' + t('fRights') + '</span>' +
      '<span>' + t('fDemo') +
      /* Admin panel faqat lokal ishlab chiqishda ko'rinadi — prodga chiqarilmaydi */
      (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)
        ? ' · <a href="/admin.html" style="display:inline;color:var(--acc)">Admin</a>' : '') +
      '</span></div></div></footer>';
  }

  /* ---------- Sahifa: BOSH ---------- */
  function viewHome() {
    const P = S.db.products;
    const hits = P.filter(p => p.isHit).slice(0, 8);
    const news = P.filter(p => p.isNew).slice(0, 4);
    const st = S.db.settings;
    return '' +
      '<section class="hero"><div class="hero-bg"><img src="' + IMG('hero-2.jpg') + '" alt=""></div><div class="wrap">' +
      '<span class="chip-live"><i class="dot"></i>' + t('heroChip') + '</span>' +
      '<h1>' + t('heroTitle') + '</h1><p>' + t('heroText') + '</p>' +
      '<div class="hero-btns"><a class="btn btn-p" href="/katalog">' + t('heroBtn1') + '</a>' +
      '<button class="btn btn-g" data-act="callback">' + ic.phone + t('heroBtn2') + '</button></div>' +
      '<div class="hero-stats"><div><b>1 200+</b><span class="mut sm">' + t('stat1') + '</span></div>' +
      '<div><b>' + P.length + '</b><span class="mut sm">' + t('stat2') + '</span></div>' +
      '<div><b>12 ' + (S.lang === 'ru' ? 'мес' : 'oy') + '</b><span class="mut sm">' + t('stat3') + '</span></div>' +
      '<div><b>4.8 ★</b><span class="mut sm">' + t('stat4') + '</span></div></div>' +
      '</div></section>' +

      '<div class="wrap"><div class="trust">' +
      [['shield', 'tr1t', 'tr1s'], ['truck', 'tr2t', 'tr2s'], ['card', 'tr3t', 'tr3s'], ['back', 'tr4t', 'tr4s']]
        .map(x => '<div class="trust-i"><span class="ic">' + ic[x[0]] + '</span><div><b>' + t(x[1]) + '</b><span>' + t(x[2]) + '</span></div></div>').join('') +
      '</div></div>' +

      '<section><div class="wrap"><div class="sec-hd"><div><h2>' + t('secCats') + '</h2><p>' + t('secCatsS') + '</p></div>' +
      '<a class="btn btn-ghost btn-sm" href="/katalog">' + t('viewAll') + '</a></div>' +
      '<div class="grid g-3">' + S.db.categories.map(c => {
        const cnt = S.db.products.filter(p => p.cat === c.id).length;
        return '<a class="cat-card" href="/katalog?cat=' + c.id + '"><img src="' + IMG(c.img) + '" alt="' + esc(L(c, 'name')) + '" loading="lazy">' +
          '<div class="ov"><h3>' + esc(L(c, 'name')) + '</h3><span>' + cnt + ' ' + (S.lang === 'ru' ? 'товаров' : 'ta mahsulot') + '</span></div></a>';
      }).join('') + '</div></div></section>' +

      '<section style="padding-top:0"><div class="wrap"><div class="sec-hd"><div><h2>' + t('secHits') + '</h2><p>' + t('secHitsS') + '</p></div>' +
      '<a class="btn btn-ghost btn-sm" href="/katalog?sort=pop">' + t('viewAll') + '</a></div>' + grid(hits) + '</div></section>' +

      '<section style="padding-top:0"><div class="wrap"><div class="banner">' +
      '<div style="flex:1;min-width:260px"><h3>' + t('fRef') + ' — ' + (S.lang === 'ru' ? 'зови друзей, получай бонусы' : "do'st taklif qiling, bonus oling") + '</h3>' +
      '<p>' + t('refHow') + '</p></div>' +
      '<a class="btn btn-p" href="/referal-dastur">' + t('more') + '</a></div></div></section>' +

      '<section style="padding-top:0"><div class="wrap"><div class="sec-hd"><div><h2>' + t('secNew') + '</h2><p>' + t('secNewS') + '</p></div>' +
      '<a class="btn btn-ghost btn-sm" href="/katalog?sort=new">' + t('viewAll') + '</a></div>' + grid(news) + '</div></section>' +

      '<section style="padding-top:0"><div class="wrap"><div class="sec-hd"><div><h2>' + t('secRev') + '</h2><p>' + t('secRevS') + '</p></div></div>' +
      '<div class="grid g-4">' + SEED.demoReviews.map(r =>
        '<div class="card"><div style="display:flex;gap:11px;align-items:center;margin-bottom:10px">' +
        '<span class="av">' + esc(r.name[0]) + '</span><div><b>' + esc(r.name) + '</b>' +
        '<div class="stars">' + '★'.repeat(r.rate) + '<span style="color:var(--txt-3)">' + '★'.repeat(5 - r.rate) + '</span></div></div></div>' +
        '<p class="mut sm" style="margin:0">' + esc(S.lang === 'ru' ? r.text_ru : r.text_uz) + '</p></div>').join('') +
      '</div></div></section>' +

      '<section style="padding-top:0"><div class="wrap"><div class="sec-hd"><div><h2>' + t('secBlog') + '</h2><p>' + t('secBlogS') + '</p></div>' +
      '<a class="btn btn-ghost btn-sm" href="/blog">' + t('viewAll') + '</a></div>' +
      '<div class="grid g-3">' + S.db.posts.slice(0, 3).map(postCard).join('') + '</div></div></section>';
  }

  const postCard = p => '<a class="post" href="/blog/' + p.slug + '"><img src="' + IMG(p.img) + '" alt="" loading="lazy">' +
    '<div class="post-b"><span class="pc-cat">' + esc(L(p, 'cat')) + ' · ' + p.date + '</span>' +
    '<h3>' + esc(L(p, 'title')) + '</h3><p class="mut sm" style="margin:0">' + esc(L(p, 'lead')) + '</p></div></a>';

  /* ---------- Sahifa: KATALOG ---------- */
  function viewCatalog(q) {
    const cat = q.cat || '', sub = q.sub || '', sort = q.sort || 'pop';
    const brandSel = (q.brand || '').split(',').filter(Boolean);
    const stockSel = (q.stock || '').split(',').filter(Boolean);
    const min = +q.min || 0, max = +q.max || 0, term = (q.q || '').toLowerCase();

    let list = S.db.products.slice();
    if (cat) list = list.filter(p => p.cat === cat);
    if (sub) list = list.filter(p => p.sub === sub);
    if (brandSel.length) list = list.filter(p => brandSel.includes(p.brand));
    if (stockSel.length) list = list.filter(p => stockSel.includes(p.stock));
    if (min) list = list.filter(p => p.price >= min);
    if (max) list = list.filter(p => p.price <= max);
    if (term) list = list.filter(p => (p.name_uz + p.name_ru + p.brand).toLowerCase().includes(term));

    const sorters = {
      pop: (a, b) => b.sold - a.sold, new: (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.sold - a.sold,
      cheap: (a, b) => a.price - b.price, exp: (a, b) => b.price - a.price, rate: (a, b) => b.rating - a.rating
    };
    list.sort(sorters[sort] || sorters.pop);

    const c = cat ? S.category(cat) : null;
    const title = c ? (sub ? L(c.subs.find(s => s.id === sub) || {}, 'name') : L(c, 'name')) : (term ? '"' + esc(term) + '"' : t('catalog'));
    const scope = S.db.products.filter(p => !cat || p.cat === cat);

    const filters = '<aside class="filters" id="filters">' +
      '<div class="f-grp"><h4>' + t('catalog') + '</h4>' +
      '<label class="chk"><input type="radio" name="fcat" value="" ' + (!cat ? 'checked' : '') + '><span>' + t('all') + '</span><span class="cnt">' + S.db.products.length + '</span></label>' +
      S.db.categories.map(x => {
        const n = S.db.products.filter(p => p.cat === x.id).length;
        const on = cat === x.id;
        return '<label class="chk"><input type="radio" name="fcat" value="' + x.id + '" ' + (on ? 'checked' : '') + '>' +
          '<span>' + esc(L(x, 'name')) + '</span><span class="cnt">' + n + '</span></label>' +
          (on ? '<div style="padding-left:22px">' + x.subs.map(s => {
            const sn = S.db.products.filter(p => p.sub === s.id).length;
            return '<label class="chk"><input type="radio" name="fsub" value="' + s.id + '" ' + (sub === s.id ? 'checked' : '') + '>' +
              '<span class="sm">' + esc(L(s, 'name')) + '</span><span class="cnt">' + sn + '</span></label>';
          }).join('') + '</div>' : '');
      }).join('') + '</div>' +
      '<div class="f-grp"><h4>' + t('price') + ' (' + t('currency') + ')</h4><div class="rng">' +
      '<input id="fmin" type="number" placeholder="' + t('from') + '" value="' + (min || '') + '">' +
      '<input id="fmax" type="number" placeholder="' + t('to') + '" value="' + (max || '') + '"></div>' +
      '<button class="btn btn-g btn-sm btn-block" style="margin-top:10px" data-act="fprice">' + t('apply') + '</button></div>' +
      '<div class="f-grp"><h4>' + t('brand') + '</h4>' +
      [...new Set(scope.map(p => p.brand))].sort().map(b =>
        '<label class="chk"><input type="checkbox" name="fbrand" value="' + esc(b) + '" ' + (brandSel.includes(b) ? 'checked' : '') + '>' +
        '<span>' + esc(b) + '</span><span class="cnt">' + scope.filter(p => p.brand === b).length + '</span></label>').join('') + '</div>' +
      '<div class="f-grp"><h4>' + t('availability') + '</h4>' +
      [['in', t('inStock')], ['pre', t('preOrder')]].map(s =>
        '<label class="chk"><input type="checkbox" name="fstock" value="' + s[0] + '" ' + (stockSel.includes(s[0]) ? 'checked' : '') + '>' +
        '<span>' + s[1] + '</span><span class="cnt">' + scope.filter(p => p.stock === s[0]).length + '</span></label>').join('') + '</div>' +
      '<button class="btn btn-ghost btn-sm btn-block" data-act="freset">' + t('reset') + '</button></aside>';

    const body = '<div class="cat-layout">' + filters + '<div>' +
      '<div class="cat-top">' +
      '<button class="btn btn-g btn-sm f-toggle" data-act="ftoggle">' + t('filters') + '</button>' +
      '<span class="cnt">' + list.length + ' ' + t('found') + '</span>' +
      '<select class="sel" id="fsort" style="margin-left:auto">' +
      [['pop', t('sortPop')], ['new', t('sortNew')], ['cheap', t('sortCheap')], ['exp', t('sortExp')], ['rate', t('sortRate')]]
        .map(o => '<option value="' + o[0] + '" ' + (sort === o[0] ? 'selected' : '') + '>' + o[1] + '</option>').join('') +
      '</select></div>' +
      (list.length ? grid(list, 'g-3') :
        '<div class="empty">' + ic.empty + '<h3>' + t('nothing') + '</h3><p>' + t('nothingS') + '</p>' +
        '<button class="btn btn-g btn-sm" style="margin-top:14px" data-act="freset">' + t('reset') + '</button></div>') +
      '</div></div>';

    return crumbs([{ label: t('home'), href: '/' }, { label: t('catalog'), href: '/katalog' }].concat(c ? [{ label: title }] : [])) +
      '<section style="padding-top:22px"><div class="wrap"><div class="sec-hd"><div><h2>' + esc(title) + '</h2>' +
      (c && !sub ? '<p>' + esc(c.subs.map(s => L(s, 'name')).join(' · ')) + '</p>' : '') + '</div></div>' + body + '</div></section>';
  }

  /* ---------- Sahifa: MAHSULOT ---------- */
  function viewProduct(slug) {
    const p = S.bySlug(slug);
    if (!p) return '<div class="wrap"><div class="empty">' + ic.empty + '<h3>' + t('nothing') + '</h3></div></div>';
    const c = S.category(p.cat), sub = c && c.subs.find(s => s.id === p.sub);
    const revs = S.online
      ? (p.reviewList || [])
      : (S.db.reviews[p.id] || []).concat(SEED.demoReviews.slice(0, 2).map(r => ({ ...r, text: S.lang === 'ru' ? r.text_ru : r.text_uz })));
    const inCart = S.cart.find(r => r.id === p.id);
    const similar = S.db.products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);

    return crumbs([{ label: t('home'), href: '/' }, { label: t('catalog'), href: '/katalog' },
      { label: L(c, 'name'), href: '/katalog?cat=' + p.cat }, { label: L(p, 'name') }]) +
      '<section style="padding-top:20px"><div class="wrap"><div class="pd">' +
      '<div><div class="gal-main"><img id="gmain" src="' + IMG(p.imgs[0]) + '" alt="' + esc(L(p, 'name')) + '"></div>' +
      '<div class="gal-thumbs">' + p.imgs.map((im, i) =>
        '<img src="' + IMG(im) + '" class="' + (i ? '' : 'on') + '" data-act="gal" alt="" loading="lazy">').join('') + '</div></div>' +
      '<div>' +
      '<span class="pc-cat">' + esc(p.brand) + (sub ? ' · ' + esc(L(sub, 'name')) : '') + '</span>' +
      '<h1>' + esc(L(p, 'name')) + '</h1>' +
      '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">' +
      '<span class="stars">' + '★'.repeat(Math.round(p.rating)) + '</span><span class="mut sm">' + p.rating + ' · ' + p.reviews + ' ' + t('reviews').toLowerCase() + '</span>' +
      '<span class="mut sm">· ' + p.sold + ' ' + (S.lang === 'ru' ? 'продано' : 'sotilgan') + '</span></div>' +
      '<div class="pd-price">' + money(p.price) + ' <span style="font-size:18px">' + t('currency') + '</span>' +
      (p.old > p.price ? '<small>' + money(p.old) + '</small>' : '') + '</div>' +
      '<div style="margin-bottom:6px">' + stockBadge(p) + (p.stock === 'in' && p.qty < 6 ? ' <span class="mut sm">· ' + p.qty + ' ' + t('qtyLeft') + '</span>' : '') + '</div>' +
      '<p class="mut" style="margin:14px 0 0">' + esc(L(p, 'short')) + '</p>' +
      '<div class="pd-buy">' +
      '<div class="qty"><button data-act="q-" >−</button><input id="pqty" value="1" inputmode="numeric"><button data-act="q+">+</button></div>' +
      (p.stock === 'out'
        ? '<button class="btn btn-g" disabled>' + t('outStock') + '</button>'
        : '<button class="btn btn-p" data-act="add" data-id="' + p.id + '" data-qty="1">' + ic.cart + (inCart ? t('inCart') : t('addCart')) + '</button>' +
          '<button class="btn btn-g" data-act="buy" data-id="' + p.id + '">' + t('buyNow') + '</button>') +
      '<button class="icon-btn' + (S.isFav(p.id) ? ' on' : '') + '" data-act="fav" data-id="' + p.id + '" style="height:46px;width:46px">' + ic.heart + '</button>' +
      '</div>' +
      (p.stock === 'pre' ? '<div class="hint">' + t('preHint') + '</div>' : '') +
      '<div class="card" style="margin-top:18px">' +
      '<div class="usp">' + ic.shield + '<div><b>' + t('tr1t') + '</b><div class="mut sm">' + t('tr1s') + '</div></div></div>' +
      '<div class="usp">' + ic.truck + '<div><b>' + t('tr2t') + '</b><div class="mut sm">' + t('tr2s') + '</div></div></div>' +
      '<div class="usp">' + ic.card + '<div><b>' + t('tr3t') + '</b><div class="mut sm">' + t('tr3s') + '</div></div></div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">' +
      '<a class="btn btn-g btn-sm" href="https://t.me/' + S.db.settings.telegram + '" target="_blank" rel="noopener">' + ic.tg + t('writeTg') + '</a>' +
      '<button class="btn btn-ghost btn-sm" data-act="callback">' + t('callback') + '</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="share">' + t('share') + '</button></div>' +
      '</div></div>' +

      '<div class="tabs" id="ptabs">' +
      '<button class="on" data-tab="spec">' + t('specs') + '</button>' +
      '<button data-tab="desc">' + t('descr') + '</button>' +
      '<button data-tab="rev">' + t('reviews') + ' (' + revs.length + ')</button>' +
      '<button data-tab="dlv">' + t('delivery') + '</button></div>' +
      '<div id="tab-spec" class="tabbody"><table class="spec-tbl" style="max-width:640px">' +
      (p.specs || []).map(s => '<tr><td>' + esc(S.lang === 'ru' ? s[1] : s[0]) + '</td><td>' + esc(s[2]) + '</td></tr>').join('') +
      '</table></div>' +
      '<div id="tab-desc" class="tabbody hidden prose"><p>' + esc(L(p, 'short')) + '</p>' +
      '<p>' + (S.lang === 'ru'
        ? 'Товар поставляется напрямую из Китая. Перед отправкой каждая единица проверяется на нашем консолидационном складе. В комплект входит гарантийный талон и инструкция на русском языке.'
        : "Mahsulot to'g'ridan-to'g'ri Xitoydan keltiriladi. Jo'natishdan oldin har bir dona konsolidatsiya omborimizda tekshiriladi. To'plamga kafolat taloni va o'zbek tilidagi qo'llanma kiradi.") + '</p></div>' +
      '<div id="tab-rev" class="tabbody hidden">' +
      '<div class="card" style="max-width:720px">' + revs.map(r =>
        '<div class="review"><div style="display:flex;gap:11px;align-items:center;margin-bottom:7px">' +
        '<span class="av">' + esc(r.name[0]) + '</span><div><b>' + esc(r.name) + '</b>' +
        '<div class="stars">' + '★'.repeat(r.rate) + '</div></div><span class="mut xs" style="margin-left:auto">' + r.date + '</span></div>' +
        '<p class="mut sm" style="margin:0">' + esc(r.text || r.text_uz) + '</p></div>').join('') +
      '<button class="btn btn-g btn-sm" style="margin-top:14px" data-act="addrev" data-id="' + p.id + '">' +
      (S.lang === 'ru' ? 'Оставить отзыв' : 'Sharh qoldirish') + '</button></div></div>' +
      '<div id="tab-dlv" class="tabbody hidden prose">' +
      '<ul><li>' + t('dlvCourier') + ' — ' + t('dlvCourierS') + ' (' + money(S.db.settings.deliveryTashkent) + ' ' + t('currency') + ')</li>' +
      '<li>' + t('dlvRegion') + ' — ' + t('dlvRegionS') + ' (' + money(S.db.settings.deliveryRegion) + ' ' + t('currency') + ')</li>' +
      '<li>' + t('dlvPickup') + ' — ' + t('dlvPickupS') + '</li>' +
      '<li>' + money(S.db.settings.freeFrom) + ' ' + t('currency') + ' ' + t('freeHint') + '</li></ul></div>' +

      '<div class="sec-hd" style="margin-top:44px"><h2>' + t('similar') + '</h2></div>' + grid(similar) +
      '</div></section>';
  }

  /* ---------- Sahifa: SAVAT ---------- */
  const REGIONS = ['Toshkent sh.', 'Toshkent v.', 'Samarqand', 'Buxoro', 'Andijon', 'Farg\'ona', 'Namangan',
    'Qashqadaryo', 'Surxondaryo', 'Jizzax', 'Sirdaryo', 'Navoiy', 'Xorazm', 'Qoraqalpog\'iston'];

  function calcTotals(dlv, promo, bonus) {
    const goods = S.cartGoods();
    const st = S.db.settings;
    let delivery = 0;
    if (dlv === 'courier') delivery = goods >= st.freeFrom ? 0 : st.deliveryTashkent;
    if (dlv === 'region') delivery = goods >= st.freeFrom ? 0 : st.deliveryRegion;
    let discount = 0;
    if (promo) discount = promo.type === 'percent' ? Math.round(goods * promo.value / 100) : Math.min(promo.value, goods);
    const bonusUsed = Math.min(bonus || 0, Math.max(0, goods - discount));
    return { goods, delivery, discount, bonusUsed, total: Math.max(0, goods - discount - bonusUsed + delivery) };
  }

  let promoApplied = null, bonusApplied = 0;

  function viewCart() {
    const rows = S.cartRows();
    if (!rows.length) return '<div class="wrap"><div class="empty" style="padding:90px 20px">' + ic.cart.replace('width="20" height="20"', 'width="52" height="52"') +
      '<h3 style="margin:14px 0 6px">' + t('cartEmpty') + '</h3><p>' + t('cartEmptyS') + '</p>' +
      '<a class="btn btn-p" style="margin-top:16px" href="/katalog">' + t('toCatalog') + '</a></div></div>';

    const tot = calcTotals('courier', promoApplied, bonusApplied);
    return '<section><div class="wrap"><div class="sec-hd"><h2>' + t('cart') + ' <span class="mut" style="font-size:16px">(' + S.cartCount() + ')</span></h2></div>' +
      '<div style="display:grid;grid-template-columns:1fr 340px;gap:26px;align-items:start" class="cart-grid">' +
      '<div class="card">' + rows.map(r =>
        '<div class="cart-row"><a href="/mahsulot/' + r.p.slug + '"><img src="' + IMG(r.p.imgs[0]) + '" alt=""></a>' +
        '<div><a href="/mahsulot/' + r.p.slug + '"><b>' + esc(L(r.p, 'name')) + '</b></a>' +
        '<div style="margin:6px 0">' + stockBadge(r.p) + '</div>' +
        '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">' +
        '<div class="qty" style="height:38px"><button data-act="cq-" data-id="' + r.id + '">−</button>' +
        '<input value="' + r.qty + '" readonly><button data-act="cq+" data-id="' + r.id + '">+</button></div>' +
        '<button class="btn btn-ghost btn-sm" data-act="rm" data-id="' + r.id + '">' + t('remove') + '</button></div></div>' +
        '<div style="text-align:right"><div class="price">' + money(r.p.price * r.qty) + '</div>' +
        '<span class="mut xs">' + money(r.p.price) + ' × ' + r.qty + '</span></div></div>').join('') + '</div>' +
      '<div class="card" style="position:sticky;top:150px">' +
      '<div style="display:flex;gap:8px;margin-bottom:14px"><input id="promo" class="rng" style="flex:1;height:42px;border-radius:11px;border:1px solid var(--line);background:var(--bg-2);padding:0 12px" placeholder="' + t('promo') + '" value="' + (promoApplied ? promoApplied.code : '') + '">' +
      '<button class="btn btn-g btn-sm" data-act="promo">' + t('apply') + '</button></div>' +
      (S.user && S.user.bonus ? '<label class="chk" style="margin-bottom:12px"><input type="checkbox" id="usebonus" ' + (bonusApplied ? 'checked' : '') + '>' +
        '<span class="sm">' + t('bonusUsed') + ': ' + money(S.user.bonus) + '</span></label>' : '') +
      '<div class="sum-row"><span class="mut">' + t('subtotal') + '</span><span>' + money(tot.goods) + '</span></div>' +
      (tot.discount ? '<div class="sum-row"><span class="mut">' + t('discount') + '</span><span style="color:var(--ok)">−' + money(tot.discount) + '</span></div>' : '') +
      (tot.bonusUsed ? '<div class="sum-row"><span class="mut">' + t('bonusUsed') + '</span><span style="color:var(--ok)">−' + money(tot.bonusUsed) + '</span></div>' : '') +
      '<div class="sum-row"><span class="mut">' + t('deliveryCost') + '</span><span>' + (tot.delivery ? money(tot.delivery) : t('free')) + '</span></div>' +
      '<div class="sum-row total"><span>' + t('total') + '</span><span>' + money(tot.total) + ' ' + t('currency') + '</span></div>' +
      '<a class="btn btn-p btn-block" style="margin-top:14px" href="/buyurtma">' + t('checkout') + '</a>' +
      '<a class="btn btn-ghost btn-block" style="margin-top:9px" href="/katalog">' + t('keepShopping') + '</a>' +
      '<div class="hint">' + money(S.db.settings.freeFrom) + ' ' + t('currency') + ' ' + t('freeHint') + '</div>' +
      '</div></div></div></section>';
  }

  /* ---------- Sahifa: CHECKOUT ---------- */
  function viewCheckout() {
    if (!S.cartRows().length) { setTimeout(() => go('/savat'), 0); return ''; }
    const u = S.user || {};
    const tot = calcTotals('courier', promoApplied, bonusApplied);
    return '<section><div class="wrap"><div class="sec-hd"><h2>' + t('checkout') + '</h2></div>' +
      '<div class="steps"><div class="on"><b>1</b>' + t('step1') + '</div><div class="on"><b>2</b>' + t('step2') + '</div><div class="on"><b>3</b>' + t('step3') + '</div></div>' +
      '<form id="co" style="display:grid;grid-template-columns:1fr 340px;gap:26px;align-items:start" class="cart-grid">' +
      '<div>' +
      '<div class="card" style="margin-bottom:18px"><h3 style="font-size:17px;margin-bottom:14px">' + t('step1') + '</h3>' +
      '<div class="grid g-2">' +
      fld('name', t('name'), u.name || '', 'text', true) +
      fld('phone', t('phone'), u.phone || '+998 ', 'tel', true) +
      '</div>' + fld('email', t('email'), u.email || '', 'email', false) + '</div>' +

      '<div class="card" style="margin-bottom:18px"><h3 style="font-size:17px;margin-bottom:14px">' + t('step2') + '</h3>' +
      '<label class="opt on"><input type="radio" name="dlv" value="courier" checked><div><b>' + t('dlvCourier') + '</b><span>' + t('dlvCourierS') + '</span></div>' +
      '<span class="pay-ic">' + (tot.goods >= S.db.settings.freeFrom ? t('free') : money(S.db.settings.deliveryTashkent)) + '</span></label>' +
      '<label class="opt"><input type="radio" name="dlv" value="region"><div><b>' + t('dlvRegion') + '</b><span>' + t('dlvRegionS') + '</span></div>' +
      '<span class="pay-ic">' + (tot.goods >= S.db.settings.freeFrom ? t('free') : money(S.db.settings.deliveryRegion)) + '</span></label>' +
      '<label class="opt"><input type="radio" name="dlv" value="pickup"><div><b>' + t('dlvPickup') + '</b><span>' + t('dlvPickupS') + '</span></div>' +
      '<span class="pay-ic">' + t('free') + '</span></label>' +
      '<div id="addrbox" style="margin-top:14px"><div class="grid g-2">' +
      '<div class="field"><label>' + t('region') + '</label><select name="region">' +
      REGIONS.map(r => '<option>' + r + '</option>').join('') + '</select></div>' +
      fld('city', t('city'), '', 'text', true) + '</div>' +
      fld('addr', t('addr'), '', 'text', true) +
      '<div class="field"><label>' + t('note') + '</label><textarea name="note" placeholder="' + t('notePh') + '"></textarea></div>' +
      '</div></div>' +

      '<div class="card"><h3 style="font-size:17px;margin-bottom:14px">' + t('step3') + '</h3>' +
      '<label class="opt on"><input type="radio" name="pay" value="cash" checked><div><b>' + t('payCash') + '</b><span>' + t('payCashS') + '</span></div></label>' +
      '<label class="opt"><input type="radio" name="pay" value="click"><div><b>' + t('payClick') + '</b><span>' + t('payClickS') + '</span></div><span class="pay-ic">Click</span></label>' +
      '<label class="opt"><input type="radio" name="pay" value="payme"><div><b>' + t('payPayme') + '</b><span>' + t('paymeS') + '</span></div><span class="pay-ic">Payme</span></label>' +
      '<label class="opt"><input type="radio" name="pay" value="card"><div><b>' + t('payCard') + '</b><span>' + t('payCardS') + '</span></div><span class="pay-ic">Uzcard</span></label>' +
      (S.cartRows().some(r => r.p.stock === 'pre') ? '<div class="hint">' + t('preHint') + '</div>' : '') +
      '</div></div>' +

      '<div class="card" style="position:sticky;top:150px">' +
      S.cartRows().map(r => '<div style="display:flex;gap:11px;align-items:center;padding:8px 0">' +
        '<img src="' + IMG(r.p.imgs[0]) + '" style="width:52px;height:40px;object-fit:cover;border-radius:8px">' +
        '<div style="flex:1;min-width:0"><div class="sm" style="line-height:1.3">' + esc(L(r.p, 'name')) + '</div>' +
        '<span class="mut xs">' + r.qty + ' × ' + money(r.p.price) + '</span></div></div>').join('') +
      '<div style="border-top:1px solid var(--line-soft);margin:10px 0"></div>' +
      '<div class="sum-row"><span class="mut">' + t('subtotal') + '</span><span>' + money(tot.goods) + '</span></div>' +
      (tot.discount ? '<div class="sum-row"><span class="mut">' + t('discount') + '</span><span style="color:var(--ok)">−' + money(tot.discount) + '</span></div>' : '') +
      (tot.bonusUsed ? '<div class="sum-row"><span class="mut">' + t('bonusUsed') + '</span><span style="color:var(--ok)">−' + money(tot.bonusUsed) + '</span></div>' : '') +
      '<div class="sum-row"><span class="mut">' + t('deliveryCost') + '</span><span id="dlvsum">' + (tot.delivery ? money(tot.delivery) : t('free')) + '</span></div>' +
      '<div class="sum-row total"><span>' + t('total') + '</span><span id="totsum">' + money(tot.total) + ' ' + t('currency') + '</span></div>' +
      '<button type="submit" class="btn btn-p btn-block" style="margin-top:14px">' + t('confirmOrder') + '</button>' +
      '<a class="btn btn-ghost btn-block" style="margin-top:9px" href="/savat">' + t('backCart') + '</a>' +
      '</div></form></div></section>';
  }
  const fld = (name, label, val, type, req) =>
    '<div class="field" data-f="' + name + '"><label>' + label + (req ? ' *' : '') + '</label>' +
    '<input name="' + name + '" type="' + type + '" value="' + esc(val) + '"><div class="err">' + t('reqField') + '</div></div>';

  function viewOrderOk(id) {
    const o = lastOrder && lastOrder.id === id ? lastOrder : S.db.orders.find(x => x.id === id);
    return '<section><div class="wrap" style="max-width:640px;text-align:center;padding:40px 20px">' +
      '<div style="width:76px;height:76px;border-radius:50%;background:rgba(52,211,153,.14);color:var(--ok);display:grid;place-items:center;margin:0 auto 20px">' +
      ic.check.replace('width="17" height="17"', 'width="36" height="36"') + '</div>' +
      '<h1 style="font-size:27px">' + t('orderOk') + '</h1>' +
      '<p class="mut" style="margin:12px 0 22px">' + t('orderOkS') + '</p>' +
      '<div class="card" style="text-align:left">' +
      '<div class="sum-row"><span class="mut">' + t('orderNo') + '</span><b>' + id + '</b></div>' +
      (o ? '<div class="sum-row"><span class="mut">' + t('total') + '</span><b>' + money(o.total) + ' ' + t('currency') + '</b></div>' +
        '<div class="sum-row"><span class="mut">' + t('phone') + '</span><span>' + esc(o.phone) + '</span></div>' : '') + '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap">' +
      '<a class="btn btn-p" href="/kabinet/buyurtmalar">' + t('myOrders') + '</a>' +
      '<a class="btn btn-g" href="/katalog">' + t('keepShopping') + '</a></div></div></section>';
  }

  /* ---------- Sahifa: KABINET ---------- */
  const ST_MAP = { new: ['stNew', 'st-new'], confirmed: ['stConfirmed', 'st-cn'], shipped: ['stShipped', 'st-sh'],
    way: ['stWay', 'st-wy'], done: ['stDone', 'st-dn'], cancel: ['stCancel', 'st-cx'] };
  const ST_ORDER = ['new', 'confirmed', 'shipped', 'way', 'done'];

  function viewAccount(tab) {
    if (!S.user) { setTimeout(() => go('/kirish'), 0); return ''; }
    const u = S.user;
    tab = tab || 'orders';
    const nav = ['orders', 'refProgram', 'favs', 'profile'].map(k => {
      const href = { orders: '/kabinet/buyurtmalar', refProgram: '/kabinet/referal', favs: '/kabinet/saqlanganlar', profile: '/kabinet/profil' }[k];
      const on = { orders: 'orders', refProgram: 'ref', favs: 'favs', profile: 'profile' }[k] === tab;
      return '<a href="' + href + '" class="' + (on ? 'on' : '') + '">' + t(k) + '</a>';
    }).join('') + '<a data-act="logout">' + t('logout') + '</a>';

    let body = '';
    if (tab === 'orders') {
      const mine = accOrders;
      body = mine.length ? mine.map(orderCard).join('') :
        '<div class="empty">' + ic.box.replace('width="20" height="20"', 'width="46" height="46"') + '<h3>' + t('noOrders') + '</h3>' +
        '<a class="btn btn-p btn-sm" style="margin-top:14px" href="/katalog">' + t('toCatalog') + '</a></div>';
    } else if (tab === 'ref') {
      const link = location.origin + '/?ref=' + u.ref;
      body = '<div class="ref-box"><h3 style="font-size:19px">' + t('refProgram') + '</h3>' +
        '<p class="mut sm" style="margin:8px 0 0">' + t('refHow') + '</p>' +
        '<div class="ref-link"><input id="reflink" readonly value="' + esc(link) + '">' +
        '<button class="btn btn-p" data-act="copyref">' + t('copy') + '</button></div>' +
        '<div class="mut sm" style="margin-top:10px">' + (S.lang === 'ru' ? 'Ваш код' : 'Sizning kodingiz') + ': <b style="color:var(--acc)">' + u.ref + '</b></div></div>' +
        '<div class="grid g-3" style="margin-top:18px">' +
        '<div class="kpi"><b>' + money(u.bonus) + '</b><span>' + t('balance') + ' (' + t('currency') + ')</span></div>' +
        '<div class="kpi"><b>' + (u.invited || 0) + '</b><span>' + t('invited') + '</span></div>' +
        '<div class="kpi"><b>' + money(u.earned || 0) + '</b><span>' + t('earned') + '</span></div></div>' +
        '<div class="card" style="margin-top:18px"><h3 style="font-size:16px;margin-bottom:10px">' + (S.lang === 'ru' ? 'Как это работает' : 'Qanday ishlaydi') + '</h3>' +
        ['1', '2', '3'].map((n, i) => '<div class="usp"><span class="av" style="width:28px;height:28px;font-size:13px">' + n + '</span><div>' +
          (S.lang === 'ru'
            ? ['Отправьте другу свою ссылку', 'Друг регистрируется и получает скидку ' + money(S.db.settings.refBonusNew) + ' сум на первый заказ',
               'Вы получаете ' + S.db.settings.refPercent + '% бонусами с каждого его заказа'][i]
            : ["Do'stingizga havolangizni yuboring", "Do'st ro'yxatdan o'tadi va birinchi buyurtmaga " + money(S.db.settings.refBonusNew) + " so'm chegirma oladi",
               "Siz uning har bir buyurtmasidan " + S.db.settings.refPercent + "% bonus olasiz"][i]) +
          '</div></div>').join('') + '</div>';
    } else if (tab === 'favs') {
      const list = S.favs().map(id => S.product(id)).filter(Boolean);
      body = list.length ? grid(list, 'g-3') : '<div class="empty">' + ic.heart.replace('width="17" height="17"', 'width="46" height="46"') +
        '<h3>' + t('noFavs') + '</h3><a class="btn btn-p btn-sm" style="margin-top:14px" href="/katalog">' + t('toCatalog') + '</a></div>';
    } else {
      body = '<form class="card" id="pform" style="max-width:520px">' +
        fld('name', t('name'), u.name, 'text', true) +
        fld('phone', t('phone'), u.phone, 'tel', true) +
        fld('email', t('email'), u.email, 'email', true) +
        '<button class="btn btn-p" type="submit">' + t('save') + '</button></form>';
    }

    return '<section><div class="wrap"><div class="sec-hd"><div><h2>' + esc(u.name) + '</h2>' +
      '<p>' + esc(u.email) + ' · ' + t('balance') + ': <b style="color:var(--acc)">' + money(u.bonus) + ' ' + t('currency') + '</b></p></div></div>' +
      '<div class="acc-layout"><nav class="acc-nav">' + nav + '</nav><div>' + body + '</div></div></div></section>';
  }

  function orderCard(o) {
    const stx = ST_MAP[o.status] || ST_MAP.new;
    const idx = ST_ORDER.indexOf(o.status);
    return '<div class="ord"><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">' +
      '<b>' + o.id + '</b><span class="st ' + stx[1] + '">' + t(stx[0]) + '</span>' +
      '<span class="mut sm">' + o.created.slice(0, 10) + '</span>' +
      '<b style="margin-left:auto">' + money(o.total) + ' ' + t('currency') + '</b></div>' +
      '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">' + o.items.map(it => {
        const p = S.product(it.id);
        const slug = (p && p.slug) || it.slug, img = (p && p.imgs[0]) || it.img, nm = p ? L(p, 'name') : (it.name || '');
        if (!img) return '';
        return '<a href="/mahsulot/' + slug + '" title="' + esc(nm) + '"><img src="' + IMG(img) + '" style="width:58px;height:45px;object-fit:cover;border-radius:8px"></a>';
      }).join('') + '</div>' +
      (o.status === 'cancel' ? '' : '<div class="track">' + ST_ORDER.map((s, i) =>
        '<div class="' + (i <= idx ? 'done' : '') + '">' + t(ST_MAP[s][0]) + '</div>').join('') + '</div>') +
      '<div class="mut sm" style="margin-top:10px">' + t('delivery') + ': ' + esc(o.region || '') + (o.addr ? ', ' + esc(o.addr) : '') + '</div></div>';
  }

  /* ---------- Sahifa: KIRISH ---------- */
  function viewLogin() {
    return '<section><div class="wrap" style="max-width:430px"><div class="card">' +
      '<div class="auth-tabs"><button class="on" data-auth="in">' + t('signin') + '</button><button data-auth="up">' + t('signup') + '</button></div>' +
      '<form id="fin">' + fld('email', 'Email', 'demo@mydrone.uz', 'email', true) + fld('pass', t('pass'), 'demo12345', 'password', true) +
      '<button class="btn btn-p btn-block" type="submit">' + t('signin') + '</button>' +
      '<div class="hint">Demo: <b>demo@mydrone.uz</b> / <b>demo12345</b><br>' + t('authHint') + '</div></form>' +
      '<form id="fup" class="hidden">' + fld('name', t('name'), '', 'text', true) + fld('phone', t('phone'), '+998 ', 'tel', true) +
      fld('email', 'Email', '', 'email', true) + fld('pass', t('pass'), '', 'password', true) +
      fld('ref', t('haveRef'), sessionStorage.getItem('dm_ref_code') || '', 'text', false) +
      '<button class="btn btn-p btn-block" type="submit">' + t('signup') + '</button>' +
      '<div class="hint">' + t('authHint') + '</div></form>' +
      '</div></div></section>';
  }

  /* ---------- Statik sahifalar ---------- */
  function page(title, html) {
    return '<section><div class="wrap"><div class="sec-hd"><h2>' + title + '</h2></div><div class="prose">' + html + '</div></div></section>';
  }
  function viewStatic(name) {
    const st = S.db.settings, ru = S.lang === 'ru';
    if (name === 'delivery') return page(t('fDelivery'), ru
      ? '<h2>Доставка</h2><ul><li><strong>Ташкент:</strong> курьер, 1–2 рабочих дня — ' + money(st.deliveryTashkent) + ' сум.</li><li><strong>Регионы:</strong> 2–4 рабочих дня почтовой службой — ' + money(st.deliveryRegion) + ' сум.</li><li><strong>Самовывоз:</strong> ' + esc(L(st, 'address')) + ' — бесплатно.</li><li>При заказе свыше <strong>' + money(st.freeFrom) + ' сум</strong> доставка бесплатна.</li></ul><h2>Товары под заказ</h2><p>Товары с пометкой «под заказ» везём из Китая. Срок — 14–28 дней: закупка (1–3 дня), склад в Гуанчжоу (2–5 дней), транспорт (7–18 дней), таможня и вручение (2–4 дня). Каждый этап виден в личном кабинете.</p><h2>Оплата</h2><ul><li>Наличными курьеру при получении.</li><li>Онлайн: Click, Payme, Uzcard/Humo.</li><li>Для товаров под заказ — предоплата 50%.</li></ul><h2>Юридическое примечание</h2><p>Приём онлайн-платежей ведётся через сертифицированного платёжного агрегатора. Данные карты на сайте не хранятся.</p>'
      : "<h2>Yetkazib berish</h2><ul><li><strong>Toshkent:</strong> kuryer, 1–2 ish kuni — " + money(st.deliveryTashkent) + " so'm.</li><li><strong>Viloyatlar:</strong> 2–4 ish kuni, pochta xizmati orqali — " + money(st.deliveryRegion) + " so'm.</li><li><strong>O'zi olib ketish:</strong> " + esc(L(st, 'address')) + " — bepul.</li><li><strong>" + money(st.freeFrom) + " so'm</strong>dan yuqori buyurtmalarga yetkazib berish bepul.</li></ul><h2>Buyurtma asosidagi mahsulotlar</h2><p>\"Buyurtma asosida\" belgisi bo'lgan mahsulotlar Xitoydan keltiriladi. Muddat — 14–28 kun: sotib olish (1–3 kun), Guanchjou ombori (2–5 kun), transport (7–18 kun), bojxona va topshirish (2–4 kun). Har bir bosqich shaxsiy kabinetda ko'rinadi.</p><h2>To'lov</h2><ul><li>Yetkazib berilganda kuryerga naqd.</li><li>Onlayn: Click, Payme, Uzcard/Humo.</li><li>Buyurtma asosidagi mahsulotlar uchun 50% oldindan to'lov.</li></ul><h2>Huquqiy eslatma</h2><p>Onlayn to'lovlar sertifikatlangan to'lov agregatori orqali qabul qilinadi. Karta ma'lumotlari saytda saqlanmaydi.</p>");

    if (name === 'warranty') return page(t('fWarranty'), ru
      ? '<h2>Гарантия</h2><ul><li>Дроны — <strong>12 месяцев</strong>.</li><li>Аксессуары, батареи — <strong>6 месяцев</strong>.</li><li>Гарантийный талон выдаётся вместе с товаром.</li></ul><h2>Что не покрывается</h2><ul><li>Механические повреждения при падении или столкновении.</li><li>Попадание воды в негерметичные модели.</li><li>Самостоятельный ремонт и вскрытие корпуса.</li><li>Естественный износ батареи (снижение ёмкости со временем).</li></ul><h2>Возврат</h2><p>Вернуть или обменять товар можно в течение <strong>14 дней</strong> при сохранении товарного вида, комплектности и упаковки. Товары, привезённые под индивидуальный заказ, возврату не подлежат, если не имеют дефекта.</p><h2>Как оформить</h2><ol><li>Напишите в Telegram или позвоните нам.</li><li>Опишите проблему, приложите фото или видео.</li><li>Мы согласуем замену, ремонт или возврат средств.</li></ol>'
      : "<h2>Kafolat</h2><ul><li>Dronlar — <strong>12 oy</strong>.</li><li>Aksessuar va batareyalar — <strong>6 oy</strong>.</li><li>Kafolat taloni mahsulot bilan birga beriladi.</li></ul><h2>Kafolat qamrab olmaydigan holatlar</h2><ul><li>Urilib tushish yoki to'qnashuv natijasidagi mexanik shikast.</li><li>Germetik bo'lmagan modellarga suv kirishi.</li><li>Mustaqil ta'mirlash va korpusni ochish.</li><li>Batareyaning tabiiy eskirishi (sig'imning vaqt o'tishi bilan kamayishi).</li></ul><h2>Qaytarish</h2><p>Tovar ko'rinishi, to'liq to'plami va qadog'i saqlangan holda <strong>14 kun</strong> ichida qaytarish yoki almashtirish mumkin. Individual buyurtma asosida keltirilgan mahsulotlar nuqsoni bo'lmasa qaytarilmaydi.</p><h2>Qanday rasmiylashtiriladi</h2><ol><li>Telegram orqali yozing yoki qo'ng'iroq qiling.</li><li>Muammoni tasvirlang, foto yoki video biriktiring.</li><li>Almashtirish, ta'mirlash yoki pulni qaytarishni kelishamiz.</li></ol>");

    if (name === 'about') return page(t('fAboutUs'), ru
      ? '<p>MyDrone — семейный бизнес из Ташкента. Мы привозим дроны и технологичные гаджеты напрямую из Китая (AliExpress, Alibaba, 1688) и продаём в Узбекистане без лишних посреднических наценок.</p><h2>Как мы работаем</h2><ol><li>Отбираем поставщика по рейтингу и отзывам, проверяем партию.</li><li>Консолидируем груз на своём складе в Гуанчжоу.</li><li>Везём в Ташкент и проходим таможенное оформление.</li><li>Выдаём гарантийный талон и помогаем с настройкой.</li></ol><h2>Почему нам доверяют</h2><ul><li>Каждый заказ отслеживается в личном кабинете.</li><li>Отвечаем в Telegram в рабочее время в течение 15 минут.</li><li>Помогаем с запчастями даже после окончания гарантии.</li></ul><h2>Планы</h2><p>Начали с дронов, дальше — камеры, умные гаджеты, робототехника и электротранспорт. Каталог расширяется постоянно.</p>'
      : "<p>MyDrone — Toshkentdagi oilaviy biznes. Biz dron va texnologik gadjetlarni to'g'ridan-to'g'ri Xitoydan (AliExpress, Alibaba, 1688) olib kelib, O'zbekistonda ortiqcha vositachi ustamasiz sotamiz.</p><h2>Qanday ishlaymiz</h2><ol><li>Yetkazib beruvchini reyting va sharhlar bo'yicha tanlaymiz, partiyani tekshiramiz.</li><li>Yukni Guanchjoudagi o'z omborimizda birlashtiramiz.</li><li>Toshkentga olib kelib, bojxona rasmiylashtiruvidan o'tkazamiz.</li><li>Kafolat talonini beramiz va sozlashda yordam beramiz.</li></ol><h2>Nega bizga ishonishadi</h2><ul><li>Har bir buyurtma shaxsiy kabinetda kuzatiladi.</li><li>Ish vaqtida Telegramda 15 daqiqa ichida javob beramiz.</li><li>Kafolat tugagandan keyin ham ehtiyot qism topishda yordam beramiz.</li></ul><h2>Rejalar</h2><p>Dronlardan boshladik, keyingisi — kameralar, aqlli gadjetlar, robotexnika va elektro-transport. Katalog doimiy kengayib boradi.</p>");

    if (name === 'referral') return '<section><div class="wrap">' +
      '<div class="banner" style="margin-bottom:26px"><div style="flex:1;min-width:260px">' +
      '<h3 style="font-size:24px">' + t('fRef') + '</h3><p>' + t('refHow') + '</p></div>' +
      '<a class="btn btn-p" href="' + (S.user ? '/kabinet/referal' : '/kirish') + '">' +
      (S.user ? t('yourRefLink') : t('signup')) + '</a></div>' +
      '<div class="grid g-3">' +
      [[ru ? 'Поделитесь ссылкой' : 'Havolani ulashing', ru ? 'В личном кабинете есть персональная ссылка и код. Отправьте её другу в Telegram или соцсети.' : "Shaxsiy kabinetda individual havola va kod bor. Uni do'stingizga Telegram yoki ijtimoiy tarmoqda yuboring."],
       [ru ? 'Друг получает скидку' : "Do'st chegirma oladi", ru ? 'При регистрации по вашей ссылке друг получает ' + money(st.refBonusNew) + ' сум скидки на первый заказ.' : "Havola orqali ro'yxatdan o'tgan do'st birinchi buyurtmaga " + money(st.refBonusNew) + " so'm chegirma oladi."],
       [ru ? 'Вы получаете бонусы' : 'Siz bonus olasiz', ru ? 'С каждого заказа приглашённого вам начисляется ' + st.refPercent + '% бонусами. Баллы тратятся при оплате.' : "Taklif qilganingizning har bir buyurtmasidan sizga " + st.refPercent + "% bonus yoziladi. Ballar to'lovda ishlatiladi."]]
        .map((x, i) => '<div class="card"><span class="av" style="margin-bottom:12px">' + (i + 1) + '</span><h3 style="font-size:17px;margin-bottom:8px">' + x[0] + '</h3><p class="mut sm" style="margin:0">' + x[1] + '</p></div>').join('') +
      '</div>' +
      '<div class="prose" style="margin-top:30px"><h2>' + (ru ? 'Условия' : 'Shartlar') + '</h2><ul>' +
      (ru ? '<li>Бонусные баллы начисляются после того, как заказ приглашённого получил статус «Доставлен».</li><li>1 балл = 1 сум, баллами можно оплатить до 100% стоимости товаров (кроме доставки).</li><li>Баллы не выводятся наличными.</li><li>Самоприглашение и создание фиктивных аккаунтов ведёт к аннулированию баллов.</li>'
        : "<li>Bonus ballar taklif qilingan foydalanuvchining buyurtmasi \"Yetkazildi\" statusiga o'tgach yoziladi.</li><li>1 ball = 1 so'm, ballar bilan mahsulot qiymatining 100% gacha qismini to'lash mumkin (yetkazib berish bundan mustasno).</li><li>Ballar naqd pulga aylantirilmaydi.</li><li>O'zini o'zi taklif qilish va soxta akkaunt yaratish ballarning bekor qilinishiga olib keladi.</li>") +
      '</ul></div></div></section>';

    if (name === 'contact') return '<section><div class="wrap"><div class="sec-hd"><h2>' + t('fContact') + '</h2></div>' +
      '<div class="grid g-2">' +
      '<div class="card">' +
      '<div class="usp">' + ic.phone + '<div><b>' + st.phone + '</b><div class="mut sm">' + st.phone2 + '</div></div></div>' +
      '<div class="usp">' + ic.tg + '<div><b>@' + st.telegram + '</b><div class="mut sm">Telegram</div></div></div>' +
      '<div class="usp">' + ic.card + '<div><b>' + st.email + '</b><div class="mut sm">Email</div></div></div>' +
      '<div class="usp">' + ic.truck + '<div><b>' + esc(L(st, 'address')) + '</b><div class="mut sm">' + esc(L(st, 'workhours')) + '</div></div></div>' +
      '<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">' +
      '<a class="btn btn-p btn-sm" href="https://t.me/' + st.telegram + '" target="_blank" rel="noopener">' + ic.tg + t('writeTg') + '</a>' +
      '<a class="btn btn-g btn-sm" href="tel:' + st.phone.replace(/\s/g, '') + '">' + ic.phone + (ru ? 'Позвонить' : 'Qo\'ng\'iroq') + '</a></div></div>' +
      '<form class="card" id="fcontact"><h3 style="font-size:17px;margin-bottom:14px">' + t('contactUs') + '</h3>' +
      fld('name', t('name'), '', 'text', true) + fld('phone', t('phone'), '+998 ', 'tel', true) +
      '<div class="field"><label>' + t('msg') + '</label><textarea name="msg"></textarea></div>' +
      '<button class="btn btn-p btn-block" type="submit">' + t('send') + '</button></form>' +
      '</div></div></section>';

    if (name === 'faq') return '<section><div class="wrap" style="max-width:860px"><div class="sec-hd"><h2>' + t('fFaq') + '</h2></div>' +
      S.db.faq.map(f => '<details class="faq-i"><summary>' + esc(L(f, 'q')) + '</summary><p>' + esc(L(f, 'a')) + '</p></details>').join('') +
      '<div class="banner" style="margin-top:26px"><div style="flex:1;min-width:240px"><h3>' + (ru ? 'Не нашли ответ?' : 'Javob topolmadingizmi?') + '</h3>' +
      '<p>' + (ru ? 'Напишите в Telegram — ответим в течение 15 минут в рабочее время.' : "Telegramda yozing — ish vaqtida 15 daqiqa ichida javob beramiz.") + '</p></div>' +
      '<a class="btn btn-p" href="https://t.me/' + st.telegram + '" target="_blank" rel="noopener">' + t('writeTg') + '</a></div></div></section>';

    return page(t('nothing'), '');
  }

  function viewBlog() {
    return '<section><div class="wrap"><div class="sec-hd"><div><h2>' + t('fBlog') + '</h2><p>' + t('secBlogS') + '</p></div></div>' +
      '<div class="grid g-3">' + S.db.posts.map(postCard).join('') + '</div></div></section>';
  }
  function viewPost(slug) {
    const p = S.post(slug);
    if (!p) return '<div class="wrap"><div class="empty">' + ic.empty + '<h3>' + t('nothing') + '</h3></div></div>';
    return crumbs([{ label: t('home'), href: '/' }, { label: t('fBlog'), href: '/blog' }, { label: L(p, 'title') }]) +
      '<section style="padding-top:18px"><div class="wrap" style="max-width:820px">' +
      '<span class="pc-cat">' + esc(L(p, 'cat')) + ' · ' + t('published') + ' ' + p.date + '</span>' +
      '<h1 style="font-size:clamp(24px,4vw,36px);margin:10px 0 18px">' + esc(L(p, 'title')) + '</h1>' +
      '<img src="' + IMG(p.img) + '" style="border-radius:var(--r-lg);aspect-ratio:16/8;object-fit:cover;width:100%" alt="">' +
      '<div class="prose" style="margin-top:24px"><p style="font-size:17px;color:var(--txt)">' + esc(L(p, 'lead')) + '</p>' + L(p, 'body') + '</div>' +
      '<div class="banner" style="margin-top:32px"><div style="flex:1;min-width:240px"><h3>' + (S.lang === 'ru' ? 'Нужна консультация?' : 'Konsultatsiya kerakmi?') + '</h3>' +
      '<p>' + (S.lang === 'ru' ? 'Поможем подобрать модель под ваш бюджет и задачи.' : "Byudjetingiz va vazifangizga mos modelni tanlashda yordam beramiz.") + '</p></div>' +
      '<button class="btn btn-p" data-act="callback">' + t('callback') + '</button></div>' +
      '<div class="sec-hd" style="margin-top:40px"><h2 style="font-size:22px">' + t('secBlog') + '</h2></div>' +
      '<div class="grid g-2">' + S.db.posts.filter(x => x.id !== p.id).slice(0, 2).map(postCard).join('') + '</div>' +
      '</div></section>';
  }


  /* ---------- SEO: har bir sahifa uchun meta ma'lumot ---------- */
  function headTag(sel, make) {
    let el = document.head.querySelector(sel);
    if (!el) { el = make(); document.head.appendChild(el); }
    return el;
  }
  function setMeta(m) {
    const url = location.origin + location.pathname + (location.search || '');
    const img = location.origin + '/' + (m.img || 'assets/img/hero-2.jpg');
    document.title = m.title;
    headTag('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' })).setAttribute('content', m.desc);
    headTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' })).setAttribute('href', url);
    [['og:title', m.title], ['og:description', m.desc], ['og:url', url], ['og:image', img],
     ['og:type', m.type || 'website']].forEach(([prop, val]) => {
      headTag('meta[property="' + prop + '"]', () => { const e = document.createElement('meta'); e.setAttribute('property', prop); return e; })
        .setAttribute('content', val);
    });
    headTag('meta[property="og:locale"]', () => { const e = document.createElement('meta'); e.setAttribute('property', 'og:locale'); return e; })
      .setAttribute('content', S.lang === 'ru' ? 'ru_RU' : 'uz_UZ');
    headTag('meta[name="robots"]', () => Object.assign(document.createElement('meta'), { name: 'robots' }))
      .setAttribute('content', m.noindex ? 'noindex,nofollow' : 'index,follow');
    const old = document.getElementById('ld-page');
    if (old) old.remove();
    if (m.ld) {
      const sc = document.createElement('script');
      sc.type = 'application/ld+json'; sc.id = 'ld-page';
      sc.textContent = JSON.stringify(m.ld);
      document.head.appendChild(sc);
    }
  }

  /* Sahifaga qarab meta ma'lumotni hisoblash */
  function metaFor(p0, parts, q) {
    const ru = S.lang === 'ru', B = 'MyDrone.uz';
    const baseDesc = ru
      ? 'Дроны, FPV, агродроны, экшн-камеры и умные гаджеты напрямую из Китая. Официальная гарантия, доставка по Узбекистану, оплата Click/Payme.'
      : "Dronlar, FPV, agrodronlar, action-kameralar va aqlli gadjetlar — to'g'ridan-to'g'ri Xitoydan. Rasmiy kafolat, O'zbekiston bo'ylab yetkazib berish, Click/Payme orqali to'lov.";

    if (p0 === 'mahsulot') {
      const pr = S.bySlug(parts[1]);
      if (pr) return {
        title: L(pr, 'name') + ' — ' + (ru ? 'цена и характеристики' : 'narxi va xususiyatlari') + ' | ' + B,
        desc: L(pr, 'short') + ' ' + money(pr.price) + ' ' + t('currency') + '.',
        img: 'assets/img/' + pr.imgs[0], type: 'product',
        ld: {
          '@context': 'https://schema.org', '@type': 'Product',
          name: L(pr, 'name'), sku: pr.id,
          description: L(pr, 'short'),
          image: pr.imgs.map(i => location.origin + '/assets/img/' + i),
          brand: { '@type': 'Brand', name: pr.brand },
          offers: {
            '@type': 'Offer', url: location.origin + location.pathname,
            priceCurrency: 'UZS', price: pr.price,
            availability: pr.stock === 'in' ? 'https://schema.org/InStock'
              : pr.stock === 'pre' ? 'https://schema.org/PreOrder' : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: B }
          }
        }
      };
    }
    if (p0 === 'katalog') {
      const c = q.cat ? S.category(q.cat) : null;
      const n = S.db.products.filter(x => !q.cat || x.cat === q.cat).length;
      const nm = c ? L(c, 'name') : t('catalog');
      return { title: nm + ' — ' + (ru ? 'купить в Ташкенте' : 'Toshkentda sotib olish') + ' | ' + B,
        desc: nm + ': ' + n + (ru ? ' товаров с официальной гарантией. ' : ' ta mahsulot, rasmiy kafolat bilan. ') + baseDesc,
        img: c ? 'assets/img/' + c.img : null };
    }
    if (p0 === 'blog' && parts[1]) {
      const b = S.post(parts[1]);
      if (b) return { title: L(b, 'title') + ' | ' + B + ' blog', desc: L(b, 'lead'),
        img: 'assets/img/' + b.img, type: 'article' };
    }
    const titles = {
      '': (ru ? 'MyDrone.uz — импорт дронов и техники из Китая | Ташкент'
              : "MyDrone.uz — Xitoydan dron va texnika importi | Toshkent"),
      'blog': t('fBlog') + ' — ' + B,
      'savollar': t('fFaq') + ' — ' + B,
      'referal-dastur': t('fRef') + ' — ' + B,
      'yetkazib-berish': t('fDelivery') + ' — ' + B,
      'kafolat': t('fWarranty') + ' — ' + B,
      'biz-haqimizda': t('fAboutUs') + ' — ' + B,
      'aloqa': t('fContact') + ' — ' + B,
      'savat': t('cart') + ' — ' + B,
      'buyurtma': t('checkout') + ' — ' + B,
      'kabinet': t('account') + ' — ' + B,
      'kirish': t('signin') + ' — ' + B
    };
    if (p0 === 'buyurtma' && parts[1]) {
      return { title: t('orderOk') + ' ' + parts[1] + ' — ' + B, desc: t('orderOkS'), noindex: true };
    }
    const priv = ['savat', 'buyurtma', 'kabinet', 'kirish'].includes(p0);
    /* noma'lum manzil (404) ham indekslanmasin — "soft 404" bo'lmasligi uchun */
    return { title: titles[p0] || (t('nothing') + ' — ' + B), desc: baseDesc, noindex: priv || !titles[p0] };
  }

  /* ---------- Router ---------- */
  let accOrders = [];          // kabinetdagi buyurtmalar (serverdan)
  let lastOrder = null;        // "buyurtma qabul qilindi" sahifasi uchun

  async function route() {
    const { parts, q } = parseRoute();
    if (q.ref) { sessionStorage.setItem('dm_ref_code', q.ref); }
    const main = $('#app');
    const p0 = parts[0] || '';
    /* uz manzil → ichki sahifa nomi */
    const STATIC = { 'yetkazib-berish': 'delivery', 'kafolat': 'warranty', 'biz-haqimizda': 'about',
      'aloqa': 'contact', 'savollar': 'faq', 'referal-dastur': 'referral' };
    const ACC = { 'buyurtmalar': 'orders', 'referal': 'ref', 'saqlanganlar': 'favs', 'profil': 'profile' };

    /* Serverdan qo'shimcha ma'lumot kerak bo'lgan sahifalar */
    if (p0 === 'mahsulot' && parts[1]) { await S.ensureProduct(parts[1]); }
    if (p0 === 'buyurtma' && parts[1]) { lastOrder = await S.orderById(parts[1]); }
    if (p0 === 'kabinet' && S.user && (ACC[parts[1]] || 'orders') === 'orders') {
      try { accOrders = await S.myOrders(); } catch (e) { accOrders = []; }
    }

    let html = '';
    if (!p0) html = viewHome();
    else if (p0 === 'katalog') html = viewCatalog(q);
    else if (p0 === 'mahsulot') html = viewProduct(parts[1]);
    else if (p0 === 'savat') html = viewCart();
    else if (p0 === 'buyurtma') html = parts[1] ? viewOrderOk(parts[1]) : viewCheckout();
    else if (p0 === 'kabinet') html = viewAccount(ACC[parts[1]] || 'orders');
    else if (p0 === 'kirish') html = viewLogin();
    else if (p0 === 'blog') html = parts[1] ? viewPost(parts[1]) : viewBlog();
    else if (STATIC[p0]) html = viewStatic(STATIC[p0]);
    else html = '<div class="wrap"><div class="empty" style="padding:80px 20px">' + ic.empty +
      '<h3>404 — ' + t('nothing') + '</h3><a class="btn btn-p btn-sm" style="margin-top:14px" href="/">' + t('home') + '</a></div></div>';

    main.innerHTML = html;
    setMeta(metaFor(p0, parts, q));
    renderHeader();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    afterRender();
    $$('nav.cats a').forEach(a => { if (a.getAttribute('href') === '/katalog?cat=' + (q.cat || '')) a.classList.add('on'); });
  }

  /* ---------- Render'dan keyingi bog'lanishlar ---------- */
  function afterRender() {
    /* qidiruv */
    const qi = $('#q');
    if (qi) {
      qi.addEventListener('input', () => {
        const res = S.search(qi.value);
        const box = $('#ac');
        if (!qi.value.trim() || !res.length) { box.innerHTML = ''; box.className = ''; return; }
        box.className = 'ac';
        box.innerHTML = res.map(p => '<a href="/mahsulot/' + p.slug + '"><img src="' + IMG(p.imgs[0]) + '">' +
          '<span style="flex:1"><b class="sm">' + esc(L(p, 'name')) + '</b><br><span class="mut xs">' + money(p.price) + ' ' + t('currency') + '</span></span></a>').join('');
      });
      qi.addEventListener('keydown', e => {
        if (e.key === 'Enter') { go('/katalog?q=' + encodeURIComponent(qi.value)); $('#ac').innerHTML = ''; qi.blur(); }
      });
      qi.addEventListener('blur', () => setTimeout(() => { const b = $('#ac'); if (b) { b.innerHTML = ''; b.className = ''; } }, 200));
    }

    /* katalog filtrlari */
    $$('input[name="fcat"]').forEach(r => r.addEventListener('change', () => setQ({ cat: r.value, sub: '' })));
    $$('input[name="fsub"]').forEach(r => r.addEventListener('change', () => setQ({ sub: r.value })));
    $$('input[name="fbrand"]').forEach(r => r.addEventListener('change', () =>
      setQ({ brand: $$('input[name="fbrand"]:checked').map(x => x.value).join(',') })));
    $$('input[name="fstock"]').forEach(r => r.addEventListener('change', () =>
      setQ({ stock: $$('input[name="fstock"]:checked').map(x => x.value).join(',') })));
    const fs = $('#fsort'); if (fs) fs.addEventListener('change', () => setQ({ sort: fs.value }));

    /* mahsulot tablari */
    $$('#ptabs button').forEach(b => b.addEventListener('click', () => {
      $$('#ptabs button').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      $$('.tabbody').forEach(x => x.classList.add('hidden'));
      $('#tab-' + b.dataset.tab).classList.remove('hidden');
    }));

    /* checkout */
    const co = $('#co');
    if (co) {
      co.addEventListener('change', () => {
        $$('.opt').forEach(o => o.classList.toggle('on', $('input', o).checked));
        const dlv = $('input[name="dlv"]:checked').value;
        $('#addrbox').style.display = dlv === 'pickup' ? 'none' : '';
        const tot = calcTotals(dlv, promoApplied, bonusApplied);
        $('#dlvsum').textContent = tot.delivery ? money(tot.delivery) : t('free');
        $('#totsum').textContent = money(tot.total) + ' ' + t('currency');
      });
      co.addEventListener('submit', e => { e.preventDefault(); submitOrder(co); });
    }

    /* auth */
    $$('[data-auth]').forEach(b => b.addEventListener('click', () => {
      $$('[data-auth]').forEach(x => x.classList.remove('on')); b.classList.add('on');
      $('#fin').classList.toggle('hidden', b.dataset.auth !== 'in');
      $('#fup').classList.toggle('hidden', b.dataset.auth !== 'up');
    }));
    const fin = $('#fin');
    if (fin) fin.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = $('button[type=submit]', fin); btn.disabled = true;
      const d = Object.fromEntries(new FormData(fin));
      const u = await S.login(d.email, d.pass);
      btn.disabled = false;
      if (!u) { toast(t('badLogin'), 'err'); return; }
      toast(t('welcome') + ', ' + esc(u.name) + '!', 'ok'); go('/kabinet/buyurtmalar');
    });
    const fup = $('#fup');
    if (fup) fup.addEventListener('submit', async e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(fup));
      if (!d.name || !d.email || !d.pass) { toast(t('reqField'), 'err'); return; }
      const btn = $('button[type=submit]', fup); btn.disabled = true;
      const r = await S.register(d.name, d.email, d.pass, d.phone, d.ref);
      btn.disabled = false;
      if (r.err) { toast(r.err === 'exists' ? t('exists') : r.err, 'err'); return; }
      if (d.ref) toast(t('refApplied'), 'ok');
      toast(t('welcome') + ', ' + esc(r.user.name) + '!', 'ok'); go('/kabinet/referal');
    });

    /* profil */
    const pf = $('#pform');
    if (pf) pf.addEventListener('submit', async e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(pf));
      try {
        await S.updateProfile({ name: d.name, phone: d.phone, email: d.email });
        toast(t('saved'), 'ok'); route();
      } catch (err) { toast(err.message, 'err'); }
    });

    /* aloqa formasi */
    const fc = $('#fcontact');
    if (fc) fc.addEventListener('submit', async e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(fc));
      if (!d.name || !d.phone) { toast(t('reqField'), 'err'); return; }
      try { await S.sendLead({ ...d, type: 'contact' }); fc.reset(); toast(t('sent'), 'ok'); }
      catch (err) { toast(err.message, 'err'); }
    });

    /* bonus checkbox */
    const ub = $('#usebonus');
    if (ub) ub.addEventListener('change', () => { bonusApplied = ub.checked ? (S.user.bonus || 0) : 0; route(); });
  }

  function setQ(patch) {
    const { q } = parseRoute();
    const next = { ...q, ...patch };
    Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
    go('/katalog' + (Object.keys(next).length ? '?' + new URLSearchParams(next) : ''));
  }

  /* ---------- Buyurtmani yuborish ---------- */
  async function submitOrder(form) {
    const d = Object.fromEntries(new FormData(form));
    let ok = true;
    $$('.field', form).forEach(f => f.classList.remove('bad'));
    const need = d.dlv === 'pickup' ? ['name', 'phone'] : ['name', 'phone', 'city', 'addr'];
    need.forEach(k => {
      if (!String(d[k] || '').trim() || (k === 'phone' && d[k].replace(/\D/g, '').length < 12)) {
        const f = $('.field[data-f="' + k + '"]', form);
        if (f) { f.classList.add('bad'); if (k === 'phone' && d[k]) $('.err', f).textContent = t('badPhone'); }
        ok = false;
      }
    });
    if (!ok) { toast(t('reqField'), 'err'); const b = $('.field.bad', form); if (b) b.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

    const tot = calcTotals(d.dlv, promoApplied, bonusApplied);
    const btn = $('button[type=submit]', form);
    if (btn) { btn.disabled = true; btn.textContent = '...'; }
    let order;
    try {
      order = await S.placeOrder({
        name: d.name, phone: d.phone, email: d.email || '', region: d.dlv === 'pickup' ? (S.lang === 'ru' ? 'Самовывоз' : "O'zi olib ketish") : d.region,
        city: d.city || '', addr: d.addr || '', note: d.note || '', pay: d.pay, dlv: d.dlv,
        goods: tot.goods, delivery: tot.delivery, discount: tot.discount, bonusUsed: tot.bonusUsed, total: tot.total,
        promo: promoApplied ? promoApplied.code : ''
      });
    } catch (err) {
      if (btn) { btn.disabled = false; btn.textContent = t('confirmOrder'); }
      toast(err.message, 'err');
      return;
    }
    promoApplied = null; bonusApplied = 0;
    toast((S.lang === 'ru' ? 'SMS с подтверждением отправлен на ' : 'Tasdiqlash SMS yuborildi: ') + esc(d.phone), 'ok');
    go('/buyurtma/' + order.id);
  }

  /* ---------- Global klik hodisalari ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act, id = el.dataset.id;

    if (act === 'add' || act === 'buy') {
      const qty = $('#pqty') ? Math.max(1, +$('#pqty').value || 1) : 1;
      S.addToCart(id, act === 'buy' ? qty : (el.dataset.qty ? qty : 1));
      renderHeader();
      if (act === 'buy') { go('/savat'); return; }
      toast(ic.check + ' ' + t('addedCart'), 'ok');
      if ($('#pqty')) { const b = el; b.innerHTML = ic.cart + t('inCart'); }
    }
    else if (act === 'fav') {
      const on = S.toggleFav(id);
      el.classList.toggle('on', on);
      toast(on ? (S.lang === 'ru' ? 'Добавлено в избранное' : "Saqlanganlarga qo'shildi") : (S.lang === 'ru' ? 'Убрано из избранного' : 'Saqlanganlardan olib tashlandi'));
    }
    else if (act === 'rm') { S.removeFromCart(id); route(); }
    else if (act === 'cq+') { const r = S.cart.find(x => x.id === id); S.setQty(id, r.qty + 1); route(); }
    else if (act === 'cq-') { const r = S.cart.find(x => x.id === id); if (r.qty > 1) { S.setQty(id, r.qty - 1); route(); } }
    else if (act === 'q+') { const i = $('#pqty'); i.value = Math.min(99, (+i.value || 1) + 1); }
    else if (act === 'q-') { const i = $('#pqty'); i.value = Math.max(1, (+i.value || 1) - 1); }
    else if (act === 'gal') { $('#gmain').src = el.src; $$('.gal-thumbs img').forEach(x => x.classList.remove('on')); el.classList.add('on'); }
    else if (act === 'ftoggle') { $('#filters').classList.toggle('open'); }
    else if (act === 'freset') { go('/katalog'); }
    else if (act === 'fprice') { setQ({ min: $('#fmin').value, max: $('#fmax').value }); }
    else if (act === 'promo') {
      const code = String($('#promo').value || '').trim().toUpperCase();
      if (!code) return;
      S.checkPromo(code).then(p => {
        if (!p) { promoApplied = null; toast(t('promoBad'), 'err'); return; }
        promoApplied = p; toast(t('promoOk') + ': ' + esc(L(p, 'note')), 'ok'); route();
      });
    }
    else if (act === 'copyref') {
      const i = $('#reflink'); i.select();
      navigator.clipboard ? navigator.clipboard.writeText(i.value).then(() => toast(t('linkCopied'), 'ok')) : (document.execCommand('copy'), toast(t('linkCopied'), 'ok'));
    }
    else if (act === 'share') {
      const url = location.href;
      if (navigator.share) { navigator.share({ url }).catch(() => {}); }
      else if (navigator.clipboard) { navigator.clipboard.writeText(url).then(() => toast(t('linkCopied'), 'ok')); }
    }
    else if (act === 'logout') {
      S.logout().then(() => { toast(S.lang === 'ru' ? 'Вы вышли' : 'Tizimdan chiqdingiz'); go('/'); });
    }
    else if (act === 'close-modal') closeModal();
    else if (act === 'callback') openCallback();
    else if (act === 'addrev') openReview(id);
  });

  /* ---------- Modallar ---------- */
  function openCallback() {
    modal(t('callback'),
      '<p class="mut sm" style="margin-top:0">' + t('callbackS') + '</p><form id="fcb">' +
      fld('name', t('name'), S.user ? S.user.name : '', 'text', true) +
      fld('phone', t('phone'), S.user ? S.user.phone : '+998 ', 'tel', true) +
      '<button class="btn btn-p btn-block" type="submit">' + t('send') + '</button></form>',
      m => $('#fcb', m).addEventListener('submit', async e => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        if (!d.name || d.phone.replace(/\D/g, '').length < 12) { toast(t('badPhone'), 'err'); return; }
        try { await S.sendLead({ ...d, type: 'callback' }); closeModal(); toast(t('sent'), 'ok'); }
        catch (err) { toast(err.message, 'err'); }
      }));
  }

  function openReview(pid) {
    if (!S.user) { toast(t('needLogin'), 'err'); go('/kirish'); return; }
    modal(S.lang === 'ru' ? 'Оставить отзыв' : 'Sharh qoldirish',
      '<form id="frev"><div class="field"><label>' + (S.lang === 'ru' ? 'Оценка' : 'Baho') + '</label>' +
      '<select name="rate">' + [5, 4, 3, 2, 1].map(n => '<option value="' + n + '">' + '★'.repeat(n) + '</option>').join('') + '</select></div>' +
      '<div class="field"><label>' + (S.lang === 'ru' ? 'Текст отзыва' : 'Sharh matni') + '</label><textarea name="text" required></textarea></div>' +
      '<button class="btn btn-p btn-block" type="submit">' + t('send') + '</button></form>',
      m => $('#frev', m).addEventListener('submit', async e => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        try {
          const r = await S.addReview(pid, { name: S.user.name, rate: +d.rate, text: d.text });
          closeModal();
          toast(r.pending
            ? (S.lang === 'ru' ? 'Спасибо! Отзыв появится после проверки' : "Rahmat! Sharh tekshiruvdan so'ng chiqadi")
            : t('sent'), 'ok');
          route();
        } catch (err) { toast(err.message, 'err'); }
      }));
  }

  /* ---------- Mavzu almashtirish ---------- */
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-theme-toggle]')) return;
    S.toggleTheme();
    renderHeader();
    toast(S.effTheme() === 'dark' ? t('themeDark') : t('themeLight'));
  });

  /* ---------- Til almashtirish ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    S.setLang(b.dataset.lang);
    document.documentElement.lang = b.dataset.lang;
    renderHeader(); renderFooter(); route();
  });

  /* ---------- Suzuvchi tugmalar ---------- */
  function renderFloats() {
    const st = S.db.settings;
    const d = document.createElement('div');
    d.className = 'floats';
    d.innerHTML = '<button class="f-cb" data-act="callback" title="' + t('callback') + '">' + ic.phone + '</button>' +
      '<a class="f-wa" href="https://wa.me/' + st.whatsapp + '" target="_blank" rel="noopener" title="WhatsApp">' + ic.wa + '</a>' +
      '<a class="f-tg" href="https://t.me/' + st.telegram + '" target="_blank" rel="noopener" title="Telegram">' + ic.tg + '</a>';
    document.body.appendChild(d);
  }

  /* ---------- Eski #/ havolalarni yangi manzilga o'tkazish ---------- */
  (function migrateHash() {
    const h = location.hash;
    if (!h.startsWith('#/')) return;
    const map = { 'catalog': 'katalog', 'p': 'mahsulot', 'cart': 'savat', 'checkout': 'buyurtma',
      'ok': 'buyurtma', 'account': 'kabinet', 'login': 'kirish', 'faq': 'savollar',
      'referral': 'referal-dastur', 'delivery': 'yetkazib-berish', 'warranty': 'kafolat',
      'about': 'biz-haqimizda', 'contact': 'aloqa', 'blog': 'blog',
      'orders': 'buyurtmalar', 'ref': 'referal', 'favs': 'saqlanganlar', 'profile': 'profil' };
    const [path, qs] = h.slice(2).split('?');
    const parts = path.split('/').filter(Boolean).map(x => map[x] || x);
    history.replaceState({}, '', '/' + parts.join('/') + (qs ? '?' + qs : ''));
  })();

  /* ---------- Boot ---------- */
  document.documentElement.lang = S.lang;
  renderHeader(); renderFooter(); renderFloats();

  S.init().then(ok => {
    if (!ok) console.info('Demo rejim: ma\'lumotlar brauzerda saqlanadi');
    renderHeader(); renderFooter();
    route();
  });
})();

/* Liberty — vitrine estática v1. Sem tracking ou chamadas a serviços externos. */
(() => {
  'use strict';
  const body = document.body;
  const page = body.dataset.page || 'home';
  const root = body.dataset.root || '';
  const DATA_API = 'https://xtlubocepsbqanrjabog.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_nCf37VOBL3JpxzL-SxNXxQ_VuxlKyAV';
  const IMG_BASE = DATA_API + '/storage/v1/object/public/liberty-product-images/';

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  if (menu && nav) {
    const closeMenu = () => {
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menu');
      nav.classList.remove('is-open');
    };
    menu.addEventListener('click', () => {
      const opened = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(opened));
      menu.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('is-open', opened);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  if (page !== 'achadinhos' && page !== 'lives') return;

  const acceptedCategories = new Set(['todos', 'beleza', 'casa', 'tech', 'estilo']);
  const categoryLabels = {
    beleza: 'Beleza & autocuidado', casa: 'Casa & praticidade',
    tech: 'Tecnologia & acessórios', estilo: 'Estilo & tendências'
  };

  function marketplaceLink(value) {
    try {
      const url = new URL(value);
      // Publicação apenas de URLs HTTPS, sem HTML ou protocolos executáveis.
      return url.protocol === 'https:' ? url.href : null;
    } catch (_) { return null; }
  }

  function imageLink(value) {
    if (typeof value !== 'string') return null;
    // Aceita imagens locais relativas para impedir a inclusão inadvertida
    // de pixels de rastreamento externos na vitrine inicial.
    if (value.startsWith(IMG_BASE) && /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(value.slice(IMG_BASE.length))) return value;
    if (!/^assets\/media\/[a-z0-9_.-]+\.(jpg|jpeg|png|webp|svg)$/i.test(value)) return null;
    return root + value;
  }

  function make(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined && text !== null) el.textContent = String(text);
    if (className) el.className = className;
    return el;
  }

  function buildProduct(item) {
    const url = marketplaceLink(item.affiliate_url);
    if (!url || item.published !== true || !item.title || !categoryLabels[item.category]) return null;
    const card = make('article', null, 'product-card');
    const media = make('div', null, 'product-card__media');
    const image = imageLink(item.image);
    if (image) {
      const photo = document.createElement('img');
      photo.src = image;
      photo.alt = '';
      photo.loading = 'lazy';
      media.append(photo);
    } else media.append(make('span', '✧', 'product-card__fallback'));
    const content = make('div', null, 'product-card__body');
    content.append(make('span', categoryLabels[item.category], 'product-card__tag'));
    content.append(make('h3', item.title));
    if (item.platform) content.append(make('p', `Disponível em ${item.platform}`));
    const link = make('a', 'Ver na loja ↗');
    link.href = url;
    link.target = '_blank';
    link.rel = 'sponsored noopener noreferrer';
    link.setAttribute('aria-label', `Ver ${item.title} na loja parceira`);
    content.append(link);
    card.append(media, content);
    return card;
  }

  function buildLive(live) {
    if (live.published !== true || !live.title || typeof live.title !== 'string') return null;
    const card = make('article', null, 'live-card');
    card.append(make('span', 'CONTEÚDO / LIVE', 'eyebrow'));
    card.append(make('h3', live.title));
    if (live.date) card.append(make('p', live.date, 'live-card__date'));
    if (live.description) card.append(make('p', live.description));
    const link = marketplaceLink(live.url);
    if (link) {
      const anchor = make('a', 'Abrir conteúdo ↗', 'text-link');
      anchor.href = link;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      card.append(anchor);
    }
    return card;
  }

  function initCatalog(items) {
    const grid = document.getElementById('product-grid');
    const empty = document.getElementById('catalog-empty');
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const count = document.getElementById('catalog-count');
    const title = document.getElementById('catalog-empty-title');
    const text = document.getElementById('catalog-empty-message');
    const chips = [...document.querySelectorAll('.filter-chip')];
    if (!grid || !empty || !form || !input) return;
    const params = new URLSearchParams(location.search);
    let category = acceptedCategories.has(params.get('categoria')) ? params.get('categoria') : 'todos';
    let term = (params.get('q') || '').trim().slice(0, 120);
    input.value = term;

    const update = () => {
      grid.replaceChildren();
      chips.forEach(chip => {
        const active = chip.dataset.category === category;
        chip.classList.toggle('is-active', active);
        chip.setAttribute('aria-pressed', String(active));
      });
      const needle = term.toLocaleLowerCase('pt-BR');
      const matched = items.filter(item => (category === 'todos' || item.category === category) &&
        (!needle || (String(item.title || '') + ' ' + String(item.description || '')).toLocaleLowerCase('pt-BR').includes(needle)));
      let total = 0;
      matched.forEach(item => { const card = buildProduct(item); if (card) { grid.append(card); total++; } });
      if (count) count.textContent = total === 1 ? '1 indicação' : `${total} indicações`;
      empty.hidden = total > 0;
      if (!total && (term || category !== 'todos')) {
        title.textContent = 'Nenhum achado por aqui, ainda.';
        text.textContent = 'Não encontramos uma indicação publicada com esses filtros. Tente explorar outra categoria.';
      } else {
        title.textContent = 'As primeiras descobertas vêm aí.';
        text.textContent = 'A vitrine ainda não tem produtos publicados. Quando a curadoria estiver disponível, você encontrará os links aqui.';
      }
      const next = new URLSearchParams();
      if (category !== 'todos') next.set('categoria', category);
      if (term) next.set('q', term);
      history.replaceState(null, '', location.pathname + (next.toString() ? '?' + next.toString() : '') + location.hash);
    };
    chips.forEach(chip => chip.addEventListener('click', () => { category = chip.dataset.category; update(); }));
    form.addEventListener('submit', event => { event.preventDefault(); term = input.value.trim().slice(0, 120); update(); });
    update();
  }

  function initLives(lives) {
    const list = document.getElementById('live-list');
    const empty = document.getElementById('lives-empty');
    if (!list || !empty) return;
    list.replaceChildren();
    let count = 0;
    lives.forEach(item => { const card = buildLive(item); if (card) { list.append(card); count++; } });
    empty.hidden = count > 0;
  }

  // A vitrine lê produtos publicados do banco; lives legadas continuam no conteúdo estático.
  const contentRequest = page === 'achadinhos'
    ? fetch(DATA_API + '/rest/v1/liberty_products?select=id,title,description,category,platform,affiliate_url,image_path,published&published=eq.true&order=created_at.desc',
        {headers:{apikey:PUBLISHABLE_KEY},cache:'no-store'})
        .then(response => {if(!response.ok) throw new Error('Falha no catálogo'); return response.json();})
        .then(items => ({items:items.map(item => Object.assign({},item,{
          image:item.image_path && /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(item.image_path)
            ? IMG_BASE + encodeURIComponent(item.image_path) : null
        }))}))
    : fetch(root + 'data/content.json', { cache: 'no-store' })
        .then(response => { if (!response.ok) throw new Error('Falha nas lives'); return response.json(); });
  contentRequest
    .then(data => {
      if (page === 'achadinhos') initCatalog(Array.isArray(data.items) ? data.items : []);
      if (page === 'lives') initLives(Array.isArray(data.lives) ? data.lives : []);
    })
    .catch(() => {
      if (page === 'achadinhos') {
        const count = document.getElementById('catalog-count');
        if (count) count.textContent = 'Catálogo indisponível';
        document.getElementById('catalog-empty-message').textContent = 'Não foi possível carregar a vitrine neste momento. Recarregue a página mais tarde.';
      }
      if (page === 'lives') document.querySelector('#lives-empty p').textContent = 'Não foi possível carregar o conteúdo agora. Tente novamente mais tarde.';
    });
})();

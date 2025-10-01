(function productosPage() {

  if (!document.title.toLowerCase().includes('productos')) return;

  const CATEGORY_IDS = ['sangre', 'orina', 'otros', 'aparatologia'];

  const lists = $$('.prod-list');           
  const allCards = $$('.prod-card');
  const searchInput = $('#buscadorProductos');
  const quickBtns = $$('a.btn, a.btn-outline-primary, a.btn-primary')
    .filter(a => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('#') && CATEGORY_IDS.includes(href.slice(1));
    });
  const cardCat = new Map();
  allCards.forEach(card => {
    let cat = 'otros';
    let el = card;
    while (el && el.previousElementSibling == null) el = el.parentElement;
    let walker = card;
    while (walker) {
      if (walker.tagName === 'H2' && CATEGORY_IDS.includes(walker.id)) {
        cat = walker.id;
        break;
      }
      walker = walker.previousElementSibling || walker.parentElement;
      if (walker && walker.classList?.contains('container')) break;
    }
    if (!CATEGORY_IDS.includes(cat)) {
      const nearestH2 = card.closest('.container')?.querySelector('h2[id]');
      if (nearestH2 && CATEGORY_IDS.includes(nearestH2.id)) cat = nearestH2.id;
    }
    cardCat.set(card, cat);
  });

  let currentCategory = null;
  let currentQuery = '';

  function applyFilters() {
    const q = currentQuery.trim().toLowerCase();
    allCards.forEach(card => {
      const matchesCat = !currentCategory || cardCat.get(card) === currentCategory;
      const title = $('h3', card)?.textContent?.toLowerCase() || '';
      const tags  = (card.getAttribute('data-tags') || '').toLowerCase();
      const matchesText = q === '' || title.includes(q) || tags.includes(q);
      card.style.display = (matchesCat && matchesText) ? '' : 'none';
    });
  }

  quickBtns.forEach(btn => {
    const cat = btn.getAttribute('href').slice(1);
    btn.dataset.cat = cat;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentCategory === cat) {
        currentCategory = null; 
        setActiveBtn(null);
      } else {
        currentCategory = cat;
        setActiveBtn(cat);
      }
      if (searchInput) currentQuery = searchInput.value || '';
      applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  function setActiveBtn(cat) {
    quickBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.cat === cat);
    });
  }
  if (searchInput) {
    const handler = () => {
      currentQuery = searchInput.value || '';
      applyFilters();
    };
    searchInput.addEventListener('input', handler);
  }
  applyFilters();
  console.log('Productos.js: filtros activos ✔');
})();

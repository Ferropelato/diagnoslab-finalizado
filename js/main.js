window.ARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DiagnosLab: bienvenido');

    const nav = document.querySelector('.navbar');
    if (nav) {
        const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }
});

const SITE_NAME = 'DiagnosLab';
const VERSION = '1.0.0';
const LSK_CART = 'dlab_cart';
const LSK_NEWS = 'dlab_news_emails';
const LSK_WELCOME = 'dlab_welcome_shown';

let cart = [];
let newsletter = [];

const ARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function loadCart() {
    try {
        cart = JSON.parse(localStorage.getItem(LSK_CART) || '[]');
        if (!Array.isArray(cart)) cart = [];
    } catch { cart = []; }
}

function saveCart() {
    localStorage.setItem(LSK_CART, JSON.stringify(cart));
}

function loadNewsletter() {
    try {
        newsletter = JSON.parse(localStorage.getItem(LSK_NEWS) || '[]');
        if (!Array.isArray(newsletter)) newsletter = [];
    } catch { newsletter = []; }
}

function saveNewsletter() {
    localStorage.setItem(LSK_NEWS, JSON.stringify(newsletter));
}

function renderCartBadge() {
    const badge = $('#cartCount');
    if (!badge) return;
    const total = cart.reduce((acc, p) => acc + (p.qty || 0), 0);
    if (total > 0) {
        badge.textContent = total;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function normalizeId(text) {
    return (text || 'producto')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
}

function parsePriceFromCard(card) {
  if (!card) return 0;
  const raw = card.getAttribute('data-price') || '';
  const cleaned = raw.replace(/[^\d]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function parseProductCard(card) {
  const explicitId = card.getAttribute('data-id');
  const titleEl = card.querySelector('h3');
  const title = titleEl ? titleEl.textContent.trim() : 'Producto';
  const id = explicitId || normalizeId(title);
  const imgEl = card.querySelector('img');
  const img = imgEl ? imgEl.getAttribute('src') : '';
  const price = parsePriceFromCard(card);
  return { id, title, img, price };
}

function cartTotals() {
  const totalItems = cart.reduce((acc, p) => acc + (p.qty || 0), 0);
  const amount = cart.reduce((acc, p) => acc + (p.price || 0) * (p.qty || 0), 0);
  return { totalItems, amount };
}

function renderCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  const { totalItems } = cartTotals();
  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

function addToCart(item) {
  const i = cart.findIndex(p => p.id === item.id);
  if (i >= 0) {
    cart[i].qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart();
  renderCartBadge();
  window.renderCartUI && window.renderCartUI(); 
  alert(`✅ “${item.title}” agregado al carrito.`);
}

function removeFromCart(id) {
  const i = cart.findIndex(p => p.id === id);
  if (i >= 0) {
    cart.splice(i, 1);
    saveCart();
    renderCartBadge();
    window.renderCartUI && window.renderCartUI();
    alert('🗑️ Producto eliminado del carrito.');
  }
}

function clearCart() {
  if (cart.length === 0) return alert('El carrito ya está vacío.');
  const ok = confirm('¿Vaciar carrito por completo?');
  if (!ok) return;
  cart = [];
  saveCart();
  renderCartBadge();
  window.renderCartUI && window.renderCartUI();
  alert('🧹 Carrito vaciado.');
}

function subscribeEmail(email) {
    if (!email) return alert('Ingresá un email válido.');
    const exists = newsletter.includes(email.toLowerCase());
    if (exists) return alert('Este email ya está suscripto.');
    newsletter.push(email.toLowerCase());
    saveNewsletter();
    alert('📧 ¡Gracias por suscribirte! Revisá tu correo.');
}

function setupNavbarShadow() {
    const nav = $('.navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

function setupThemeToggle() {
    const btn = $('#themeToggle');
    if (!btn) return;
    if (!localStorage.getItem('theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
    applyTheme(localStorage.getItem('theme'));

    btn.addEventListener('click', () => {
        const next = (localStorage.getItem('theme') === 'dark') ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
    });
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

function bindAddButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add');
    if (!btn) return;
    const card = btn.closest('.prod-card');
    if (!card) return;
    const item = parseProductCard(card);
    addToCart(item);
  }, { passive: false });
}

    $$('.prod-card .btn').forEach(btn => {
        if (btn.dataset.bound) return;
        if (btn.textContent?.toLowerCase().includes('agreg')) {
            btn.dataset.bound = '1';
            btn.addEventListener('click', () => {
                const card = btn.closest('.prod-card');
                if (!card) return;
                addToCart(parseProductCard(card));
            });
        }
    });


function setupProductsSearch() {
    const input = $('#buscadorProductos');
    if (!input) return;
    const cards = $$('.prod-card');
    const filter = () => {
        const q = input.value.toLowerCase().trim();
        cards.forEach(card => {
            const tags = (card.getAttribute('data-tags') || '').toLowerCase();
            const title = $('h3', card)?.textContent?.toLowerCase() || '';
            card.style.display = (!q || tags.includes(q) || title.includes(q)) ? '' : 'none';
        });
    };
    input.addEventListener('input', filter);
}

function setupNewsletterForm() {
    const form = $('.home-news__form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]')?.value.trim();
        subscribeEmail(email);
        form.reset();
    });
}

function maybeWelcome() {
    if (localStorage.getItem(LSK_WELCOME) === '1') return;
    const nombre = prompt(`¡Bienvenido/a a ${SITE_NAME}! ¿Cómo te llamás? (opcional)`);
    if (nombre && nombre.trim().length > 0) {
        alert(`Hola, ${nombre.trim()} 👋\nSi necesitás ayuda, escribime desde "Contacto".`);
    } else {
        alert(`¡Bienvenido/a! Podés explorar productos y servicios.\nAbrí "Productos" y probá agregar items al carrito.`);
    }
    localStorage.setItem(LSK_WELCOME, '1');
}

function setupInViewAnimations() {
    const targets = $$('.prod-card, .serv-card, .home-ben, .home-cat');
    if (!targets.length) return;
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(ent => {
            if (ent.isIntersecting) {
                ent.target.classList.add('in-view');
                obs.unobserve(ent.target);
            }
        });
    }, { threshold: 0.15 });
    targets.forEach(t => io.observe(t));
}

function setupCartLink() {
    const link = $('#cartLink');
    if (!link) return;
    link.addEventListener('click', (e) => {
        if (e.shiftKey) {
            e.preventDefault();
            clearCart();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadNewsletter();

    setupNavbarShadow();
    setupThemeToggle();
    setupInViewAnimations();

    bindAddButtons();
    setupProductsSearch();
    setupNewsletterForm();
    setupCartLink();

    renderCartBadge();

    maybeWelcome();

    console.log(`${SITE_NAME} v${VERSION} — main.js listo ✔`);
});








(function cartOffcanvas() {
  const $ = (s, c = document) => c.querySelector(s);
  const listEl = $('#cartItems');
  const totalItemsEl = $('#cartTotalItems');
  const totalAmountEl = $('#cartTotalAmount');
  const clearBtn = $('#btnClearCart');
  const chkBtn = $('#btnCheckout');

  if (!listEl || !totalItemsEl || !totalAmountEl) return;

  function renderCartUI() {
    if (typeof cart === 'undefined') return;

    listEl.innerHTML = '';
    if (cart.length === 0) {
      listEl.innerHTML = `<li class="text-muted">Tu carrito está vacío</li>`;
      totalItemsEl.textContent = '0';
      totalAmountEl.textContent = ARS.format(0);
      return;
      let totalItems = 0;
      let totalAmount = 0;

      cart.forEach(item => {
        const qty = item.qty || 1;
        const price = item.price || 0;
        const sub = qty * price;
        totalItems += qty;
        totalAmount += sub;

      });

      document.getElementById('cartTotalItems').textContent = String(totalItems);
      document.getElementById('cartTotalAmount').textContent = window.ARS.format(totalAmount);
    }

    let totalItems = 0;
    let totalAmount = 0;

    cart.forEach(item => {
      const qty = item.qty || 1;
      const price = item.price || 0;
      const sub = qty * price;
      totalItems += qty;
      totalAmount += sub;

      const li = document.createElement('li');
      li.className = 'd-flex align-items-center gap-2 py-2 border-bottom';
      li.innerHTML = `
        <img src="${item.img || ''}" alt="" style="width:48px;height:48px;object-fit:contain;background:#fff;border-radius:8px;">
        <div class="flex-grow-1">
          <div class="fw-semibold">${item.title}</div>
          <div class="small text-muted">ID: ${item.id}</div>
          <div class="small">Precio: <strong>${ARS.format(price)}</strong> &middot; Subtotal: <strong>${ARS.format(sub)}</strong></div>
        </div>
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-outline-secondary" data-act="dec" data-id="${item.id}">−</button>
          <button class="btn btn-light" disabled>${qty}</button>
          <button class="btn btn-outline-secondary" data-act="inc" data-id="${item.id}">+</button>
        </div>
        <button class="btn btn-outline-danger btn-sm" data-act="del" data-id="${item.id}" title="Quitar">✕</button>
      `;
      listEl.appendChild(li);
    });

    totalItemsEl.textContent = String(totalItems);
    totalAmountEl.textContent = ARS.format(totalAmount);
    renderCartBadge && renderCartBadge();
  }

  window.renderCartUI = renderCartUI;

  listEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    const id = btn.dataset.id;

    const idx = cart.findIndex(p => p.id === id);
    if (idx < 0) return;

    if (act === 'inc') {
      cart[idx].qty += 1;
    } else if (act === 'dec') {
      cart[idx].qty = Math.max(1, (cart[idx].qty || 1) - 1);
    } else if (act === 'del') {
      cart.splice(idx, 1);
    }

    saveCart();
    renderCartUI();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const before = cart.length;
      clearCart();
      if (before !== cart.length) renderCartUI();
    });
  }

  if (chkBtn) {
    chkBtn.addEventListener('click', () => {
      if (!cart.length) return alert('El carrito está vacío.');
      const ok = confirm('¿Deseás finalizar la compra? Te contactaremos para coordinar.');
      if (!ok) return;
      alert('✅ ¡Gracias! Te contactaremos por email/WhatsApp.');
      cart = [];
      saveCart();
      renderCartUI();
    });
  }

  const off = document.getElementById('offcanvasCart');
  if (off) off.addEventListener('shown.bs.offcanvas', renderCartUI);

  renderCartUI();
})();
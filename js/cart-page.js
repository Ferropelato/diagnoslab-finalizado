(function cartPage() {
  const $ = (s,c=document)=>c.querySelector(s);

  const tbody = $('#cartTableBody');
  const totalItemsEl = $('#cartPageTotalItems');
  const totalAmountEl = $('#cartPageTotalAmount');
  const clearBtn = $('#cartPageClear');
  const chkBtn = $('#cartPageCheckout');

  if (!tbody) return;

  function renderCartPage() {
    if (!cart || !cart.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Tu carrito está vacío</td></tr>`;
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

document.getElementById('cartPageTotalItems').textContent  = String(totalItems);
document.getElementById('cartPageTotalAmount').textContent = window.ARS.format(totalAmount);
    }

    tbody.innerHTML = '';
    let totalItems = 0;
    let totalAmount = 0;

    cart.forEach(item => {
      const qty = item.qty || 1;
      const price = item.price || 0;
      const sub = qty * price;
      totalItems += qty;
      totalAmount += sub;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${item.img || ''}" alt="" style="width:48px;height:48px;object-fit:contain;background:#fff;border-radius:8px;">
            <div>
              <div class="fw-semibold">${item.title}</div>
              <div class="small text-muted">ID: ${item.id}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" data-act="dec" data-id="${item.id}">−</button>
            <button class="btn btn-light" disabled>${qty}</button>
            <button class="btn btn-outline-secondary" data-act="inc" data-id="${item.id}">+</button>
          </div>
        </td>
        <td>${ARS.format(price)}</td>
        <td>${ARS.format(sub)}</td>
        <td><button class="btn btn-sm btn-outline-danger" data-act="del" data-id="${item.id}">✕</button></td>
      `;
      tbody.appendChild(tr);
    });

    totalItemsEl.textContent = totalItems;
    totalAmountEl.textContent = ARS.format(totalAmount);
  }

  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    const id = btn.dataset.id;
    const idx = cart.findIndex(p => p.id === id);
    if (idx < 0) return;

    if (act === 'inc') cart[idx].qty += 1;
    if (act === 'dec') cart[idx].qty = Math.max(1, (cart[idx].qty || 1) - 1);
    if (act === 'del') cart.splice(idx, 1);

    saveCart();
    renderCartPage();
    renderCartBadge();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearCart();
      renderCartPage();
    });
  }

  if (chkBtn) {
    chkBtn.addEventListener('click', () => {
      if (!cart.length) return alert('El carrito está vacío.');
      const ok = confirm('¿Deseás finalizar la compra?');
      if (!ok) return;
      alert('✅ ¡Compra finalizada! Te contactaremos pronto.');
      cart = [];
      saveCart();
      renderCartPage();
      renderCartBadge();
    });
  }

  renderCartPage();
})();
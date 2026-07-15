/**
 * cart.js — Cart state & UI updates
 * Only updates the cart panel & nav badge — never re-renders the menu page.
 */

const Cart = (() => {
  let items = {}; // { [itemId]: quantity }

  function getCount() {
    return Object.values(items).reduce((sum, q) => sum + q, 0);
  }

  function getSubtotal() {
    return MENU.filter(m => items[m.id]).reduce((sum, m) => sum + m.price * (items[m.id] || 0), 0);
  }

  function getItems() {
    return MENU.filter(m => items[m.id] > 0);
  }

  function update(id, delta) {
    items[id] = Math.max(0, (items[id] || 0) + delta);
    if (items[id] === 0) delete items[id];
    _refreshBadge();
    _refreshPanel();
  }

  function clear() {
    items = {};
    _refreshBadge();
    _refreshPanel();
  }

  function getQty(id) {
    return items[id] || 0;
  }

  // ---- private UI helpers ----

  function _refreshBadge() {
    document.getElementById("cart-count").textContent = getCount();
  }

  function _refreshPanel() {
    const list   = document.getElementById("cart-items-list");
    const footer = document.getElementById("cart-footer");
    const cartItems = getItems();

    if (!cartItems.length) {
      list.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <p>Your cart is empty</p>
          <p style="font-size:13px;margin-top:6px;color:var(--muted)">Add something delicious!</p>
        </div>`;
      footer.style.display = "none";
      return;
    }

    footer.style.display = "block";

    list.innerHTML = cartItems.map(m => `
      <div class="cart-item">
        <span class="cart-item-emoji">${m.emoji}</span>
        <div class="cart-item-info">
          <div class="cart-item-name">${m.name}</div>
          <div class="cart-item-price">₹${m.price} × ${items[m.id]}</div>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" data-id="${m.id}" data-delta="-1" aria-label="Remove one">−</button>
          <span class="qty-num">${items[m.id]}</span>
          <button class="qty-btn" data-id="${m.id}" data-delta="1"  aria-label="Add one">+</button>
        </div>
      </div>
    `).join("");

    const sub = getSubtotal();
    document.getElementById("cart-subtotal").textContent = `₹${sub}`;
    document.getElementById("cart-grand").textContent    = `₹${sub + DELIVERY_FEE}`;
  }

  return { update, clear, getCount, getSubtotal, getItems, getQty };
})();

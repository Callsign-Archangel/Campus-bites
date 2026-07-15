/**
 * app.js — Main controller
 * Handles page routing and cart panel open/close.
 * Loaded last so all other modules are ready.
 */

const App = (() => {
  const pages = {
    home:     document.getElementById("page-home"),
    checkout: document.getElementById("page-checkout"),
    success:  document.getElementById("page-success"),
  };

  function showPage(name) {
    Object.entries(pages).forEach(([key, el]) => {
      el.classList.toggle("active", key === name);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (name === "checkout") CheckoutPage.render();
  }

  function _initCart() {
    const overlay  = document.getElementById("cart-overlay");
    const panel    = document.getElementById("cart-panel");
    const openBtn  = document.getElementById("cart-toggle-btn");
    const closeBtn = document.getElementById("cart-close-btn");

    function open()  { overlay.classList.add("open");  panel.classList.add("open");  }
    function close() { overlay.classList.remove("open"); panel.classList.remove("open"); }

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);

    // close cart with Escape key
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

    // event delegation for qty buttons inside the cart panel
    document.getElementById("cart-items-list").addEventListener("click", e => {
      const btn = e.target.closest("[data-id][data-delta]");
      if (!btn) return;
      Cart.update(Number(btn.dataset.id), Number(btn.dataset.delta));
      MenuPage.bindGridCartEvents(); // re-bind in case grid was updated
    });

    // proceed to checkout from cart
    document.getElementById("proceed-btn").addEventListener("click", () => {
      if (!Cart.getCount()) return;
      close();
      showPage("checkout");
    });
  }

  function init() {
    MenuPage.init();
    MenuPage.bindGridCartEvents();
    _initCart();
  }

  return { init, showPage };
})();

// Boot
document.addEventListener("DOMContentLoaded", () => App.init());

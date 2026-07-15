/**
 * checkout.js — Checkout & success page rendering
 */

const CheckoutPage = (() => {
  let payMethod = "upi";

  function render() {
    const page  = document.getElementById("page-checkout");
    const items = Cart.getItems();
    const sub   = Cart.getSubtotal();

    page.innerHTML = `
      <div class="checkout-wrap">
        <button class="back-link" id="back-to-menu">← Back to Menu</button>
        <h1>Checkout</h1>

        <!-- DETAILS -->
        <div class="form-section">
          <div class="form-section-title">📋 Your Details</div>
          <div class="form-row">
            <div class="form-group">
              <label for="f-name">Full Name</label>
              <input type="text" id="f-name" placeholder="Ravi Kumar" autocomplete="name" />
            </div>
            <div class="form-group">
              <label for="f-phone">Phone Number</label>
              <input type="tel" id="f-phone" placeholder="9876543210" maxlength="10" autocomplete="tel" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="f-roll">Roll Number</label>
              <input type="text" id="f-roll" placeholder="21CS001" />
            </div>
            <div class="form-group">
              <label for="f-hostel">Delivery Location</label>
              <select id="f-hostel">
                <option value="">Select hostel / block</option>
                <option>Hostel A</option>
                <option>Hostel B</option>
                <option>Hostel C</option>
                <option>Boys PG Block</option>
                <option>Girls PG Block</option>
                <option>Pick-up from Canteen</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="f-note">Special Instructions (optional)</label>
            <textarea id="f-note" placeholder="Extra spicy? No onions? Less salt? Tell us!"></textarea>
          </div>
        </div>

        <!-- PAYMENT -->
        <div class="form-section">
          <div class="form-section-title">💳 Payment Method</div>
          <div class="pay-options" id="pay-options">
            ${_payOptHTML("upi",  "📱", "UPI",  "GPay · PhonePe · Paytm")}
            ${_payOptHTML("card", "💳", "Card", "Debit / Credit")}
            ${_payOptHTML("cod",  "💵", "Cash on Delivery", "Pay when delivered")}
          </div>
          <div id="pay-detail"></div>
        </div>

        <!-- ORDER SUMMARY -->
        <div class="form-section">
          <div class="form-section-title">🛒 Order Summary</div>
          ${items.map(m => `
            <div class="summary-item">
              <span>${m.emoji} ${m.name} ×${Cart.getQty(m.id)}</span>
              <span>₹${m.price * Cart.getQty(m.id)}</span>
            </div>`).join("")}
          <div class="summary-item" style="color:var(--muted);font-size:13px">
            <span>Delivery fee</span><span>₹${DELIVERY_FEE}</span>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>₹${sub + DELIVERY_FEE}</span>
          </div>
        </div>

        <button class="place-order-btn" id="place-order-btn">
          ✅ Place Order — ₹${sub + DELIVERY_FEE}
        </button>
      </div>`;

    _renderPayDetail();
    _bindEvents(page);
  }

  function _payOptHTML(val, icon, label, sub) {
    return `
      <div class="pay-opt${payMethod === val ? " selected" : ""}" data-pay="${val}">
        <div class="pay-opt-icon">${icon}</div>
        <div class="pay-opt-label">${label}</div>
        <div class="pay-opt-sub">${sub}</div>
      </div>`;
  }

  function _renderPayDetail() {
    const el  = document.getElementById("pay-detail");
    const sub = Cart.getSubtotal();
    if (payMethod === "upi") {
      el.innerHTML = `
        <div class="pay-detail">
          <p style="font-size:13px;color:var(--muted)">Pay to UPI ID:</p>
          <div class="upi-id">${CANTEEN_UPI}</div>
          <p style="font-size:12px;color:var(--muted)">Open GPay / PhonePe / Paytm and pay to the UPI ID above, or scan the QR at the counter. Enter the transaction ID below.</p>
          <div class="form-group" style="margin-top:14px">
            <label for="f-utr">UTR / Transaction ID</label>
            <input type="text" id="f-utr" placeholder="T2312345678" />
          </div>
        </div>`;
    } else if (payMethod === "card") {
      el.innerHTML = `
        <div class="pay-detail">
          <div class="form-group">
            <label for="f-card">Card Number</label>
            <input type="text" id="f-card" placeholder="•••• •••• •••• ••••" maxlength="19" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="f-expiry">Expiry</label>
              <input type="text" id="f-expiry" placeholder="MM / YY" maxlength="7" />
            </div>
            <div class="form-group">
              <label for="f-cvv">CVV</label>
              <input type="password" id="f-cvv" placeholder="•••" maxlength="3" />
            </div>
          </div>
          <p class="secure-note">🔒 Payments processed securely via Razorpay. Add your live Razorpay key in js/checkout.js to go live.</p>
        </div>`;
    } else {
      el.innerHTML = `
        <div class="pay-detail">
          <p style="font-size:14px;color:var(--muted)">
            💵 Pay <strong style="color:var(--text)">₹${sub + DELIVERY_FEE}</strong> in cash when your order arrives.
            Exact change is appreciated!
          </p>
        </div>`;
    }
  }

  function _bindEvents(page) {
    // back button
    page.querySelector("#back-to-menu").addEventListener("click", () => {
      App.showPage("home");
    });

    // payment option toggle
    page.querySelector("#pay-options").addEventListener("click", e => {
      const opt = e.target.closest(".pay-opt");
      if (!opt) return;
      payMethod = opt.dataset.pay;
      page.querySelectorAll(".pay-opt").forEach(o => o.classList.toggle("selected", o.dataset.pay === payMethod));
      _renderPayDetail();
    });

    // card number auto-formatting
    page.addEventListener("input", e => {
      if (e.target.id === "f-card") {
        let v = e.target.value.replace(/\D/g, "").slice(0, 16);
        e.target.value = v.replace(/(.{4})/g, "$1 ").trim();
      }
      if (e.target.id === "f-expiry") {
        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
        e.target.value = v.length > 2 ? v.slice(0,2) + " / " + v.slice(2) : v;
      }
    });

    // place order
    page.querySelector("#place-order-btn").addEventListener("click", _placeOrder);
  }

  function _placeOrder() {
    const name   = document.getElementById("f-name")?.value.trim();
    const phone  = document.getElementById("f-phone")?.value.trim();
    const hostel = document.getElementById("f-hostel")?.value;

    if (!name)   { _shake("f-name",   "Please enter your name.");         return; }
    if (!phone || phone.length < 10) { _shake("f-phone", "Enter a valid 10-digit phone number."); return; }
    if (!hostel) { _shake("f-hostel", "Please select a delivery location."); return; }
    if (payMethod === "upi") {
      const utr = document.getElementById("f-utr")?.value.trim();
      if (!utr)  { _shake("f-utr",    "Please enter your UTR / Transaction ID."); return; }
    }

    const orderId = "CB" + Math.floor(100000 + Math.random() * 900000);
    Cart.clear();
    SuccessPage.render(name, orderId);
    App.showPage("success");
  }

  function _shake(fieldId, msg) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.style.borderColor = "var(--danger)";
    el.focus();
    alert(msg); // simple validation — swap for a toast/inline error in production
    setTimeout(() => { el.style.borderColor = ""; }, 2000);
  }

  return { render };
})();


// ---- SUCCESS PAGE ----
const SuccessPage = (() => {
  function render(name, orderId) {
    const page = document.getElementById("page-success");
    page.innerHTML = `
      <div class="success-wrap">
        <span class="success-icon" aria-hidden="true">🎉</span>
        <h1>Order Placed!</h1>
        <p>Hey <strong>${_esc(name)}</strong>! Your order is confirmed and the kitchen is already cooking. 🔥</p>
        <div class="order-id-box" aria-label="Order ID">#${orderId}</div>

        <div class="track-steps" aria-label="Order status">
          <div class="track-step">
            <div class="step-dot done" aria-label="Done">✓</div>
            <div class="step-info"><p>Order Confirmed</p><span>Just now</span></div>
          </div>
          <div class="track-step">
            <div class="step-dot active" aria-label="In progress">🍳</div>
            <div class="step-info"><p>Preparing your food</p><span>Est. 10 min</span></div>
          </div>
          <div class="track-step">
            <div class="step-dot pending" aria-label="Pending">🛵</div>
            <div class="step-info"><p>Out for delivery</p><span>Est. 15 min</span></div>
          </div>
          <div class="track-step">
            <div class="step-dot pending" aria-label="Pending">🏠</div>
            <div class="step-info"><p>Delivered!</p><span>Est. 20 min</span></div>
          </div>
        </div>

        <button class="back-home-btn" id="order-more-btn">← Order More Food</button>
      </div>`;

    page.querySelector("#order-more-btn").addEventListener("click", () => {
      App.showPage("home");
    });
  }

  function _esc(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  return { render };
})();

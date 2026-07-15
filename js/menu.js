/**
 * menu.js — Menu rendering & filtering
 *
 * KEY FIX: Search and category filtering ONLY update #menu-grid and #result-count.
 * The hero, search input, and category buttons are NEVER re-rendered on filter change.
 * This prevents the input from losing focus after every keystroke.
 */

const MenuPage = (() => {
  let selectedCat = "All";
  let searchQuery = "";

  // ---- public: called once on app init ----
  function init() {
    _buildCategories();
    _renderGrid();
    _bindSearch();
  }

  // ---- build category pill buttons once ----
  function _buildCategories() {
    const container = document.getElementById("cat-buttons");
    container.innerHTML = CATEGORIES.map(cat => `
      <button
        class="cat-btn${cat === selectedCat ? " active" : ""}"
        data-cat="${cat}"
        role="tab"
        aria-selected="${cat === selectedCat}"
      >${cat}</button>
    `).join("");

    container.addEventListener("click", e => {
      const btn = e.target.closest(".cat-btn");
      if (!btn) return;
      selectedCat = btn.dataset.cat;

      // update active styles without re-rendering anything else
      container.querySelectorAll(".cat-btn").forEach(b => {
        const isActive = b.dataset.cat === selectedCat;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-selected", isActive);
      });

      _renderGrid();
    });
  }

  // ---- bind search input — only touches the grid ----
  function _bindSearch() {
    const input     = document.getElementById("search-input");
    const clearBtn  = document.getElementById("search-clear");

    input.addEventListener("input", () => {
      searchQuery = input.value.trim().toLowerCase();
      clearBtn.style.display = searchQuery ? "flex" : "none";
      _renderGrid();  // only updates the grid, input keeps focus
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      searchQuery = "";
      clearBtn.style.display = "none";
      input.focus();
      _renderGrid();
    });
  }

  // ---- render only the grid & result count ----
  function _renderGrid() {
    const filtered = MENU.filter(m => {
      const matchCat  = selectedCat === "All" || m.cat === selectedCat;
      const matchText = !searchQuery ||
        m.name.toLowerCase().includes(searchQuery) ||
        m.desc.toLowerCase().includes(searchQuery) ||
        m.cat.toLowerCase().includes(searchQuery);
      return matchCat && matchText;
    });

    const grid     = document.getElementById("menu-grid");
    const noResult = document.getElementById("no-results");
    const countEl  = document.getElementById("result-count");

    if (!filtered.length) {
      grid.innerHTML = "";
      noResult.style.display = "block";
      countEl.textContent = "";
      return;
    }

    noResult.style.display = "none";
    countEl.textContent = `${filtered.length} item${filtered.length !== 1 ? "s" : ""}`;

    grid.innerHTML = filtered.map(m => _cardHTML(m)).join("");
  }

  // ---- build card HTML for one item ----
  function _cardHTML(m) {
    const qty = Cart.getQty(m.id);
    const controls = qty > 0
      ? `<div class="qty-ctrl">
           <button class="qty-btn" data-id="${m.id}" data-delta="-1" aria-label="Remove one ${m.name}">−</button>
           <span class="qty-num">${qty}</span>
           <button class="qty-btn" data-id="${m.id}" data-delta="1"  aria-label="Add another ${m.name}">+</button>
         </div>`
      : `<button class="add-btn" data-id="${m.id}" data-delta="1" aria-label="Add ${m.name} to cart">+ Add</button>`;

    return `
      <article class="menu-card">
        <div class="menu-card-img" aria-hidden="true">${m.emoji}</div>
        <div class="menu-card-body">
          <div class="veg-row">
            <span class="veg-dot ${m.veg ? "veg" : "nonveg"}" aria-hidden="true"></span>
            <span class="veg-label">${m.veg ? "Veg" : "Non-Veg"}</span>
          </div>
          <div class="item-name">${m.name}</div>
          <div class="item-desc">${m.desc}</div>
          <div class="item-footer">
            <span class="item-price">₹${m.price}</span>
            ${controls}
          </div>
        </div>
      </article>`;
  }

  // ---- handle cart updates from the menu grid (event delegation) ----
  function bindGridCartEvents() {
    const grid = document.getElementById("menu-grid");
    grid.addEventListener("click", e => {
      const btn = e.target.closest("[data-id][data-delta]");
      if (!btn) return;
      const id    = Number(btn.dataset.id);
      const delta = Number(btn.dataset.delta);
      Cart.update(id, delta);
      _refreshCard(id);  // only re-renders the single affected card
    });
  }

  // ---- re-render just the one card that changed ----
  function _refreshCard(id) {
    const item = MENU.find(m => m.id === id);
    if (!item) return;
    const grid = document.getElementById("menu-grid");
    const existing = grid.querySelector(`[data-id="${id}"][data-delta]`)?.closest(".menu-card")
                  || grid.querySelector(`.add-btn[data-id="${id}"]`)?.closest(".menu-card");
    if (!existing) return; // card not in current filtered view

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = _cardHTML(item);
    existing.replaceWith(tempDiv.firstElementChild);
  }

  return { init, bindGridCartEvents };
})();

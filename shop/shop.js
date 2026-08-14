/* Magazin componente — coș local, fără plată online încă */

const CART_KEY = "iot-shop-cart";

function $(sel, root) {
  return (root || document).querySelector(sel);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function products() {
  return (window.SHOP_PRODUCTS || []).filter((p) => p.published !== false);
}

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartCount(cart) {
  return Object.values(cart).reduce((n, q) => n + Number(q || 0), 0);
}

function cartTotal(cart) {
  let sum = 0;
  const list = products();
  Object.keys(cart).forEach((id) => {
    const p = list.find((x) => x.id === id);
    if (p) sum += Number(p.price || 0) * Number(cart[id] || 0);
  });
  return sum;
}

function money(n, cur) {
  const v = Number(n || 0);
  return v.toFixed(0) + " " + (cur || "MDL");
}

function currentCat() {
  return window._shopCat || "all";
}

function renderHeader() {
  const el = $("#site-header");
  if (!el) return;
  const on = document.documentElement.classList.contains("theme-fun");
  el.innerHTML = `
    <div class="top">
      <a class="brand" href="./">
        <span class="logo">IoT</span>
        <span>${escapeHtml(t("shopBrand"))}</span>
      </a>
      <div class="top-right">
        <a class="back-link" href="../">${escapeHtml(t("shopBack"))}</a>
        <button type="button" class="theme-switch" id="theme-switch" aria-pressed="${
          on ? "true" : "false"
        }" aria-label="${escapeHtml(on ? t("themeFunOn") : t("themeFunOff"))}">
          <span class="theme-switch-track" aria-hidden="true"><span class="theme-switch-knob"></span></span>
        </button>
        ${typeof renderLangSwitch === "function" ? renderLangSwitch() : ""}
      </div>
    </div>`;
  if (typeof bindLangSwitch === "function") bindLangSwitch(el);
  const sw = $("#theme-switch");
  if (sw) {
    sw.addEventListener("click", () => {
      const fun = !document.documentElement.classList.contains("theme-fun");
      document.documentElement.classList.toggle("theme-fun", fun);
      try {
        localStorage.setItem("iot-theme", fun ? "fun" : "calm");
      } catch (e) {}
      renderAll();
    });
  }
}

function renderCats() {
  const cats = ["all", ...new Set(products().map((p) => p.category || "Altele"))];
  const box = $("#shop-cats");
  if (!box) return;
  box.innerHTML = cats
    .map((c) => {
      const label = c === "all" ? t("shopAll") : c;
      const on = currentCat() === c ? " is-on" : "";
      return `<button type="button" class="lang-btn${on}" data-cat="${escapeHtml(c)}">${escapeHtml(
        label
      )}</button>`;
    })
    .join("");
  box.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window._shopCat = btn.getAttribute("data-cat");
      renderGrid();
      renderCats();
    });
  });
}

function renderGrid() {
  const grid = $("#shop-grid");
  const empty = $("#shop-empty");
  const cat = currentCat();
  const list = products().filter((p) => cat === "all" || p.category === cat);
  if (!list.length) {
    grid.innerHTML = "";
    if (empty) {
      empty.textContent = t("shopNone");
      empty.classList.add("show");
    }
    return;
  }
  if (empty) empty.classList.remove("show");
  grid.innerHTML = list
    .map((p) => {
      const img = p.image
        ? `<img class="shop-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" />`
        : `<div class="shop-img shop-img-ph">${escapeHtml((p.title || "?").slice(0, 1))}</div>`;
      const used = (p.usedIn || []).length
        ? `<div class="shop-used">${escapeHtml(t("shopUsed"))} #${p.usedIn.join(" #")}</div>`
        : "";
      const stock = Number(p.stock || 0);
      const stockTxt =
        stock > 0 ? t("shopStock", { n: stock }) : t("shopOut");
      return `<article class="shop-card">
        ${img}
        <div class="shop-card-body">
          <h2>${escapeHtml(p.title)}</h2>
          <p>${escapeHtml(p.short || "")}</p>
          ${used}
          <div class="shop-meta">
            <strong class="shop-price">${escapeHtml(money(p.price, p.currency))}</strong>
            <span class="shop-stock">${escapeHtml(stockTxt)}</span>
          </div>
          <button type="button" class="btn" data-add="${escapeHtml(p.id)}" ${
        stock < 1 ? "disabled" : ""
      }>${escapeHtml(t("shopAdd"))}</button>
        </div>
      </article>`;
    })
    .join("");
  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add")));
  });
}

function addToCart(id) {
  const p = products().find((x) => x.id === id);
  if (!p || Number(p.stock || 0) < 1) return;
  const cart = loadCart();
  const next = Number(cart[id] || 0) + 1;
  if (next > Number(p.stock)) return;
  cart[id] = next;
  saveCart(cart);
  renderCartBtn();
  renderCart();
}

function changeQty(id, delta) {
  const cart = loadCart();
  const p = products().find((x) => x.id === id);
  let q = Number(cart[id] || 0) + delta;
  if (p && q > Number(p.stock)) q = Number(p.stock);
  if (q <= 0) delete cart[id];
  else cart[id] = q;
  saveCart(cart);
  renderCartBtn();
  renderCart();
}

function renderCartBtn() {
  const btn = $("#btn-cart");
  if (btn) btn.textContent = t("shopCartN", { n: cartCount(loadCart()) });
}

function renderCart() {
  const panel = $("#cart-panel");
  const lines = $("#cart-lines");
  const total = $("#cart-total");
  const cart = loadCart();
  const ids = Object.keys(cart);
  if (!ids.length) {
    lines.innerHTML = `<p class="num-hint">${escapeHtml(t("shopCartEmpty"))}</p>`;
    total.textContent = "";
    return;
  }
  const list = products();
  lines.innerHTML = ids
    .map((id) => {
      const p = list.find((x) => x.id === id);
      if (!p) return "";
      const q = Number(cart[id]);
      const line = Number(p.price) * q;
      return `<div class="cart-line">
        <span>${escapeHtml(p.title)} × ${q}</span>
        <span>${escapeHtml(money(line, p.currency))}</span>
        <span class="cart-qty">
          <button type="button" data-q="${escapeHtml(id)}" data-d="-1">−</button>
          <button type="button" data-q="${escapeHtml(id)}" data-d="1">+</button>
        </span>
      </div>`;
    })
    .join("");
  total.textContent = t("shopTotal") + ": " + money(cartTotal(cart), "MDL");
  lines.querySelectorAll("[data-q]").forEach((btn) => {
    btn.addEventListener("click", () =>
      changeQty(btn.getAttribute("data-q"), Number(btn.getAttribute("data-d")))
    );
  });
}

function renderAll() {
  if (typeof applyStaticI18n === "function") applyStaticI18n();
  renderHeader();
  renderCats();
  renderGrid();
  renderCartBtn();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  window.route = renderAll;
  if (typeof setLang === "function") setLang(getLang());
  else renderAll();

  $("#btn-cart").addEventListener("click", () => {
    const panel = $("#cart-panel");
    panel.classList.toggle("hidden");
    if (!panel.classList.contains("hidden")) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  $("#order-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const cart = loadCart();
    if (!cartCount(cart)) {
      alert(t("shopCartEmpty"));
      return;
    }
    const order = {
      at: new Date().toISOString(),
      name: $("#ord-name").value.trim(),
      phone: $("#ord-phone").value.trim(),
      city: $("#ord-city").value.trim(),
      note: $("#ord-note").value.trim(),
      items: cart,
      total: cartTotal(cart),
      currency: "MDL",
    };
    try {
      const prev = JSON.parse(localStorage.getItem("iot-shop-orders") || "[]");
      prev.push(order);
      localStorage.setItem("iot-shop-orders", JSON.stringify(prev));
    } catch (err) {}
    saveCart({});
    renderCartBtn();
    renderCart();
    const ok = $("#order-ok");
    ok.hidden = false;
    ok.textContent = t("shopOrderOk");
    e.target.reset();
  });
});

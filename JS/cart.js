// /JS/cart.js  (ES module)
const KEY = "cartData";

const els = {
  toggle: null,
  menu: null,
  list: null,
  total: null,
  badge: null,
  clearBtn: null,
};

function read() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}
function write(v) {
  localStorage.setItem(KEY, JSON.stringify(v));
}
function totalOf(cart) {
  return cart.reduce((s, i) => s + Number(i.price) * i.qty, 0);
}
function countOf(cart) {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function ensureDropdownInDOM() {
  // If page doesn't have the HTML, inject it into header .container (or body as fallback)
  let host = document.querySelector("header .container") || document.body;
  if (document.getElementById("cartToggle")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "cart-dropdown";
  wrapper.innerHTML = `
    <button id="cartToggle" class="cart-icon" aria-label="Cart">
      <i class="fa-solid fa-cart-shopping"></i>
      <span id="cartCount" class="badge">0</span>
    </button>
    <div id="cartMenu" class="cart-menu">
      <h4>Your Cart</h4>
      <ul id="cartList"></ul>
      <p id="cartTotal">Total: ₹0</p>
      <button id="clearCartBtn" class="clear-btn">Clear Cart</button>
    </div>
  `;
  host.appendChild(wrapper);
}

function cacheEls() {
  els.toggle = document.getElementById("cartToggle");
  els.menu = document.getElementById("cartMenu");
  els.list = document.getElementById("cartList");
  els.total = document.getElementById("cartTotal");
  els.badge = document.getElementById("cartCount");
  els.clearBtn = document.getElementById("clearCartBtn");
}

export function renderCart() {
  const cart = read();
  // list
  els.list.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <span>${(item.price * item.qty).toFixed(2)} TK</span>
    `;
    els.list.appendChild(li);
  });
  // total + badge
  els.total.textContent = `Total: ${totalOf(cart).toFixed(2)} TK`;
  els.badge.textContent = countOf(cart);
  els.badge.classList.remove("bump");
  void els.badge.offsetWidth;
  els.badge.classList.add("bump");
}

export function addToCart(product) {
  if (!product) return;
  const cart = read();
  const id = product.id || product.name;
  const i = cart.findIndex((it) => it.id === id);
  if (i > -1) cart[i].qty += 1;
  else
    cart.push({
      id,
      name: product.name,
      price: Number(product.price),
      img: product.img,
      qty: 1,
    });
  write(cart);
  renderCart();
}

export function clearCart() {
  localStorage.removeItem(KEY);
  renderCart();
}

function wireUI() {
  // toggle open/close
  els.toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    els.menu.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (!els.menu.contains(e.target) && e.target !== els.toggle) {
      els.menu.classList.remove("active");
    }
  });
  els.clearBtn.addEventListener("click", () => {
    clearCart();
  });
  // Live sync across tabs/pages
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) renderCart();
  });
}

export function initCart() {
  ensureDropdownInDOM();
  cacheEls();
  wireUI();
  renderCart(); // initial paint from localStorage
}

// Optional helpers if other scripts need them
export function getCart() {
  return read();
}
export function setCart(v) {
  write(v);
  renderCart();
}

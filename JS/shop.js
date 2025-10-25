//Option
import { allProducts } from "./data.js";

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const productList = document.getElementById("product-list");
const sortSelect = document.getElementById("option");
const popup = document.getElementById("productPopup");
const popupImg = document.getElementById("popup-img");
const popupName = document.getElementById("popup-name");
const popupGender = document.getElementById("popup-gender");
const popupPrice = document.getElementById("popup-price");
const popupDesc = document.getElementById("popup-desc");
const closeBtn = document.querySelector(".close-btn");
const addCartBtn = document.getElementById("addCartBtn");
const buyNowBtn = document.getElementById("buyNowBtn");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartBadge = document.getElementById("cartCount");
const cartToggle = document.getElementById("cartToggle");
const cartSection = document.getElementById("cartSection");
const clearCartBtn = document.getElementById("clearCartBtn");
const genderFilter = document.getElementById("genderFilter");
const bestsellers_list = document.getElementById("bestsellers-list");

function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.className = "product";
    li.innerHTML = `
      <div class="thamnell"><img src="${p.img}" alt="${p.name}"></div>
      <div class="sumaries">
        <h4>${p.name}</h4>
        <p class="gender">${p.gender}</p>
        <p>${p.price} TK</p>
      </div>`;
    // click event for popup
    li.addEventListener("click", () => openPopup(p));
    productList.appendChild(li);
  });
}
let currentPage = 1;
const itemsPerPage = 6;

function renderPaginatedProducts(products) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  renderProducts(products.slice(start, end));
}

let currentProducts = [...allProducts]; // কপি রাখা

// প্রথমবার পেজ লোড হলে
// renderPaginatedProducts(currentProducts);

// sort change হলে
sortSelect.addEventListener("change", function () {
  const sortValue = this.value;

  if (sortValue === "low-high") {
    currentProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high-low") {
    currentProducts.sort((a, b) => b.price - a.price);
  } else {
    currentProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  currentPage = 1;
  renderPaginatedProducts(currentProducts);
});

document.addEventListener("DOMContentLoaded", () => {
  // ====== AUTO CREATE TOP INFO TEXT ======
  let pageInfo_top = document.getElementById("pageInfo_top");

  // যদি HTML এ না থাকে, JS দিয়ে বানাও
  if (!pageInfo_top) {
    const firstRow = document.querySelector(".first-row");
    pageInfo_top = document.createElement("p");
    pageInfo_top.id = "pageInfo_top";
    pageInfo_top.style.fontSize = "15px";
    pageInfo_top.style.color = "#222";
    pageInfo_top.style.fontWeight = "500";
    pageInfo_top.style.margin = "10px 0";

    // প্রথম-row এর শুরুতে ঢোকাও (dropdown এর আগে)
    if (firstRow) firstRow.insertBefore(pageInfo_top, firstRow.firstChild);
  }

  // updatePagination function override / redefine করো
  window.updatePagination = function (products) {
    const totalPages = Math.ceil(products.length / itemsPerPage) || 1;

    if (pageInfo) {
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    if (pageInfo_top) {
      const start = (currentPage - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage * itemsPerPage, products.length);
      pageInfo_top.textContent = `Showing ${start}–${end} of ${products.length} results`;
    }

    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
  };

  // প্রথম লোডেই products render + info দেখাও
  renderPaginatedProducts(currentProducts);
  updatePagination(currentProducts);
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPaginatedProducts(currentProducts);
    updatePagination(currentProducts);
  }
});

nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPaginatedProducts(currentProducts);
    updatePagination(currentProducts);
  }
});
///
///
/// Popup
///
///
///
///
function openPopup(product) {
  currentProduct = product; // ★ নির্বাচিত প্রোডাক্ট ধরে রাখা
  popupImg.src = product.img;
  popupName.textContent = product.name;
  popupGender.textContent = product.gender;
  popupPrice.textContent = `${product.price} TK`;
  popupDesc.textContent = product.desc || "";
  popup.style.display = "flex";

  // বাটনগুলোতে সঠিক event
  addCartBtn.onclick = (e) => {
    e.preventDefault();
    addToCart(currentProduct); // ★ কার্টে যোগ
    popup.style.display = "none";
  };

  buyNowBtn.onclick = (e) => {
    e.preventDefault();
    addToCart(currentProduct); // চাইলে যোগ না করেও সরাসরি checkout নিতে পারো
    // window.location.href = "/checkout.html";
    popup.style.display = "none";
  };
}

// 🔹 Close popup
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

// 🔹 Click outside to close
window.addEventListener("click", (e) => {
  if (e.target === popup) popup.style.display = "none";
});
// CART UI elements (এগুলো আগে define ছিল না)

// ====== CART STATE ======
let cart = JSON.parse(localStorage.getItem("cartData") || "[]");
let currentProduct = null; // popup এ যে প্রোডাক্ট খুলছে

function saveCart() {
  localStorage.setItem("cartData", JSON.stringify(cart));
}
// Toggle on button click
cartToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // বাইরে ক্লিক ব্লক
  cartSection.classList.toggle("active");
});

// বাইরে ক্লিক করলে বন্ধ
document.addEventListener("click", (e) => {
  if (!cartSection.contains(e.target) && e.target !== cartToggle) {
    cartSection.classList.remove("active");
  }
});

// ---- pagination text ----
function updatePagination(products) {
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;

  if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  let pageInfo_top = document.getElementById("pageInfo_top");
  if (!pageInfo_top) {
    const firstRow = document.querySelector(".first-row");
    pageInfo_top = document.createElement("p");
    pageInfo_top.id = "pageInfo_top";
    pageInfo_top.style.fontSize = "15px";
    pageInfo_top.style.color = "#222";
    pageInfo_top.style.fontWeight = "500";
    pageInfo_top.style.margin = "10px 0";
    if (firstRow) firstRow.insertBefore(pageInfo_top, firstRow.firstChild);
  }
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, products.length);
  pageInfo_top.textContent = `Showing ${start}–${end} of ${products.length} results`;

  if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
  if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
}

// ---- events (ONE set only) ----
if (genderFilter) {
  genderFilter.addEventListener("change", (e) => {
    applyGenderFilter(e.target.value);
    // keep current sort applied on top of filter
    sortSelect?.dispatchEvent(new Event("change"));
    // reflect in URL without reload
    const u = new URL(window.location);
    u.searchParams.set("gender", e.target.value);
    history.replaceState({}, "", u);
  });
}

sortSelect.addEventListener("change", function () {
  const sortValue = this.value;
  if (sortValue === "low-high") {
    currentProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high-low") {
    currentProducts.sort((a, b) => b.price - a.price);
  } else {
    currentProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  currentPage = 1;
  renderPaginatedProducts(currentProducts);
  updatePagination(currentProducts);
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPaginatedProducts(currentProducts);
    updatePagination(currentProducts);
  }
});

nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPaginatedProducts(currentProducts);
    updatePagination(currentProducts);
  }
});

// ---- Gender Select Section ----
// function normalizeGender(s = "All") {
//   s = String(s).toLowerCase().replace(/[’']/g, "").trim();
//   if (["male", "man", "mens", "men"].includes(s)) return "male";
//   if (["female", "woman", "womens", "women", "ladies"].includes(s))
//     return "female";
//   if (
//     ["kids", "kid", "child", "children", "boys", "girls", "kidswear"].includes(
//       s
//     )
//   )
//     return "kids";
//   if (s === "all") return "all";
//   return "all";
// }
function normalizeGender(s = "All") {
  s = String(s).toLowerCase().replace(/[’']/g, "").trim();
  if (["male", "man", "mens", "men"].includes(s)) return "male";
  if (["female", "woman", "womens", "women", "ladies"].includes(s))
    return "female";
  if (
    ["kids", "kid", "child", "children", "boys", "girls", "kidswear"].includes(
      s
    )
  )
    return "kids";
  if (s === "all") return "all";
  return "all";
}

function prettyGender(norm) {
  return norm === "all" ? "All" : norm[0].toUpperCase() + norm.slice(1);
}

function getStartGender() {
  // Detect reloads
  const nav = performance.getEntriesByType("navigation")[0];
  const isReload = nav && nav.type === "reload";

  if (isReload) return "All"; // always reset to All on reload

  // If not reload, honor URL param from homepage (or default All)
  const urlVal = new URLSearchParams(location.search).get("gender"); // Male/Female/Kids/All/null
  return urlVal || "All";
}
// function applyGenderFilter(selected = "All") {
//   const g = normalizeGender(selected);

//   currentProducts = allProducts.filter((p) => {
//     const pg = normalizeGender(p.gender);
//     return g === "all" ? true : pg === g;
//   });
//   if (!currentProducts.length) currentProducts = [...allProducts];

//   // sync UI
//   if (genderFilter) {
//     genderFilter.value = g === "all" ? "All" : g[0].toUpperCase() + g.slice(1);
//   }

//   currentPage = 1;
//   renderPaginatedProducts(currentProducts);
//   updatePagination(currentProducts);
// }

// keep only ONE sort listener
function applyGenderFilter(selected = "All") {
  const gNorm = normalizeGender(selected);

  currentProducts = allProducts.filter((p) => {
    const pg = normalizeGender(p.gender);
    return gNorm === "all" ? true : pg === gNorm;
  });
  if (!currentProducts.length) currentProducts = [...allProducts];

  // Sync the dropdown if present
  const gf = document.getElementById("genderFilter");
  if (gf) gf.value = prettyGender(gNorm);

  currentPage = 1;
  renderPaginatedProducts(currentProducts);
  updatePagination(currentProducts);
}
sortSelect.addEventListener("change", function () {
  const sortValue = this.value;
  if (sortValue === "low-high")
    currentProducts.sort((a, b) => a.price - b.price);
  else if (sortValue === "high-low")
    currentProducts.sort((a, b) => b.price - a.price);
  else currentProducts.sort((a, b) => new Date(b.date) - new Date(a.date));

  currentPage = 1;
  renderPaginatedProducts(currentProducts);
  updatePagination(currentProducts);
});

if (genderFilter) {
  genderFilter.addEventListener("change", (e) => {
    applyGenderFilter(e.target.value);
    sortSelect.dispatchEvent(new Event("change")); // keep sort on top
    const u = new URL(window.location);
    u.searchParams.set("gender", e.target.value);
    history.replaceState({}, "", u);
  });
}

// document.addEventListener("DOMContentLoaded", () => {
//   // read ?gender=Male/Female/Kids
//   const params = new URLSearchParams(window.location.search);
//   const genderParam = params.get("gender");

//   // 1) apply gender first
//   applyGenderFilter(genderParam || (genderFilter?.value ?? "All"));

//   // 2) apply current sort on filtered list
//   sortSelect.dispatchEvent(new Event("change"));

//   // 3) ensure pagination text is correct (if your updatePagination needs it)
//   updatePagination(currentProducts);

// });

// Click outside to close
// document.addEventListener("click", (e) => {
//   if (!cartDropdownContains(e.target)) {
//     cartSection.classList.remove("active");
//   }
// });
// function cartDropdownContains(target) {
//   return (
//     target.closest(".cart-dropdown") ||
//     target === cartToggle ||
//     target === cartMenu
//   );
// }
document.addEventListener("DOMContentLoaded", () => {
  const genderFilter = document.getElementById("genderFilter");

  // 1) Decide initial gender (URL wins unless this is a reload)
  const initial = getStartGender();

  // 2) Show it in the UI first (prevents flicker)
  if (genderFilter) genderFilter.value = initial;

  // 3) Apply gender FIRST
  applyGenderFilter(initial);

  // 4) Then apply current sort on the filtered list
  if (sortSelect) sortSelect.dispatchEvent(new Event("change"));

  // 5) Handle dropdown changes
  if (genderFilter) {
    genderFilter.addEventListener("change", (e) => {
      const val = e.target.value; // "All" | "Male" | "Female" | "Kids"

      // Optional: reflect in URL so you can share the link or navigate back/forward
      const u = new URL(location.href);
      u.searchParams.set("gender", val);
      history.replaceState({}, "", u);

      applyGenderFilter(val);
      if (sortSelect) sortSelect.dispatchEvent(new Event("change"));
    });
  }
});

///////
//
//
//
//
/////

function updateCartUI() {
  // list render
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <span>${(item.price * item.qty)} TK</span>
    `;
    cartList.appendChild(li);
  });
  cartTotal.textContent = `Total: ₹${total}`;

  // badge
  const count = cart.reduce((n, it) => n + it.qty, 0);
  if (cartBadge) {
    cartBadge.textContent = count;
    cartBadge.classList.remove("bump");
    void cartBadge.offsetWidth; // restart animation
    cartBadge.classList.add("bump");
  }
}
updateCartUI(); // প্রথম লোডে দেখাও
// Clear Cart Function

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = []; // কার্ট খালি করো
    localStorage.removeItem("cartData"); // localStorage থেকেও মুছো
    updateCartUI(); // UI আপডেট করো
  });
}
function addToCart(product) {
  if (!product) return;

  const idx = cart.findIndex((it) => it.id === (product.id || product.name));
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({
      id: product.id || product.name,
      name: product.name,
      price: Number(product.price),
      img: product.img,
      qty: 1,
    });
  }

  // localStorage.setItem("cartData", JSON.stringify(cart));
  updateCartUI();
  saveCart();
  updateCartUI();
}

// Toggle Button
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleMenu");
  const navLinks = document.getElementById("menu");

  // Toggle open/close when button clicked
  toggle.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent closing instantly
    navLinks.classList.toggle("active");

    // Change icon
    toggle.innerHTML = navLinks.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      e.target !== toggle
    ) {
      navLinks.classList.remove("active");
      toggle.innerHTML = '<i class="fas fa-bars"></i>'; // revert icon
    }
  });

  // Close menu when clicking on any link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      toggle.innerHTML = '<i class="fas fa-bars"></i>'; // revert icon
    });
  });
});

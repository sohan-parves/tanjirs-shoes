import { allProducts } from "./data.js";
import { saleEndDate } from "./data.js";

const cartSection = document.getElementById("cartSection");
const cartToggle = document.getElementById("cartToggle");
const arrivalsList = document.getElementById("arrivals-list");
const filterButtons = document.querySelectorAll(".filter-btn");

// Sort by newest and take first 3 (or 6 if you want more)
const latest = [...allProducts]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 3);

latest.forEach((p) => {
  const li = document.createElement("li");
  li.className = "card-footer-new-arrivals";

  // If your image paths are relative to shop, ensure they still resolve on index
  const imgSrc = p.img; // keep as-is if paths are correct for homepage too

  li.innerHTML = `
    <div class="card">
      <a href="HTML/shop.html#shop" class="link-tag" aria-label="${p.name}">
        <img src="${imgSrc}" alt="${p.name}">
        <div class="sumaries">
          <h4>${p.name}</h4>
          <p class="gender">${p.gender}</p>
          <h5>${Number(p.price)} TK</h5>
        </div>
      </a>
    </div>
  `;

  // Optional: click to open shop OR to add to cart/popup on homepage
  // li.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   addToCart({ id: p.id || p.name, name: p.name, price: p.price, img: p.img });
  // });

  arrivalsList.appendChild(li);
});
// ====== CART STATE ======
let cart = JSON.parse(localStorage.getItem("cartData") || "[]");
let currentProduct = null; // popup এ যে প্রোডাক্ট খুলছে

// function saveCart() {
//   localStorage.setItem("cartData", JSON.stringify(cart));
// }
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

// Click outside to close
document.addEventListener("click", (e) => {
  if (!cartDropdownContains(e.target)) {
    cartSection.classList.remove("active");
  }
});
function cartDropdownContains(target) {
  return (
    target.closest(".cart-dropdown") ||
    target === cartToggle ||
    target === cartMenu
  );
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active from all
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const selectedGender = btn.dataset.gender;

    if (selectedGender === "All") {
      currentProducts = [...allProducts];
    } else {
      currentProducts = allProducts.filter(
        (p) => p.gender.toLowerCase() === selectedGender.toLowerCase()
      );
    }

    currentPage = 1;
    renderPaginatedProducts(currentProducts);
    updatePagination(currentProducts);
  });
});

//
//
//
//
//
//
//
function getSalesCount(p) {
  return Number(p.salesCount ?? p.countatyOfSela ?? 0);
}

function formatPrice(n) {
  return `₹${Number(n).toFixed(2)}`;
}

function renderBestsellers(limit = 3) {
  // 🔹 শুধু ৩টা দেখাবে
  const list = document.getElementById("bestsellers-list");
  if (!list) return;

  // 1) শুধু যেগুলোর সেলস > 0
  const withSales = allProducts.filter((p) => getSalesCount(p) > 0);

  // 2) বেশি সেলস আগে
  const top = withSales
    .sort((a, b) => getSalesCount(b) - getSalesCount(a))
    .slice(0, limit);

  // 3) খালি হলে fallback
  if (top.length === 0) {
    list.innerHTML = `<li style="text-align:center; opacity:.7">No bestsellers yet.</li>`;
    return;
  }

  // 4) কার্ড বানানো
  list.innerHTML = "";
  top.forEach((p, idx) => {
    // index.html থেকে shop.html-এর রিলেটিভ লিংক (তোমার ফোল্ডার স্ট্রাকচার অনুযায়ী update করো)
    const toShop = "HTML/shop.html#shop";

    const li = document.createElement("li");
    li.innerHTML = `
      <a href="${toShop}" class="card-list link-tag" aria-label="${p.name}">
        <div class="card-wrap">
            <img src="${p.img}" alt="${p.name}" />
            <span class="badge-best">#${idx + 1} Best Seller</span>
            <h4>${p.name}</h4>
            <p>${p.gender ?? ""}</p>
            <p><strong>${formatPrice(p.price)}</strong></p>
        </div>
      </a>
    `;
    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderBestsellers(3); // চাইলে 3/4 দাও
});
//
//
//
//
//
//
//

//Countdown
const countdownFunction = setInterval(function () {
  // Get today's date and time
  const now = new Date().getTime();

  // Find the distance between now and the end date
  const distance = saleEndDate - now;

  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Function to ensure two digits (e.g., 9 -> 09)
  const pad = (num) => (num < 10 ? "0" + num : num);

  // Output the result in elements with specific IDs
  document.getElementById("days").innerHTML = pad(days);
  document.getElementById("hours").innerHTML = pad(hours);
  document.getElementById("minutes").innerHTML = pad(minutes);
  document.getElementById("seconds").innerHTML = pad(seconds);

  // If the countdown is finished, write some text
  if (distance < 0) {
    clearInterval(countdownFunction);
    document.getElementById("countdown").style.display = "none";
  }
}, 1000);

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

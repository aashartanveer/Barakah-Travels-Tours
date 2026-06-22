/* ===== Barakah Travels — Scripts ===== */
const WHATSAPP_NUMBER = "923056782156"; // +92 305 6782156

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  // Highlight current page in nav
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  // Set year in footer
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // Inject prices from prices.js (single source of truth)
  if (typeof PRICE_LIST !== "undefined") {
    document.querySelectorAll("[data-price]").forEach((el) => {
      const key = el.getAttribute("data-price");
      const pkg = PRICE_LIST.packages[key];
      if (pkg) {
        el.innerHTML = `PKR ${Number(pkg.price).toLocaleString("en-US")} <small>/ person</small>`;
      }
    });
    document.querySelectorAll("[data-updated]").forEach((el) => {
      el.textContent = PRICE_LIST.lastUpdated;
    });
  }

  // Build WhatsApp links from data attributes
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const msg = el.getAttribute("data-wa") || "Assalamu Alaikum, I would like to know more about your Umrah packages.";
    el.setAttribute("href", waLink(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Contact form -> WhatsApp
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const pkg = form.package.value;
      const people = form.people ? form.people.value.trim() : "";
      const message = form.message.value.trim();
      const text =
        `*New Umrah Inquiry — Barakah Travels*%0A%0A` +
        `*Name:* ${name}%0A` +
        `*Phone:* ${phone}%0A` +
        `*Package:* ${pkg}%0A` +
        (people ? `*Travellers:* ${people}%0A` : "") +
        (message ? `*Message:* ${message}` : "");
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    });
  }
});

function waLink(msg) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

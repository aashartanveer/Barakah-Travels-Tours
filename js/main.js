/* ===== Barakah Travels - Scripts ===== */
const WHATSAPP_NUMBER = "923056782156"; // +92 305 6782156

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

  // Show prices: first from prices.js (instant), then refresh from the
  // Google Sheet so the latest sheet prices always win.
  renderPrices();
  loadPricesFromSheet();

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
        `*New Umrah Inquiry - Barakah Travels*%0A%0A` +
        `*Name:* ${name}%0A` +
        `*Phone:* ${phone}%0A` +
        `*Package:* ${pkg}%0A` +
        (people ? `*Travellers:* ${people}%0A` : "") +
        (message ? `*Message:* ${message}` : "");
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    });
  }
});

function renderPrices() {
  if (typeof PRICE_LIST === "undefined") return;
  document.querySelectorAll("[data-price]").forEach((el) => {
    const key = el.getAttribute("data-price");
    const pkg = PRICE_LIST.packages[key];
    if (pkg && Number(pkg.price) > 0) {
      el.innerHTML = `PKR ${Number(pkg.price).toLocaleString("en-US")} <small>/ person</small>`;
    }
  });
  document.querySelectorAll("[data-updated]").forEach((el) => {
    el.textContent = PRICE_LIST.lastUpdated;
  });
}

/* Fetch latest prices from the published Google Sheet (CSV).
   Sheet layout (columns A and B):
     package , price
     7       , 250000
     15      , 340000
     21      , 360000
     updated , 23 June 2026
   If the sheet can't be reached, the prices.js values stay on screen. */
function loadPricesFromSheet() {
  if (typeof PRICE_LIST === "undefined" || !PRICE_LIST.sheetCsvUrl) return;
  // cache-buster so visitors always get the freshest sheet values
  const url = PRICE_LIST.sheetCsvUrl + (PRICE_LIST.sheetCsvUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
  fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error("sheet fetch failed");
      return r.text();
    })
    .then((csv) => {
      let changed = false;
      csv.split(/\r?\n/).forEach((line) => {
        const cells = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        // find the package key anywhere in the row; its value is the next cell
        for (let i = 0; i < cells.length - 1; i++) {
          const key = cells[i].toLowerCase();
          const val = cells.slice(i + 1).join(",").trim();
          if (key === "updated" && val) {
            PRICE_LIST.lastUpdated = val;
            changed = true;
            break;
          }
          if (PRICE_LIST.packages[key]) {
            const num = parseInt(cells[i + 1].replace(/[^0-9]/g, ""), 10);
            if (num > 0) {
              PRICE_LIST.packages[key].price = num;
              changed = true;
            }
            break;
          }
        }
      });
      if (changed) renderPrices();
    })
    .catch(() => { /* sheet unreachable - keep prices.js fallback values */ });
}

function waLink(msg) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

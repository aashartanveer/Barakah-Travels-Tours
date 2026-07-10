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

  initAnimations();

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

/* =====================================================================
   ANIMATIONS: scroll reveal, counters, navbar, floating ornaments
   ===================================================================== */
function initAnimations() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  // 1) Tag elements for scroll-reveal (no HTML changes needed)
  const groups = [
    ".section-head", ".card", ".pkg", ".quote", ".step",
    ".gallery a", ".faq details", ".split > *", ".contact-grid > *",
    ".cta-band", ".info-card"
  ];
  groups.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add("reveal");
      // stagger siblings slightly for a cascade effect
      el.style.setProperty("--rd", Math.min(i % 6, 4) * 0.12 + "s");
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // 2) Animated counters in the hero stats (570+, 10+, 24/7)
  document.querySelectorAll(".hero-stats .stat strong").forEach((el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    let started = false;
    const cio = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        const t0 = performance.now();
        const dur = 1600;
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        cio.disconnect();
      }
    }, { threshold: 0.5 });
    cio.observe(el);
  });

  // 3) Navbar elevation on scroll
  const nav = document.querySelector(".nav");
  const onScrollNav = () => nav && nav.classList.toggle("scrolled", window.scrollY > 40);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  // 4) Floating golden ornaments (crescents & stars) with scroll parallax
  const layer = document.createElement("div");
  layer.className = "bg-ornaments";
  layer.setAttribute("aria-hidden", "true");
  const symbols = ["☪", "✦", "✧", "✴", "✹"]; // ☪ ✦ ✧ ✴ ✹
  const count = window.innerWidth < 700 ? 10 : 18;
  const items = [];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    const inner = document.createElement("i");
    inner.textContent = symbols[i % symbols.length];
    s.appendChild(inner);
    const size = 12 + Math.random() * 22;
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.fontSize = size + "px";
    s.style.opacity = (0.25 + Math.random() * 0.5).toFixed(2);
    s.style.animationDuration = 7 + Math.random() * 9 + "s";
    s.style.animationDelay = -Math.random() * 10 + "s";
    layer.appendChild(s);
    items.push({ el: s, depth: 0.02 + Math.random() * 0.09 });
  }
  document.body.appendChild(layer);

  // parallax: ornaments drift at different speeds while scrolling
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      items.forEach((it) => {
        it.el.style.transform = "translateY(" + (-y * it.depth) + "px)";
      });
      ticking = false;
    });
  }, { passive: true });
}

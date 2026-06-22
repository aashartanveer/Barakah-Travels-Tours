# Barakah Travels — Owner's Guide

## 1. How to change prices (weekly / daily)

You only edit **ONE file**: `js/prices.js`

1. Open `js/prices.js` in any text editor (Notepad works).
2. Change the numbers next to `price:` — enter the **final price the customer sees** (your margin already included). No commas.
3. Change `lastUpdated` to today's date.
4. Save the file.
5. Re-upload `js/prices.js` to your host (or push to GitHub — see below).

Example:
```js
lastUpdated: "29 June 2026",
packages: {
  "7":  { price: 295000 },
  "15": { price: 345000 },
  "21": { price: 395000 }
}
```
The new prices appear automatically on the Home page and Packages page. You never touch the HTML.

> Remember: keep at least your **PKR 40,000 minimum margin** over your supplier's cost.

---

## 2. How to publish the website (free options)

### Easiest — Netlify Drop (no account setup needed to test)
1. Go to https://app.netlify.com/drop
2. Drag the whole `wesbite` folder onto the page.
3. It gives you a live link instantly. Create a free account to keep it.

### Recommended — GitHub + Netlify/Vercel (best for weekly updates)
1. Create a free GitHub account, upload this folder as a repository.
2. Connect it to Netlify or Vercel (free).
3. Every time you edit `prices.js` and push, the site updates automatically.

### Custom domain (looks professional)
- Buy a domain like `barakahtravels.com` (~PKR 3,000/year) from GoDaddy, Namecheap, or Hostinger.
- Connect it in Netlify/Vercel settings.
- **After you get the real domain**, tell me and I'll update the address inside
  `sitemap.xml`, `robots.txt` and the SEO tags in `index.html` (currently set to
  the placeholder `www.barakahtravels.com`).

---

## 3. How to appear in Google when people search "Umrah"

The website already has the technical SEO built in (page titles, descriptions,
keywords, structured data, sitemap, robots.txt). To actually rank:

1. **Google Search Console** — https://search.google.com/search-console
   - Add your website, verify ownership, and submit `sitemap.xml`.
   - This tells Google your site exists so it starts showing in results.
2. **Google Business Profile** — https://business.google.com
   - Free. Lets you appear on Google Maps and local searches like
     "Umrah agency near me". Very important for a travel business.
3. **Keep content fresh** — updating prices weekly actually helps SEO.
4. **Get reviews & backlinks** — ask happy customers to review you; share the
   site on Facebook/Instagram.

> ⚠️ Honest expectation: SEO is not instant. Showing up for a competitive word
> like "Umrah" takes weeks to months and ongoing effort. Google Ads (paid) can
> put you at the top immediately if you have a budget. Tell me if you want me to
> set up an ads-ready landing section.

---

## File structure
```
wesbite/
├── index.html        Home
├── packages.html     Packages (prices)
├── services.html     Services
├── about.html        About
├── gallery.html      Gallery
├── contact.html      Contact + enquiry form
├── css/style.css     All styling
├── js/prices.js      ← EDIT THIS for prices
├── js/main.js        Site logic (don't need to edit)
├── images/logo.svg   Logo
├── sitemap.xml       For Google
└── robots.txt        For Google
```

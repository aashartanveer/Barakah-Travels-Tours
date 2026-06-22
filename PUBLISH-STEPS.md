# Publish Barakah Travels FREE on GitHub Pages

Your website is already a git repository with everything committed.
Follow these one-time steps to put it online for **free** (no domain cost).
Your free address will look like: `https://YOUR-USERNAME.github.io/barakah-travels/`

---

## Step 1 — Create a free GitHub account
Go to https://github.com/signup and sign up (use your email: aashartanveer56@gmail.com).

## Step 2 — Create an empty repository
1. Click the **+** (top right) → **New repository**.
2. Repository name: **barakah-travels**
3. Keep it **Public** (required for free Pages).
4. Do **NOT** tick "Add a README".
5. Click **Create repository**.

## Step 3 — Upload your website
GitHub will show a page with a URL like `https://github.com/YOUR-USERNAME/barakah-travels.git`.
Open a terminal in the `wesbite` folder and run (replace YOUR-USERNAME):

```bash
git remote add origin https://github.com/YOUR-USERNAME/barakah-travels.git
git push -u origin main
```
It will ask you to log in to GitHub — approve it in the browser.

> **Even easier (no terminal):** on the empty repo page click
> **"uploading an existing file"**, then drag in ALL files and folders from the
> `wesbite` folder, and click **Commit changes**.

## Step 4 — Turn on GitHub Pages
1. In your repository go to **Settings → Pages**.
2. Under **Source**, choose **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**. Click **Save**.
4. Wait ~1 minute. The page will show your live link:
   **https://YOUR-USERNAME.github.io/barakah-travels/**

🎉 Your website is now LIVE and free.

---

## Updating prices later (auto-deploy)
1. Edit `js/prices.js` (and the `lastUpdated` date).
2. Run:
   ```bash
   git add -A
   git commit -m "Update weekly prices"
   git push
   ```
   (or re-upload the file via the GitHub website)
3. The live site updates automatically in about a minute.

---

## ⚠️ After you know your live link — tell me!
Right now the SEO files use a placeholder address (`www.barakahtravels.com`).
Once you have your real `https://YOUR-USERNAME.github.io/barakah-travels/` link,
send it to me and I'll fix the address inside:
- `sitemap.xml`
- `robots.txt`
- the canonical + Open Graph tags in `index.html`

Then submit your site to **Google Search Console**
(https://search.google.com/search-console) and add a free
**Google Business Profile** (https://business.google.com) so people can find you.

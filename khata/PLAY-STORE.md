# Publishing My Khata on the Google Play Store

The app is already a full PWA (installable, offline, icons, manifest), which is exactly
what the Play Store accepts via "Trusted Web Activity" (TWA). The easiest path is
**PWABuilder** — no coding needed.

## What you need

1. **Google Play Console developer account** — one-time $25 fee at
   https://play.google.com/console/signup (must be created by you, with your Google account).
2. The live app URL: `https://aashartanveer.github.io/Barakah-Travels-Tours/khata/`

## Steps

### 1. Generate the Android app package
1. Go to https://www.pwabuilder.com
2. Paste the app URL above and click **Start**.
3. It will score the PWA (manifest ✅, service worker ✅, HTTPS ✅ are already done).
4. Click **Package for Stores** → **Android** → **Generate Package**.
   - Package ID: e.g. `com.aashar.mykhata`
   - App name: `My Khata`
   - Keep "Signing key: New" (PWABuilder creates one — DOWNLOAD AND KEEP the
     `signing.keystore` + passwords file safe; you need it for every future update).
5. Download the `.aab` file (Android App Bundle) + the `assetlinks.json` it gives you.

### 2. Prove you own the website (Digital Asset Links)
The Android app must be linked to your domain or it will show a browser address bar.

- PWABuilder gives you an `assetlinks.json` file after packaging.
- It must be served at: `https://aashartanveer.github.io/.well-known/assetlinks.json`
- Because that's the ROOT of your github.io domain (not inside Barakah-Travels-Tours),
  create a repo named exactly **`aashartanveer.github.io`** on GitHub, add the file at
  `.well-known/assetlinks.json`, and enable GitHub Pages on it.
  (Ask Claude to do this step when you have the file.)

### 3. Upload to the Play Console
1. In Play Console: **Create app** → name `My Khata`, App, Free.
2. Complete the required forms:
   - **Privacy policy** — required because the app has login. (Ask Claude to generate
     a privacy policy page for the website.)
   - **Data safety** — declare: email address collected (account), ledger data stored
     in Firestore, not shared with third parties, encrypted in transit, deletable on request.
   - Content rating questionnaire (Finance/Utility, no objectionable content → rated 3+).
3. **Production → Create release** → upload the `.aab` → review → **Roll out**.
4. Review usually takes 1–7 days for a new developer account.

## Updating the app later
Website changes (HTML/JS) go live instantly for everyone — no Play Store update needed!
You only re-package and re-upload if you change the app name, icon, or manifest.

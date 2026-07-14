# Cloud Sync Setup (5 minutes, free)

This lets you (and anyone using the app) **log in with email + password** and have the khata
saved to the account — log in on any phone and all data appears automatically.

Without this setup the app still works fully, just offline-only on each device.

## Steps

1. Go to https://console.firebase.google.com and sign in with your Google account.
2. Click **Add project** → name it `my-khata` → disable Analytics → **Create project**.
3. In the left menu open **Build → Authentication → Get started**:
   - Enable **Email/Password** and save.
4. Open **Build → Firestore Database → Create database**:
   - Choose **Start in production mode**, any location, **Create**.
   - Go to the **Rules** tab and replace the rules with:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /khata/{userId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
     ```
   - Click **Publish**. (This means each user can only read/write their OWN khata.)
5. Click the ⚙️ **Project settings** (top-left gear) → scroll to **Your apps** →
   click the **</> (Web)** icon → register app (any nickname) → you'll see a
   `firebaseConfig = { ... }` block.
6. Open `khata/firebase-config.js` in this project:
   - Copy each value from the console into `FIREBASE_CONFIG`.
   - Change `FIREBASE_ENABLED = false` to `true`.
7. Push the site to GitHub Pages. Done — the app now shows a **Login** button.

## Notes

- **Phone-number OTP login** is also supported by Firebase but Google now requires a
  billing card on file for SMS. Email login is 100% free, so the app uses email —
  users can still save their phone number in their profile.
- Data syncs automatically a moment after every change, and pulls the latest copy on login.
- The free tier (50k reads / 20k writes per day) is far more than a khata app needs.

# 🔥 Campus Bites — College Food Ordering Website

A complete, production-ready frontend for a college canteen food ordering system.
Built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no build step needed.

---

## 📁 Project Structure

```
campus-bites/
├── index.html          ← Main entry point
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── data.js         ← Menu items & config  ← EDIT THIS to change the menu
│   ├── cart.js         ← Cart state & UI
│   ├── menu.js         ← Menu rendering & search/filter (no re-render bug)
│   ├── checkout.js     ← Checkout & success pages
│   └── app.js          ← App controller & routing
└── README.md
```

---

## 🚀 How to Run Locally

### Option 1 — Just open it
Double-click `index.html`. Works in any modern browser.

### Option 2 — Local dev server (recommended)
```bash
# If you have Node.js installed:
npx serve .

# Or with Python:
python3 -m http.server 8080
# Then open http://localhost:8080
```

---

## ✏️ How to Customize

### Change the menu
Edit `js/data.js`. Each item looks like:
```js
{ id: 1, name: "Masala Maggi", desc: "...", price: 50, emoji: "🍜", cat: "Snacks", veg: true }
```
- `cat` must match one of the values in `CATEGORIES`
- `veg: true` shows a green dot; `false` shows red

### Change canteen name / UPI
Also in `js/data.js`:
```js
const CANTEEN_NAME = "Campus Bites";
const CANTEEN_UPI  = "campusbites@ybl";    // ← your actual UPI ID
const CANTEEN_OPEN = "8:00 AM – 9:00 PM";
const DELIVERY_FEE = 20;
```

### Change colors / fonts
Edit the `:root` variables at the top of `css/style.css`.

---

## 💳 Adding Real Payments (Razorpay)

1. Sign up at https://razorpay.com → Dashboard → Get Test Keys
2. Add this before `</body>` in `index.html`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
3. In `js/checkout.js`, replace the `_placeOrder` function's card section with:
   ```js
   const options = {
     key: "rzp_test_YOUR_KEY_HERE",   // ← your Razorpay key
     amount: (Cart.getSubtotal() + DELIVERY_FEE) * 100, // in paise
     currency: "INR",
     name: CANTEEN_NAME,
     description: "Food Order",
     handler: function(response) {
       // response.razorpay_payment_id = payment ID
       SuccessPage.render(name, "CB" + Date.now());
       App.showPage("success");
     },
     prefill: { name, contact: phone }
   };
   new Razorpay(options).open();
   ```
4. For production, move to server-side order creation using Razorpay's Node/Python SDK.

---

## 🌐 Deployment

### Option A — Vercel (recommended, free)
```bash
npm install -g vercel
cd campus-bites
vercel
# Follow the prompts. Your site is live in ~30 seconds.
```

### Option B — Netlify (free, drag & drop)
1. Go to https://netlify.com
2. Drag the entire `campus-bites/` folder onto the deploy zone
3. Done — you get a live URL instantly

### Option C — GitHub Pages (free)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campus-bites.git
git push -u origin main
# Then go to repo Settings → Pages → Deploy from main branch
```

### Option D — Firebase Hosting (free, great for future backend)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to: . (current folder)
# Single page app: No
firebase deploy
```

---

## 📱 Converting to a Mobile App

### Option 1 — PWA (easiest — 30 min effort)
Add a `manifest.json` and `sw.js` (service worker) so users can
"Add to Home Screen" on Android & iOS from Chrome/Safari.

### Option 2 — Capacitor (wraps this exact code into a real app)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "Campus Bites" "com.campusbites.app"
npx cap add android
npx cap add ios
npx cap copy
npx cap open android  # Opens Android Studio
npx cap open ios      # Opens Xcode
```
No code changes needed — Capacitor wraps the HTML/CSS/JS as-is.

### Option 3 — React Native (most powerful, requires rewrite)
Best if you plan to add push notifications, GPS tracking, camera features.

---

## 🔧 Recommended Backend Stack (for real orders)

| What | Tool | Why |
|------|------|-----|
| Database | Firebase Firestore | Real-time, free tier, easy |
| Auth | Firebase Auth | Google/email login |
| File storage | Firebase Storage | Upload menu photos |
| Payments | Razorpay | Best UPI support in India |
| Admin panel | Firebase Console | View orders in real-time |

### Basic Firestore order saving
```js
// Install: npm install firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const app = initializeApp({ /* your config */ });
const db  = getFirestore(app);

async function saveOrder(orderData) {
  const ref = await addDoc(collection(db, "orders"), {
    ...orderData,
    createdAt: new Date(),
    status: "pending"
  });
  return ref.id;
}
```

---

## 🐛 Known Intentional Choices

- **No backend** — this is a frontend-only demo. Orders are not persisted.
- **Card payment** — fields are UI-only. Connect Razorpay for real transactions.
- **UPI verification** — UTR entry is manual. Automate with Razorpay UPI API.

---

Built with ❤️ for students. MIT License.

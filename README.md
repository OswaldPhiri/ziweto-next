# Ziweto Market

A dedicated e-commerce platform and digital marketplace built for the **Ziweto Enterprise** network in Malawi. This application bridges the gap between rural smallholder farmers and vital agribusiness services by offering a modernized digital storefront for livestock, veterinary drugs, animal feed, poultry, and farming equipment. 

Buyers can easily browse localized agrovet listings, filter by categories or prices, and seamlessly contact sellers or franchised agrovet shops directly via WhatsApp for inquiries and purchasing. Built with modern web technologies to ensure speed and accessibility even on limited data networks.

---

## What's built (Phase 1)

- Product listing page with grid, search, category filters, price filter, and sort
- Product detail page with image gallery, full description, and WhatsApp contact button
- Seller profile page showing all listings from one seller
- Admin panel with Firebase Auth login and full add/edit/delete for listings
- Demo products shown automatically until Firebase is connected
- Server-side rendering — fast first load, full SEO per product page
- Loading skeletons so slow 3G connections never show a blank screen
- Mobile-first, optimised for Android phones on limited data

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (Email/Password) |
| Hosting | Vercel |
| Images | Next.js Image (auto-optimised) |
| Language | TypeScript |

---

## Folder structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage — server rendered
│   ├── loading.tsx                 # Skeleton shown on 3G while page loads
│   ├── error.tsx                   # Error boundary
│   ├── not-found.tsx               # 404 page
│   ├── layout.tsx                  # Root layout, fonts, metadata
│   ├── globals.css                 # Tailwind + custom component classes
│   ├── sitemap.ts                  # Auto-generated /sitemap.xml for SEO
│   ├── robots.ts                   # /robots.txt
│   ├── products/[id]/
│   │   ├── page.tsx                # Product detail — server rendered
│   │   ├── loading.tsx             # Skeleton
│   │   └── error.tsx               # Error boundary
│   ├── seller/[id]/
│   │   └── page.tsx                # Seller profile — server rendered
│   ├── admin/
│   │   └── page.tsx                # Admin panel shell
│   └── api/
│       ├── products/route.ts       # GET all, POST new (auth required)
│       ├── products/[id]/route.ts  # GET one, PUT, DELETE (auth required)
│       └── seller/[id]/route.ts    # GET products by seller
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── WhatsAppIcon.tsx
│   ├── ProductCard.tsx
│   ├── ProductGallery.tsx          # Thumbnail image switcher
│   ├── ProductGrid.tsx             # Client-side filters + search
│   ├── ProductSkeleton.tsx         # Loading skeletons
│   └── AdminPanel.tsx              # Full CRUD admin UI
├── lib/
│   ├── firebase-client.ts          # Browser Firebase (auth only)
│   ├── firebase-admin.ts           # Server Firebase (never sent to browser)
│   ├── demo-products.ts            # Shown before Firebase is configured
│   └── utils.ts                    # formatPrice, buildWhatsAppLink, etc.
├── types/
│   └── index.ts                    # Shared TypeScript types
└── middleware.ts                   # Security headers on every request
```

---

## Local development setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

The site works immediately with demo data — you do not need Firebase to test locally. The `.env.local` file only matters when you want to go live with real data.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Firebase setup (required for live data)

### Step 1 — Create a Firebase project

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click **Get started** → **Add project**
3. Give it a name (e.g. `ziweto-market`)
4. You can disable Google Analytics — it is not needed

### Step 2 — Enable Firestore

1. In the Firebase Console sidebar: **Build → Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (you will tighten this with security rules in Step 5)
4. Choose a region — `eur3` (Europe) works well for Malawi

### Step 3 — Enable Authentication

1. In the sidebar: **Build → Authentication**
2. Click **Get started**
3. Under **Sign-in method**, enable **Email/Password**
4. Go to the **Users** tab → **Add user**
5. Enter your email address and a strong password — this is your admin login

### Step 4 — Get your Firebase config keys

1. Go to **Project Settings** (gear icon at the top of the sidebar)
2. Scroll down to **Your apps** → click **Add app** → choose the **Web** icon (`</>`)
3. Register the app (any nickname is fine)
4. Copy the `firebaseConfig` object — you need these values for `.env.local`

### Step 5 — Get your Admin SDK private key

This key is used server-side only and is never sent to the browser.

1. Still in **Project Settings** → click the **Service accounts** tab
2. Click **Generate new private key** → **Generate key**
3. A `.json` file will download — open it in a text editor
4. You need three values from it: `project_id`, `client_email`, and `private_key`

### Step 6 — Fill in your .env.local

Open `.env.local` and fill in every value:

```
NEXT_PUBLIC_FIREBASE_API_KEY=         # from Step 4: apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=     # from Step 4: authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=      # from Step 4: projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=  # from Step 4: storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= # from Step 4: messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=          # from Step 4: appId

FIREBASE_ADMIN_PROJECT_ID=            # from Step 5 JSON: project_id
FIREBASE_ADMIN_CLIENT_EMAIL=          # from Step 5 JSON: client_email
FIREBASE_ADMIN_PRIVATE_KEY=           # from Step 5 JSON: private_key
                                      # Wrap the entire key in double quotes

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 7 — Set Firestore security rules

1. In Firebase Console: **Firestore → Rules** tab
2. Delete all existing content and paste the contents of `firestore.rules`
3. Click **Publish**

---

## Deploying to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/ziweto-market.git
git push -u origin main
```

### Step 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Click **Import** next to your GitHub repository
3. Leave all build settings as default — Vercel detects Next.js automatically
4. Click **Deploy** — the first deploy will fail because env vars are missing. That is expected.

### Step 3 — Add environment variables on Vercel

1. Go to your project on Vercel → **Settings → Environment Variables**
2. Add every variable from your `.env.local` file, one by one
3. For `NEXT_PUBLIC_BASE_URL`, set the value to your actual Vercel domain:
   `https://your-project-name.vercel.app`
4. Also add `FIREBASE_ADMIN_PRIVATE_KEY` — paste the full private key including
   the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines,
   wrapped in double quotes

### Step 4 — Redeploy

1. Go to **Deployments** tab → click the three dots on the latest deployment → **Redeploy**
2. Your site is now live

---

## Adding your first listing (after Firebase is live)

1. Go to `your-site.vercel.app/admin`
2. Sign in with the email and password you created in Firebase Auth
3. Click **Add Listing**
4. Fill in the product details — for the image, upload your photo to [imgbb.com](https://imgbb.com) (free) and paste the direct link
5. Click **Add Listing** — it appears on the homepage within 60 seconds

---

## How security works

| Action | Who can do it | How it's protected |
|---|---|---|
| View listings | Anyone | Public |
| View a product | Anyone | Public |
| Add/edit/delete listing | Admin only | Firebase Auth token verified server-side in API route |
| API writes | Admin only | `Authorization: Bearer <token>` header checked with Firebase Admin SDK |
| Admin page | Admin only | Firebase Auth in AdminPanel — unauthenticated users see a login form |
| Firestore direct access | Anyone (read) / Auth (write) | Firestore security rules (second layer) |

---

## Phase 2 — What's coming

The codebase is structured to support these without major rewrites:

- User accounts for buyers and sellers
- Seller listing submission form (public — no admin needed)
- Middleman / escrow payment flow
- Airtel Money and TNM Mpamba integration (Malawi mobile money)
- Seller ratings and reviews
- In-app messaging to replace WhatsApp
- Push notifications
- Search with autocomplete

---

## Changing the admin password

The admin password is managed by Firebase Authentication, not in code. To change it:

1. Firebase Console → **Authentication → Users**
2. Click the three dots next to your admin user → **Reset password**

Or sign in to the admin panel and use the Firebase "forgot password" flow.

---

## Common issues

**The site shows demo products even after I set up Firebase.**
- Check that all `NEXT_PUBLIC_FIREBASE_*` values in `.env.local` are correct
- Restart the dev server after changing `.env.local`
- Make sure Firestore is in test mode or your security rules allow reads

**Admin login says "Incorrect email or password."**
- Double-check the credentials you added in Firebase Authentication → Users
- Make sure Email/Password sign-in is enabled under Sign-in method

**Images are not loading.**
- Paste the direct image URL (ending in `.jpg`, `.png`, etc.) — not a page URL
- [imgbb.com](https://imgbb.com) gives you a direct link after uploading

**On Vercel, the site loads but shows no products.**
- Make sure `NEXT_PUBLIC_BASE_URL` is set to your actual Vercel domain
- Check that all Firebase Admin env vars are set in Vercel → Settings → Environment Variables
- Redeploy after adding env vars

---

## Image uploads (Cloudinary)

Product images are uploaded directly from the admin panel to Cloudinary, a free image hosting service. Images are automatically compressed and optimised before being stored.

### Setup (free, takes 2 minutes)

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account — no credit card needed
2. From your Cloudinary Dashboard, copy three values: **Cloud name**, **API key**, and **API secret**
3. Add them to your `.env.local`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Add the same three variables to Vercel → Settings → Environment Variables

### How it works

- In the admin panel, click the image upload area or drag a photo onto it
- The image uploads directly from your browser to Cloudinary
- A progress bar shows the upload status
- Once done, the image URL is filled in automatically
- If Cloudinary is not set up, you can still paste an image URL manually in the fallback field below the upload area

### Free tier limits

Cloudinary's free tier gives you 25GB of storage and 25GB of monthly bandwidth — more than enough for a Phase 1 marketplace.

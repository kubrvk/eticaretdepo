# ETicaretDepo

![React](https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61dafb)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-ffca28?logo=firebase&logoColor=black)
![Status](https://img.shields.io/badge/status-active-success)

ETicaretDepo is a React and Firebase based B2B-oriented e-commerce and warehouse management project.  
It combines a storefront, dealer account flow, product catalog management, and an admin-side order operations panel inside a single application.

The project is built around a distributor / dealer workflow rather than a simple consumer storefront. Products carry both retail and dealer pricing, orders move through a staged operational pipeline, and account data is reused during checkout instead of collecting delivery details repeatedly on every order.

---

## Overview

The application has two main surfaces.

The storefront side includes the public catalog, product detail pages, cart, authentication, account center, and checkout flow. Users can register as dealers, manage their profile, review previous orders, and place new orders using their saved account information.

The admin side includes product management, stock-related fields, multi-image product editing, and order operations. Orders are not treated as a single flat status value; instead, they move through approval, payment, warehouse preparation, shipment, and delivery stages. Operational mistakes are handled through archiving and restore flows instead of hard deletion.

---

## Current Feature Set

The current implementation includes a multi-category product catalog with category and subcategory support, detailed product descriptions, product galleries, dealer pricing, minimum order quantities, and warehouse-related fields such as stock, reserved stock, threshold values, location, and supplier metadata.

Authentication supports dealer registration and admin access. A seeded demo admin account is available for testing:

- `admin@eticaretdepo.com`
- `admin1234`

Dealer accounts are created through the registration screen and enter the system with dealer permissions by default.

Checkout is account-driven. Anonymous users cannot place orders. Authenticated users are required to keep their account profile complete, and checkout uses that saved profile directly. If required fields are missing, the user is redirected to the account page rather than being asked to fill a separate checkout form.

---

## Product Model

Products are structured to support a more realistic wholesale and marketplace workflow. In addition to the basic catalog fields, each product stores dealer-specific and operational metadata.

```js
{
  id: "1",
  sku: "SKU-1001",
  name: "Apple iPhone 15 Pro 128 GB",
  brand: "Apple",
  category: "Elektronik",
  subcategory: "Tüketici Elektroniği",
  price: 64999,
  wholesalePrice: 62150,
  stock: 45,
  reserved: 12,
  threshold: 20,
  minOrderQty: 1,
  supplier: "Apple Distribütör",
  location: "A-01",
  channel: "Pazaryeri + Bayi",
  description: "Product description",
  image: "main image",
  images: ["main image", "gallery image 1", "gallery image 2"]
}
```

The admin panel supports multiple uploaded product images. The first image is used as the primary product image, while the remaining images are displayed as gallery thumbnails on the product detail page.

---

## Order Flow

Orders are modeled as an operational workflow rather than a single status label. The current system separates approval, payment, fulfillment, and shipment steps. This makes the panel closer to a real internal operations view, especially for dealer and bulk orders.

The typical order lifecycle is:

`Pending Approval -> Approved -> Payment Received -> Sent to Warehouse -> Preparing -> Packed -> Shipped -> Delivered`

Orders can also be removed from the active workflow and archived. Archived orders remain recoverable from the admin panel.


---

## Architecture

The codebase is intentionally simple and page-oriented. Routing is handled in `App.jsx`, storefront pages live under `src/pages/shop`, admin pages under `src/pages/admin`, and authentication pages under `src/pages/auth`. Shared state is handled through Zustand stores, while service modules are responsible for auth, accounts, products, and orders.

```text
src/
├── pages/
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ProductManagement.jsx
│   │   └── OrderManagement.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   └── shop/
│       ├── ShopLayout.jsx
│       ├── HomePage.jsx
│       ├── ProductDetail.jsx
│       ├── Cart.jsx
│       ├── Checkout.jsx
│       └── AccountPage.jsx
├── services/
│   ├── accountService.js
│   ├── authService.js
│   ├── productService.js
│   ├── orderService.js
│   └── mockData.js
├── store/
│   ├── useAuthStore.js
│   └── useCartStore.js
├── App.jsx
└── firebase.js
```

---

## Data Strategy

The project uses Firebase Auth and Firestore where available, but it also includes local fallback behavior so development and demos do not break entirely when Firebase write access is unavailable.

Products, orders, and account-related data attempt to use Firebase first. If an operation fails in environments where Firebase writes are incomplete or restricted, parts of the application fall back to `localStorage`. This is not intended as a production-grade persistence model, but it keeps the project usable during iteration.

One important limitation is image handling. Product image uploads currently behave like a direct upload flow in the UI, but the uploaded files are processed in the browser and stored as data URLs rather than being sent to Firebase Storage. This is acceptable for prototyping and visual testing, but not for a production deployment.

---

## Catalog Direction

The sample catalog is designed to feel closer to wholesale and dealer inventory than to a narrow demo shop. It includes electronics, fashion, cleaning products, baby products, food, office supplies, phone accessories, and small appliances. The intent is to represent a mixed marketplace / distributor environment where both fast-moving consumer goods and higher-ticket items coexist.

---

## Development

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The Vite configuration serves the app on `127.0.0.1`, and production output is generated in `dist/`.

---

## Notes

The project is functional, but it is still clearly in an intermediate stage rather than a finalized production system. The current implementation would benefit from Firebase Storage integration for real media uploads, a proper Firestore-backed user role model, improved search and filtering, a dedicated order detail page, stronger reporting on the dashboard, and bundle-size optimization through code splitting.

At its current stage, the repository is best understood as a working B2B e-commerce / operations prototype with real UI flows, realistic entity modeling, and a practical admin workflow rather than as a finished commercial product.

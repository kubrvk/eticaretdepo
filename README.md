# ETicaretDepo

<img align="left" width="40%" src="https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret1.PNG"/>
<h3> 
  <a href="https://eticaretdepo.web.app">
    <img src="https://img.shields.io/badge/Live Demo: https://eticaretdepo.web.app-042621?style=flat-square&logo=googlechrome&logoColor=white" height="25"/> 
  </a>
</h3>

![React](https://img.shields.io/badge/React-19-20232a?style=flat-square&logo=react&logoColor=61dafb) ![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-ffca28?style=flat-square&logo=firebase&logoColor=black) ![Status](https://img.shields.io/badge/status-active-success?style=flat-square) 
<br>

ETicaretDepo is a React and Firebase based B2B-oriented e-commerce and warehouse management project. It combines a storefront, dealer account flow, product catalog management, and an admin-side order operations panel inside a single application.

The project is built around a distributor / dealer workflow rather than a simple consumer storefront. Products carry both retail and dealer pricing, orders move through a staged operational pipeline, and account data is reused during checkout instead of collecting delivery details repeatedly on every order.
<br clear="left"/>

<br/>

<p align="center">
<img src="https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret2.PNG" width="24%"/><img src="https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret3.PNG" width="24%"/><img src="https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret4.PNG" width="24%"/><img src="https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret5.PNG" width="24%"/>
</p>

---

## 🛠️ Technical Details

| Layer | Technology |
|---|---|
| **Core Framework** | React 19 / Vite 6 |
| **Authentication** | Firebase Auth |
| **Database** | Firestore (with LocalStorage fallback) |
| **State Management**| Zustand |
| **Routing** | React Router |

---

## 🚀 Core Features

### 1. Storefront & Dealer Accounts
![image](https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret6.PNG)

- **Public Catalog:** Browse categories, subcategories, and detailed product galleries.
- **Dealer Flow:** Registration system for dealers. Authenticated users benefit from account-driven checkout without repetitive forms.
- **Pricing Model:** Products carry both retail and wholesale/dealer pricing structures along with minimum order quantities.

### 2. Admin & Warehouse Operations
![image](https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret7.PNG)

- **Product Management:** Full control over catalog fields, stock levels, reserved stock, thresholds, supplier metadata, and multiple image galleries.
- **Order Pipeline:** Orders are not just a simple status; they move through realistic operational stages:
  <br> `Pending Approval ➔ Approved ➔ Payment Received ➔ Sent to Warehouse ➔ Preparing ➔ Packed ➔ Shipped ➔ Delivered`

---

## 🔐 Demo Access

A seeded demo admin account is available for testing the admin panel:
- **Email:** `admin@eticaretdepo.com`
- **Password:** `admin1234`

---

## 💻 Installation & Development

To run the project locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/kubrvk/eticaretdepo.git

# Navigate into the directory
cd eticaretdepo

# Install dependencies
npm install

# Start the local development server
npm run dev
```

**Production Build:**
```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```
*The Vite configuration serves the app on `127.0.0.1`, and production output is generated in the `dist/` directory.*

---

## 📸 Application Gallery

<p align="center">
<img src="https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret8.PNG" width="24%"/>
<img src="https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret9.PNG" width="24%"/>
<img src="https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret10.PNG" width="24%"/>
<img src="https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret11.PNG" width="24%"/>
</p>
<p align="center">
<img src="https://raw.githubusercontent.com/kubrvk/portfolio/main/img/galeri/eticaret12.PNG" width="90%"/>
</p>

---

## 👤 Developer

**Kubrik**

[GitHub](https://github.com/kubrvk)

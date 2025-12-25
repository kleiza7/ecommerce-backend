# 🔐 E‑Commerce Backend (Phase‑1)

**Production API:**  
https://ecommerce-backend-z39w.onrender.com/

Modern, scalable, and production‑ready backend application built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** for a full‑featured E‑Commerce platform.

This backend works together with the frontend application:  
➡️ https://github.com/kleiza7/ecommerce-frontend

---

## ✨ What Was Built (Phase‑1)

This project reflects real‑world production backend architecture and deployment concerns.

### ✅ Core Highlights

- 🔑 JWT Authentication
- 👤 Role‑based authorization (USER / SELLER)
- 📦 Products, Categories, Brands domain modeling
- 🛒 Shopping Cart with quantity & price snapshot logic
- 🧠 Clean Router → Controller → Service architecture
- 🧱 Prisma ORM (SQLite dev, PostgreSQL ready)
- 🛡 Global error handling
- 💯 Strict TypeScript typing
- 🌍 Environment‑aware file handling (Local / CDN)

---

## 🧠 Architecture

```
Router → Controller → Service → Prisma
```

- Controllers handle HTTP only
- Services contain business logic
- Utilities are environment‑agnostic

---

## 🖼 Image Handling

### Local Development

- Stored under `/uploads`
- Automatic resizing (original / thumb / medium / large)

### Production

- Cloudinary CDN
- URLs stored in database
- No filesystem dependency

Same codebase — behavior controlled by `NODE_ENV`.

---

## 🌱 Seeding

- Deterministic seed
- Shared dummy images
- Minimal disk & CDN usage
- Works in both local & production

---

## ⚙️ Environment Setup

```bash
cp .env.example .env
```

```ini
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
PORT=5000
```

---

## 🚀 Local Run

```bash
npm install
npx prisma generate
npm run reset:db
npm run dev
```

---

## 📌 Phase‑1 Completed

✔ Auth  
✔ Products / Categories / Brands  
✔ Cart  
✔ Image handling (Local + CDN)  
✔ Seeding  
✔ Production deploy

---

## 📄 License

MIT

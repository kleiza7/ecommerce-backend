# 🔐 E-Commerce Backend (Phase-1)

**Production API:**  
https://shopland-backend-z39w.onrender.com/

Modern, scalable, and production-ready backend application built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** for a full-featured E-Commerce platform.

This backend works together with the frontend application:  
➡️ https://github.com/kleiza7/shopland-frontend

---

## ✨ What Was Built (Phase-1)

This project reflects **real-world production backend architecture** and deployment concerns rather than a simple CRUD demo.

### ✅ Core Highlights

- 🔑 JWT Authentication
- 👤 Role-based authorization (USER / SELLER)
- 📦 Products, Categories, Brands domain modeling
- 🛒 Shopping Cart with quantity & price snapshot logic
- 🧠 Clean **Router → Controller → Service** architecture
- 🧱 Prisma ORM (SQLite dev, PostgreSQL ready)
- 🛡 Global error handling
- 💯 Strict TypeScript typing
- 🌍 Environment-aware image handling (Local filesystem / Cloudinary CDN)

---

## 🧠 Architecture Overview

```
Router → Controller → Service → Prisma
```

- Controllers handle HTTP concerns only
- Services contain business logic
- Utilities handle environment-specific behavior

---

## 🖼 Image Handling Strategy

### Local Development

- Images stored under `/uploads`
- Automatic generation of:
  - original
  - thumb
  - medium
  - large
- URLs served via Express static middleware

### Production

- Images uploaded to **Cloudinary CDN**
- CDN URLs stored directly in database
- No filesystem dependency

Same codebase — behavior controlled only by `NODE_ENV`.

---

## 🌱 Database Seeding

- Deterministic seed logic
- Uses **4 shared dummy images**
- Reused across all products
- Results in:
  - Minimal disk usage (local)
  - Minimal CDN usage (production)
- Seed works in **both local and production environments**

---

## 🛒 Cart Logic

- Per-user cart
- Quantity control
- Price snapshot stored at add-to-cart time
- Ready for:
  - cart merge (guest → authenticated)
  - stock validation

---

## ⚙️ Environment Setup

A `.env.example` file is included.

```bash
cp .env.example .env
```

### Required Environment Variables

```ini
# Server
PORT=5000

# Auth
JWT_SECRET=your_jwt_secret

# Database
DATABASE_URL="file:./dev.db"

# Base URL (used for absolute image URLs)
BASE_URL=http://localhost:5000

# Environment
NODE_ENV=development

# Cloudinary (production only)
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

> ℹ️ In production, images are uploaded to Cloudinary and their URLs are saved in the database automatically.

---

## 🚀 Running Locally

```bash
npm install
npx prisma generate
npm run reset:db
npm run dev
```

Server will run at:

```
http://localhost:5000
```

---

## 🚀 Production Notes

- Clean CI-safe TypeScript build
- Deterministic deploy behavior
- CDN-based asset handling
- Stateless backend design
- Ready for horizontal scaling

---

## 📌 Phase-1 Scope (Completed)

✔ Authentication & Roles  
✔ Products / Categories / Brands  
✔ Shopping Cart  
✔ Image handling (Local + CDN)  
✔ Robust seeding strategy  
✔ Production deployment

**Phase-2** will include:

- Orders
- Payments
- Stock synchronization
- Cart merge
- WebSocket updates

---

## 📄 License

MIT

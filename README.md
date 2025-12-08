# 🔐 E-Commerce Backend

Modern and scalable backend application built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** for an E‑Commerce platform.

This backend works together with the frontend application:  
➡️ https://github.com/kleiza7/ecommerce-frontend

---

## ✨ Overview

Core features included in this backend:

- 🔑 JWT authentication  
- 👤 Role-based access (USER / SELLER)  
- 📦 Product / Category / Brand management  
- 🛒 Shopping Cart functionality  
- 🧠 Clean Service → Controller → Router architecture  
- 🧱 Prisma ORM (SQLite dev, PostgreSQL ready)  
- 🛡 Global error handling  
- 💯 Fully typed with TypeScript  

---

## 🧩 Controllers Summary

### 🔐 Auth Controller
- Register new users  
- Login and return JWT  
- Access protected profile  

### 📦 Products Controller
- Create, update, delete products (SELLER only)  
- List products  
- Retrieve product details  

### 🏷 Categories Controller
- Full CRUD operations  

### 🏭 Brands Controller
- Full CRUD operations  

### 🛒 Cart Controller
- Get user cart  
- Add items  
- Update item quantity  
- Remove items  

---

## 🗄 Database

- Uses **SQLite** for development  
- Fully compatible with **PostgreSQL**  
- Switch by updating `DATABASE_URL` in `.env`  

---

## ⚙️ Environment Setup

A `.env.example` file is included.

Create your environment file:

```bash
cp .env.example .env
```

Fill in the required variables:

```ini
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
PORT=5000
```

---

## 🚀 Running the Project

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run seed   # optional
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

## 🤝 Contributing

Contributions and pull requests are welcome.

---

## 📄 License

MIT

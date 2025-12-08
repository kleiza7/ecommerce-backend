# E-Commerce Backend

This repository contains a scalable backend application built for an E-Commerce platform using Node.js, Express, TypeScript, and Prisma ORM.

This backend works together with the frontend application:  
➡️ https://github.com/kleiza7/ecommerce-frontend

---

## Overview

The system provides core e-commerce functionality:

- User authentication (JWT)
- Role-based access (USER / SELLER)
- Product, Category, Brand management
- Shopping Cart operations
- Prisma ORM database layer
- Service → Controller → Router architecture
- Global error handling
- SQLite for development (PostgreSQL compatible)
- Fully typed with TypeScript

---

## Controllers Summary

### AuthController

- Register new users
- Login and return JWT
- Access protected profile

### ProductsController

- Create / update / delete products (SELLER only)
- List products
- Retrieve product details

### CategoriesController

- CRUD operations for categories

### BrandsController

- CRUD operations for brands

### CartController

- Get user cart
- Add items
- Update quantities
- Remove items

---

## Database

SQLite is used for development.  
The schema is fully compatible with PostgreSQL by simply updating `DATABASE_URL` in `.env`.

---

## Environment Setup

A `.env.example` file is included.

Create your environment file:

```bash
cp .env.example .env
```

Then fill in the required variables:

```ini
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
PORT=5000
```

---

## Running the Project

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run seed   # optional
npm run dev
```

The server will start at:

```
http://localhost:5000
```

---

## Contributing

Contributions and pull requests are welcome.

---

## License

MIT

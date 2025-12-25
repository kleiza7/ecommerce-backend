import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import path from "path";
import { prisma } from "./config/prisma";

// Controllers
import { AuthController } from "./controllers/Auth.controller";
import { BrandsController } from "./controllers/Brands.controller";
import { CartController } from "./controllers/Cart.controller";
import { CategoriesController } from "./controllers/Categories.controller";
import { ProductsController } from "./controllers/Products.controller";

// Routers
import { AuthRouter } from "./routers/Auth.router";
import { BrandsRouter } from "./routers/Brands.router";
import { CartRouter } from "./routers/Cart.router";
import { CategoriesRouter } from "./routers/Categories.router";
import { ProductsRouter } from "./routers/Products.router";

// Services
import { AuthService } from "./services/Auth.service";
import { BrandsService } from "./services/Brands.service";
import { CartService } from "./services/Cart.service";
import { CategoriesService } from "./services/Categories.service";
import { ProductsService } from "./services/Products.service";

// Middlewares

// Swagger
import { swaggerSpec, swaggerUi, swaggerUiSetup } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler.middleware";

dotenv.config();

class Server {
  constructor(
    private productsRouter: ProductsRouter,
    private brandsRouter: BrandsRouter,
    private categoriesRouter: CategoriesRouter,
    private cartRouter: CartRouter,
    private authRouter: AuthRouter
  ) {
    this.startServer();
  }

  private startServer() {
    const app: Application = express();
    const port = process.env.PORT || 5000;

    /* =========================
       CORE MIDDLEWARES
    ========================== */

    app.use(express.json());

    app.use(
      cors({
        origin: true, // local + vercel + prod
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // ✅ EXPRESS 5 SAFE PREFLIGHT
    app.use((req, res, next) => {
      if (req.method === "OPTIONS") {
        return res.sendStatus(204);
      }
      next();
    });

    /* =========================
       STATIC FILES
    ========================== */

    const uploadsPath = path.join(process.cwd(), "uploads");
    console.log("📂 Serving uploads from:", uploadsPath);
    app.use("/uploads", express.static(uploadsPath));

    /* =========================
       SWAGGER
    ========================== */

    if (process.env.NODE_ENV !== "production") {
      app.get("/api-docs/swagger.json", (_req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
      });
    }

    app.use("/api-docs", swaggerUi.serve, swaggerUiSetup);

    /* =========================
       API ROUTES
    ========================== */

    app.use("/api", this.mountRouters());

    /* =========================
       404 HANDLER (EXPRESS 5 SAFE)
    ========================== */

    app.use(/.*/, (_req: Request, res: Response) => {
      res.status(404).json({
        message: "Route not found",
      });
    });

    /* =========================
       GLOBAL ERROR HANDLER
    ========================== */

    app.use(errorHandler);

    /* =========================
       START SERVER
    ========================== */

    prisma
      .$connect()
      .then(() => {
        console.log("🟢 Prisma connected");

        app.listen(port, () => {
          console.log(`🔥 Server running on port ${port}`);
          console.log(`📡 API Base: /api`);
          console.log(`📘 Swagger: /api-docs`);
          console.log(`🖼️ Uploads: /uploads`);
        });
      })
      .catch((err) => {
        console.error("❌ Prisma connection failed:", err);
        process.exit(1);
      });
  }

  private mountRouters() {
    const router = express.Router();

    router.use("/products", this.productsRouter.getRouter());
    router.use("/brands", this.brandsRouter.getRouter());
    router.use("/categories", this.categoriesRouter.getRouter());
    router.use("/cart", this.cartRouter.getRouter());
    router.use("/auth", this.authRouter.getRouter());

    return router;
  }
}

/* =========================
   DEPENDENCY INJECTION
========================= */

// Services
const productsService = new ProductsService();
const brandsService = new BrandsService();
const categoriesService = new CategoriesService();
const cartService = new CartService();
const authService = new AuthService();

// Controllers
const productsController = new ProductsController(productsService);
const brandsController = new BrandsController(brandsService);
const categoriesController = new CategoriesController(categoriesService);
const cartController = new CartController(cartService);
const authController = new AuthController(authService);

// Routers
const productsRouter = new ProductsRouter(express.Router(), productsController);
const brandsRouter = new BrandsRouter(express.Router(), brandsController);
const categoriesRouter = new CategoriesRouter(
  express.Router(),
  categoriesController
);
const cartRouter = new CartRouter(express.Router(), cartController);
const authRouter = new AuthRouter(express.Router(), authController);

// Start
new Server(
  productsRouter,
  brandsRouter,
  categoriesRouter,
  cartRouter,
  authRouter
);

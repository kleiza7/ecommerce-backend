import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import path from "path";
import { prisma } from "./config/prisma";
import { CurrenciesRouter } from "./routers/Currencies.router";

// Controllers
import { AuthController } from "./controllers/Auth.controller";
import { BrandsController } from "./controllers/Brands.controller";
import { CartController } from "./controllers/Cart.controller";
import { CategoriesController } from "./controllers/Categories.controller";
import { OrdersController } from "./controllers/Orders.controller";
import { ProductsController } from "./controllers/Products.controller";

// Routers
import { AuthRouter } from "./routers/Auth.router";
import { BrandsRouter } from "./routers/Brands.router";
import { CartRouter } from "./routers/Cart.router";
import { CategoriesRouter } from "./routers/Categories.router";
import { OrdersRouter } from "./routers/Orders.router";
import { ProductsRouter } from "./routers/Products.router";

// Services
import { AuthService } from "./services/Auth.service";
import { BrandsService } from "./services/Brands.service";
import { CartService } from "./services/Cart.service";
import { CategoriesService } from "./services/Categories.service";
import { OrdersService } from "./services/Orders.service";
import { ProductsService } from "./services/Products.service";

// Middlewares
import { errorHandler } from "./middlewares/errorHandler.middleware";

// Swagger
import { swaggerSpec, swaggerUi, swaggerUiSetup } from "./config/swagger";
import { CurrenciesController } from "./controllers/Currencies.controller";
import { CurrenciesService } from "./services/Currencies.service";

dotenv.config();

class Server {
  constructor(
    private productsRouter: ProductsRouter,
    private brandsRouter: BrandsRouter,
    private categoriesRouter: CategoriesRouter,
    private currenciesRouter: CurrenciesRouter,
    private cartRouter: CartRouter,
    private ordersRouter: OrdersRouter,
    private authRouter: AuthRouter
  ) {
    this.startServer();
  }

  private startServer() {
    const app: Application = express();
    const port = process.env.PORT || 5000;

    app.use(express.json());
    app.use(cors());

    // 🟢 STATIC SERVE — uploads root'tan çalışsın
    const uploadsPath = path.join(process.cwd(), "uploads");
    console.log("📂 Serving uploads from:", uploadsPath);
    app.use("/uploads", express.static(uploadsPath));

    // 🟢 Swagger JSON
    if (process.env.NODE_ENV !== "production") {
      app.get("/api-docs/swagger.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        return res.send(swaggerSpec);
      });
    }

    // 🟠 Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUiSetup);

    // 🌍 API prefix
    app.use("/api", this.mountRouters());

    // 🔥 Global error handler
    app.use(errorHandler);

    prisma
      .$connect()
      .then(() => {
        console.log("🟢 Connected to SQLite via Prisma");
        app.listen(port, () => {
          console.log(`🔥 Server running at http://localhost:${port}`);
          console.log(`📡 API Base URL: http://localhost:${port}/api`);
          console.log(`📘 Swagger Docs: http://localhost:${port}/api-docs`);
          console.log(
            `📄 Swagger JSON: http://localhost:${port}/api-docs/swagger.json`
          );
          console.log(`🖼️ Static uploads: http://localhost:${port}/uploads`);
        });
      })
      .catch((err) => {
        console.error("❌ Prisma connection failed:", err);
      });
  }

  private mountRouters() {
    const router = express.Router();

    router.use("/products", this.productsRouter.getRouter());
    router.use("/brands", this.brandsRouter.getRouter());
    router.use("/categories", this.categoriesRouter.getRouter());
    router.use("/currencies", this.currenciesRouter.getRouter());
    router.use("/cart", this.cartRouter.getRouter());
    router.use("/orders", this.ordersRouter.getRouter());
    router.use("/auth", this.authRouter.getRouter());

    return router;
  }
}

// Instantiate services
const productsService = new ProductsService();
const brandsService = new BrandsService();
const categoriesService = new CategoriesService();
const currenciesService = new CurrenciesService();
const cartService = new CartService();
const ordersService = new OrdersService();
const authService = new AuthService();

// Instantiate controllers
const productsController = new ProductsController(productsService);
const brandsController = new BrandsController(brandsService);
const categoriesController = new CategoriesController(categoriesService);
const currenciesController = new CurrenciesController(currenciesService);
const cartController = new CartController(cartService);
const ordersController = new OrdersController(ordersService);
const authController = new AuthController(authService);

// Instantiate routers
const productsRouter = new ProductsRouter(express.Router(), productsController);
const brandsRouter = new BrandsRouter(express.Router(), brandsController);
const categoriesRouter = new CategoriesRouter(
  express.Router(),
  categoriesController
);
const currenciesRouter = new CurrenciesRouter(
  express.Router(),
  currenciesController
);
const cartRouter = new CartRouter(express.Router(), cartController);
const ordersRouter = new OrdersRouter(express.Router(), ordersController);
const authRouter = new AuthRouter(express.Router(), authController);

// Start server
new Server(
  productsRouter,
  brandsRouter,
  categoriesRouter,
  currenciesRouter,
  cartRouter,
  ordersRouter,
  authRouter
);

import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import { prisma } from "./config/prisma";
import { AuthController } from "./controllers/Auth.controller";
import { BrandsController } from "./controllers/Brands.controller";
import { CartController } from "./controllers/Cart.controller";
import { CategoriesController } from "./controllers/Categories.controller";
import { ProductsController } from "./controllers/Products.controller";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { AuthRouter } from "./routers/Auth.router";
import { BrandsRouter } from "./routers/Brands.router";
import { CartRouter } from "./routers/Cart.router";
import { CategoriesRouter } from "./routers/Categories.router";
import { ProductsRouter } from "./routers/Products.router";
import { AuthService } from "./services/Auth.service";
import { BrandsService } from "./services/Brands.service";
import { CartService } from "./services/Cart.service";
import { CategoriesService } from "./services/Categories.service";
import { ProductsService } from "./services/Products.service";

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

    app.use(express.json());
    app.use(cors());

    // ROUTES
    app.use("/products", this.productsRouter.getRouter());
    app.use("/brands", this.brandsRouter.getRouter());
    app.use("/categories", this.categoriesRouter.getRouter());
    app.use("/cart", this.cartRouter.getRouter());
    app.use("/auth", this.authRouter.getRouter());

    app.use(errorHandler);

    prisma
      .$connect()
      .then(() => {
        console.log("🟢 Connected to SQLite via Prisma");

        app.listen(port, () => {
          console.log(`🔥 Server running at http://localhost:${port}`);
        });
      })
      .catch((err) => {
        console.error("❌ Prisma database connection failed:", err);
      });
  }
}

const productsService = new ProductsService();
const brandsService = new BrandsService();
const categoriesService = new CategoriesService();
const cartService = new CartService();
const authService = new AuthService();

const productsController = new ProductsController(productsService);
const brandsController = new BrandsController(brandsService);
const categoriesController = new CategoriesController(categoriesService);
const cartController = new CartController(cartService);
const authController = new AuthController(authService);

const productsRouter = new ProductsRouter(express.Router(), productsController);
const brandsRouter = new BrandsRouter(express.Router(), brandsController);
const categoriesRouter = new CategoriesRouter(
  express.Router(),
  categoriesController
);
const cartRouter = new CartRouter(express.Router(), cartController);
const authRouter = new AuthRouter(express.Router(), authController);

new Server(
  productsRouter,
  brandsRouter,
  categoriesRouter,
  cartRouter,
  authRouter
);

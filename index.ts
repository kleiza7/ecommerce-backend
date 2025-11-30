import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import { sequelize } from "./config/database";
import { AuthController } from "./controllers/Auth.controller";
import { BrandsController } from "./controllers/Brands.controller";
import { ProductsController } from "./controllers/Products.controller";
import { associateModels } from "./models/index";
import { AuthRouter } from "./routers/Auth.router";
import { BrandsRouter } from "./routers/Brands.router";
import { ProductsRouter } from "./routers/Products.router";
import { AuthService } from "./services/Auth.service";
import { BrandsService } from "./services/Brands.service";
import { ProductsService } from "./services/Products.service";

dotenv.config();

class Server {
  constructor(
    private productsRouter: ProductsRouter,
    private brandsRouter: BrandsRouter,
    private authRouter: AuthRouter
  ) {
    this.startServer();
  }

  startServer() {
    const app: Application = express();

    const port = process.env.PORT || 5000;

    app.use(express.json());
    app.use(cors());

    app.use("/products", this.productsRouter.getRouter());
    app.use("/brands", this.brandsRouter.getRouter());
    app.use("/auth", this.authRouter.getRouter());

    sequelize
      .authenticate()
      .then(() => {
        associateModels();
        return sequelize.sync({ alter: true });
      })
      .then(() =>
        app.listen(port, () => {
          console.log(`Server is Fire at http://localhost:${port}`);
        })
      )
      .catch((err) => console.log("Can not connect db", err));
  }
}

const productsService = new ProductsService();
const brandsService = new BrandsService();
const authService = new AuthService();

const productsController = new ProductsController(productsService);
const brandsController = new BrandsController(brandsService);
const authController = new AuthController(authService);

const productsRouter = new ProductsRouter(express.Router(), productsController);
const brandsRouter = new BrandsRouter(express.Router(), brandsController);
const authRouter = new AuthRouter(express.Router(), authController);

new Server(productsRouter, brandsRouter, authRouter);

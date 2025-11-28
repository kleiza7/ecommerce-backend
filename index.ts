import dotenv from 'dotenv';
import express, { Application } from 'express';
import { ProductsController } from './controllers/Products.controller';
import { ProductsRouter } from './routers/Products.router';
import { sequelize } from './config/database';
import cors from 'cors';
import { BrandsRouter } from './routers/Brands.router';
import { BrandsController } from './controllers/Brands.controller';
import { associateModels } from './models/index';
import { AuthController } from './controllers/Auth.controller';
import { AuthRouter } from './routers/Auth.router';

dotenv.config();

class Server {
  constructor(
    private productsRouter: ProductsRouter,
    private brandsRouter: BrandsRouter,
    private authRouter: AuthRouter,
  ) {
    this.startServer();
  }

  startServer() {
    const app: Application = express();

    const port = process.env.PORT || 5000;

    app.use(express.json());
    app.use(cors());

    app.use('/products', this.productsRouter.getRouter());
    app.use('/brands', this.brandsRouter.getRouter());
    app.use('/auth', this.authRouter.getRouter());

    sequelize
      .authenticate()
      .then(() => {
        associateModels();
        return sequelize.sync({ alter: true });
      })
      .then(() =>
        app.listen(port, () => {
          console.log(`Server is Fire at http://localhost:${port}`);
        }),
      )
      .catch((err) => console.log('Can not connect db', err));
  }
}

const productsController = new ProductsController();
const brandsController = new BrandsController();
const authController = new AuthController();

const productsRouter = new ProductsRouter(express.Router(), productsController);
const brandsRouter = new BrandsRouter(express.Router(), brandsController);
const authRouter = new AuthRouter(express.Router(), authController);

new Server(productsRouter, brandsRouter, authRouter);

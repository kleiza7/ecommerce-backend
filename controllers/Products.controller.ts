import { Request, Response } from "express";
import { ProductsService } from "../services/Products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getAllProducts = async (_: Request, res: Response) => {
    try {
      const products = await this.productsService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res
        .status(404)
        .json({ message: "An error occurred when fetch products." });
    }
  };

  getProductsByBrandId = async (req: Request, res: Response) => {
    try {
      const { brandId } = req.params;

      const products = await this.productsService.getProductsByBrandId(brandId);

      if (products.length === 0) {
        res.status(404).json({ message: "No products found for this brand." });
        return;
      }

      res.status(200).json(products);
    } catch (error) {
      res
        .status(404)
        .json({ message: "An error occurred when fetch products by brand." });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const product = await this.productsService.getProductById(id);

      if (!product) {
        res.status(404).json({ message: "Product not found." });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      res
        .status(404)
        .json({ message: "An error occurred when fetch product." });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const { name, description, price, brandId } = req.body;

      const product = await this.productsService.createProduct({
        name,
        description,
        price,
        brandId,
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(404).json({ message: "An error occurred." });
    }
  };
}

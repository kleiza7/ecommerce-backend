import { Request, Response } from "express";
import { ProductsService } from "../services/Products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getAllProducts = async (_: Request, res: Response) => {
    try {
      const products = await this.productsService.getAllProducts();
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
  };

  getProductsByBrandId = async (req: Request, res: Response) => {
    try {
      const brandId = Number(req.params.brandId);
      const products = await this.productsService.getProductsByBrandId(brandId);

      if (!products || products.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found for this brand" });
      }

      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Failed to fetch products by brand" });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const product = await this.productsService.getProductById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch product" });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productsService.createProduct(req.body);

      if (!product) {
        return res.status(400).json({
          message: "Invalid brandId or categoryId",
        });
      }

      return res.status(201).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to create product" });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const updated = await this.productsService.updateProduct(id, req.body);

      if (!updated) {
        return res
          .status(400)
          .json({ message: "Invalid product, brand, or category" });
      }

      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to update product" });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const deleted = await this.productsService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to delete product" });
    }
  };
}

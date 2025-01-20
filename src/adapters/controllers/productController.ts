import type { Request, Response } from "express";
import { CreateProductUseCase } from "../../usecases/createProductUseCase";
import { PrismaProductRepository } from "../../infrastructure/repositories/prismaProductRepository";

const productRepository = new PrismaProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);

export const ProductController = {
  async createProduct(req: Request, res: Response) {
    try {
      const productData = req.body;
      const product = await createProductUseCase.execute(productData);

      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
};

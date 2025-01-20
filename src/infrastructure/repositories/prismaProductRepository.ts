import { PrismaClient } from "@prisma/client";
import type { Product } from "../../domain/entities/product";
import type { ProductRepository } from "../../domain/repositories/productRepository";

const prisma = new PrismaClient();

export class PrismaProductRepository implements ProductRepository {
  async create(product: Omit<Product, "id">): Promise<Product> {
    const prismaProduct = await prisma.product.create({
      data: product,
    });

    return {
      ...prismaProduct,
      id: prismaProduct.id.toString(),
    };
  }
}

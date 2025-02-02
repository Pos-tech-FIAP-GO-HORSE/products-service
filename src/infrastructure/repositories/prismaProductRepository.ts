import { PrismaClient } from '@prisma/client';
import type { Product } from '../../domain/entities/product';
import type { ProductRepository } from '../../domain/repositories/productRepository';

export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const prismaProduct = await this.prisma.product.create({
      data: product,
    });

    return {
      ...prismaProduct,
      id: prismaProduct.id.toString(),
    };
  }

  async getAll(): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany();

    return prismaProducts.map((product) => ({
      ...product,
      id: product.id.toString(),
    }));
  }

  async getById(id: string): Promise<Product | null> {
    const prismaProduct = await this.prisma.product.findUnique({
      where: { id: String(id) },
    });

    return prismaProduct
      ? {
          ...prismaProduct,
          id: prismaProduct.id.toString(),
        }
      : null;
  }

  async getByCategory(category: Product['category']): Promise<Product[]> {
    const prismaProducts = await this.prisma.product.findMany({
      where: { category },
    });

    return prismaProducts.map((product) => ({
      ...product,
      id: product.id.toString(),
    }));
  }
}

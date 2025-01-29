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
}

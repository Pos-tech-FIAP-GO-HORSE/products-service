import type { Product } from '../domain/entities/product';
import type { ProductRepository } from '../domain/repositories/productRepository';
import { v4 as uuidv4 } from 'uuid';

export class CreateProductUseCase {
	constructor(private productRepository: ProductRepository) {}

	async execute(
		product: Omit<Product, 'id' | 'publicId' | 'createdAt' | 'updatedAt'>,
	): Promise<Product> {
		const newProduct: Omit<Product, 'id'> = {
			...product,
			publicId: uuidv4(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		return this.productRepository.create(newProduct);
	}
}

import type { Product } from '../domain/entities/product';
import type { ProductRepository } from '../domain/repositories/productRepository';

export class GetAllProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.getAll();
  }
} 
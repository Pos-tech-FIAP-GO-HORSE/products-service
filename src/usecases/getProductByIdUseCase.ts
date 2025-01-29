import type { Product } from '../domain/entities/product';
import type { ProductRepository } from '../domain/repositories/productRepository';

export class GetProductByIdUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.getById(id);
  }
} 
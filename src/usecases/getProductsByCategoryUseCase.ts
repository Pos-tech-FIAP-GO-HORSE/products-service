import type { Product } from '../domain/entities/product';
import type { ProductRepository } from '../domain/repositories/productRepository';

export class GetProductsByCategoryUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(category: Product['category']): Promise<Product[]> {
    return this.productRepository.getByCategory(category);
  }
}

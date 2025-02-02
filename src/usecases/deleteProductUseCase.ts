import type { ProductRepository } from '../domain/repositories/productRepository';

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(productId: string): Promise<void> {
    await this.productRepository.delete(productId);
  }
}

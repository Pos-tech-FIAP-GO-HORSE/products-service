import type { Product } from '../domain/entities/product';
import type { ProductRepository } from '../domain/repositories/productRepository';
import { MESSAGES } from '../constants/messages';

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(
    id: string,
    updatedFields: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Product | null> {
    const existingProduct = await this.productRepository.getById(id);

    if (!existingProduct) {
      throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    const updatedProduct: Product = {
      ...existingProduct,
      ...updatedFields,
      updatedAt: new Date(),
    };

    return this.productRepository.update(id, updatedProduct);
  }
}

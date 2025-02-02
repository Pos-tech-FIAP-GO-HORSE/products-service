import { mock } from 'jest-mock-extended';
import { DeleteProductUseCase } from './deleteProductUseCase';
import type { ProductRepository } from '../domain/repositories/productRepository';

const mockProductRepository = mock<ProductRepository>();

describe('DeleteProductUseCase', () => {
  const deleteProductUseCase = new DeleteProductUseCase(mockProductRepository);

  it('should delete a product successfully', async () => {
    const productId = '1';

    mockProductRepository.delete.mockResolvedValueOnce();

    await deleteProductUseCase.execute(productId);

    expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
  });

  it('should handle errors gracefully', async () => {
    const productId = 'invalid-id';
    mockProductRepository.delete.mockRejectedValueOnce(
      new Error('Error deleting product'),
    );

    await expect(deleteProductUseCase.execute(productId)).rejects.toThrow(
      'Error deleting product',
    );
  });
});

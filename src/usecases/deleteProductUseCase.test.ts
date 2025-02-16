import { mock } from 'jest-mock-extended';
import { DeleteProductUseCase } from './deleteProductUseCase';
import type { ProductRepository } from '../domain/repositories/productRepository';
import { MESSAGES } from '../constants/messages';

const mockProductRepository = mock<ProductRepository>();

describe('DeleteProductUseCase', () => {
  const deleteProductUseCase = new DeleteProductUseCase(mockProductRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a product successfully', async () => {
    const productId = '1';
    
    mockProductRepository.getById.mockResolvedValueOnce({ id: productId } as any);
    mockProductRepository.delete.mockResolvedValueOnce();

    await deleteProductUseCase.execute(productId);

    expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
    expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
  });

  it('should throw error when product does not exist', async () => {
    const productId = 'non-existent-id';
    mockProductRepository.getById.mockResolvedValueOnce(null);

    await expect(deleteProductUseCase.execute(productId)).rejects.toThrow(
      MESSAGES.PRODUCT_NOT_FOUND
    );
    
    expect(mockProductRepository.delete).not.toHaveBeenCalled();
  });

  it('should handle deletion errors gracefully', async () => {
    const productId = 'invalid-id';
    mockProductRepository.getById.mockResolvedValueOnce({ id: productId } as any);
    mockProductRepository.delete.mockRejectedValueOnce(
      new Error('Error deleting product')
    );

    await expect(deleteProductUseCase.execute(productId)).rejects.toThrow(
      'Error deleting product'
    );
  });
});

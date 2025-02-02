import { mock } from 'jest-mock-extended';
import { GetProductByIdUseCase } from './getProductByIdUseCase';
import type { ProductRepository } from '../domain/repositories/productRepository';
import type { Product } from '../domain/entities/product';

const mockProductRepository = mock<ProductRepository>();

describe('GetProductByIdUseCase', () => {
  const getProductByIdUseCase = new GetProductByIdUseCase(
    mockProductRepository,
  );

  it('should return a product when found', async () => {
    const productId = '1';
    const product: Product = {
      id: productId,
      publicId: 'uuid-123',
      name: 'X-Burger',
      category: 'Lanche',
      price: 10.5,
      description: 'Um hambúrguer delicioso com queijo, bacon e alface',
      imageUrl: 'http://example.com/product.jpg',
      isAvailable: true,
      preparationTime: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProductRepository.getById.mockResolvedValueOnce(product);

    const result = await getProductByIdUseCase.execute(productId);

    expect(result).toEqual(product);
    expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
  });

  it('should return null when product is not found', async () => {
    const productId = '2';

    mockProductRepository.getById.mockResolvedValueOnce(null);

    const result = await getProductByIdUseCase.execute(productId);

    expect(result).toBeNull();
    expect(mockProductRepository.getById).toHaveBeenCalledWith(productId);
  });

  it('should handle errors gracefully', async () => {
    const productId = '3';
    mockProductRepository.getById.mockRejectedValueOnce(
      new Error('Error fetching product'),
    );

    await expect(getProductByIdUseCase.execute(productId)).rejects.toThrow(
      'Error fetching product',
    );
  });
});

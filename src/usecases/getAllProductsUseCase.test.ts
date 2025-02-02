import { mock } from 'jest-mock-extended';
import { GetAllProductsUseCase } from './getAllProductsUseCase';
import type { ProductRepository } from '../domain/repositories/productRepository';
import type { Product } from '../domain/entities/product';

const mockProductRepository = mock<ProductRepository>();

describe('GetAllProductsUseCase', () => {
  const getAllProductsUseCase = new GetAllProductsUseCase(
    mockProductRepository,
  );

  it('should return all products successfully', async () => {
    const products: Product[] = [
      {
        id: '1',
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
      },
    ];

    mockProductRepository.getAll.mockResolvedValueOnce(products);

    const result = await getAllProductsUseCase.execute();

    expect(result).toEqual(products);
    expect(mockProductRepository.getAll).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockProductRepository.getAll.mockRejectedValueOnce(
      new Error('Error fetching products'),
    );

    await expect(getAllProductsUseCase.execute()).rejects.toThrow(
      'Error fetching products',
    );
  });
});

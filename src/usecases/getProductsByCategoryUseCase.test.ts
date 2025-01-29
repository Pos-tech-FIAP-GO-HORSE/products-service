import { mock } from 'jest-mock-extended';
import { GetProductsByCategoryUseCase } from './getProductsByCategoryUseCase';
import type { ProductRepository } from '../domain/repositories/productRepository';
import type { Product, ProductCategoryType } from '../domain/entities/product';

const mockProductRepository = mock<ProductRepository>();

describe('GetProductsByCategoryUseCase', () => {
  const getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(mockProductRepository);

  it('should return products for a given category', async () => {
    const category = 'Lanche' as keyof typeof ProductCategoryType;
    const products: Product[] = [
      {
        id: '1',
        publicId: 'uuid-123',
        name: 'X-Burger',
        category,
        price: 10.5,
        description: 'Um hambúrguer delicioso com queijo, bacon e alface',
        imageUrl: 'http://example.com/product.jpg',
        isAvailable: true,
        preparationTime: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockProductRepository.getByCategory.mockResolvedValueOnce(products);

    const result = await getProductsByCategoryUseCase.execute(category);

    expect(result).toEqual(products);
    expect(mockProductRepository.getByCategory).toHaveBeenCalledWith(category);
  });

  it('should handle errors gracefully', async () => {
    const category = 'Lanche' as keyof typeof ProductCategoryType;
    mockProductRepository.getByCategory.mockRejectedValueOnce(
      new Error('Error fetching products'),
    );

    await expect(getProductsByCategoryUseCase.execute(category)).rejects.toThrow(
      'Error fetching products',
    );
  });
}); 
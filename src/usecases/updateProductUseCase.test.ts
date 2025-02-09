import { mock } from 'jest-mock-extended';
import { UpdateProductUseCase } from './updateProductUseCase';
import type { ProductRepository } from '../domain/repositories/productRepository';
import type { Product } from '../domain/entities/product';
import { MESSAGES } from '../constants/messages';

const mockProductRepository = mock<ProductRepository>();

describe('UpdateProductUseCase', () => {
  const updateProductUseCase = new UpdateProductUseCase(mockProductRepository);
  const fixedDate = new Date('2025-02-02T22:34:31.330Z');

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(fixedDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should update a product successfully', async () => {
    const productId = '1';
    const updateData = {
      name: 'X-Burger Deluxe',
      price: 12.5,
      description: 'Um hambúrguer ainda mais delicioso com queijo, bacon, alface e tomate',
    };

    const existingProduct: Product = {
      id: productId,
      publicId: 'uuid-123',
      name: 'X-Burger',
      category: 'Lanche',
      price: 10.5,
      description: 'Um hambúrguer delicioso com queijo, bacon e alface',
      imageUrl: 'http://example.com/product.jpg',
      isAvailable: true,
      preparationTime: 15,
      createdAt: new Date('2025-02-02T22:34:31.329Z'),
      updatedAt: new Date('2025-02-02T22:34:31.329Z'),
    };

    const updatedProduct: Product = {
      ...existingProduct,
      ...updateData,
      updatedAt: fixedDate,
    };

    mockProductRepository.getById.mockResolvedValueOnce(existingProduct);
    mockProductRepository.update.mockResolvedValueOnce(updatedProduct);

    const result = await updateProductUseCase.execute(productId, updateData);

    expect(result).toEqual(updatedProduct);
    expect(mockProductRepository.update).toHaveBeenCalledWith(productId, updatedProduct);
  });

  it('should handle errors gracefully', async () => {
    const productId = '3';
    const updateData = {
      name: 'Error Product',
    };

    const existingProduct: Product = {
      id: productId,
      publicId: 'uuid-123',
      name: 'X-Burger',
      category: 'Lanche',
      price: 10.5,
      description: 'Um hambúrguer delicioso com queijo, bacon e alface',
      imageUrl: 'http://example.com/product.jpg',
      isAvailable: true,
      preparationTime: 15,
      createdAt: new Date('2025-02-02T22:34:31.329Z'),
      updatedAt: new Date('2025-02-02T22:34:31.329Z'),
    };

    mockProductRepository.getById.mockResolvedValueOnce(existingProduct);
    mockProductRepository.update.mockRejectedValueOnce(
      new Error('Error updating product'),
    );

    await expect(updateProductUseCase.execute(productId, updateData)).rejects.toThrow(
      'Error updating product',
    );
  });
});

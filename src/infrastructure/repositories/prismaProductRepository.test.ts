import type { PrismaClient } from '@prisma/client';
import type { ProductCategoryType } from '../../domain/entities/product';
import { PrismaProductRepository } from './prismaProductRepository';

jest.mock('@prisma/client');

const mockCreate = jest.fn();
const mockPrismaClient = {
  product: {
    create: mockCreate,
  },
} as unknown as jest.Mocked<PrismaClient>;

describe('PrismaProductRepository', () => {
  const repository = new PrismaProductRepository(mockPrismaClient);

  it('should create a product in the database', async () => {
    const input = {
      name: 'X-Burger',
      category: 'Lanche' as keyof typeof ProductCategoryType,
      price: 10.5,
      description: 'Um hambúrguer delicioso com queijo, bacon e alface',
      imageUrl: 'http://example.com/product.jpg',
      isAvailable: true,
      preparationTime: 15,
      publicId: 'uuid-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdProduct = {
      ...input,
      id: '1',
    };

    mockCreate.mockResolvedValueOnce(createdProduct);

    const result = await repository.create(input);

    expect(result).toEqual(createdProduct);
    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining(input),
    });
  });
});

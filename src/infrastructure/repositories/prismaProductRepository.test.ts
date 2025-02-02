import type { PrismaClient } from '@prisma/client';
import type { ProductCategoryType } from '../../domain/entities/product';
import { PrismaProductRepository } from './prismaProductRepository';

jest.mock('@prisma/client');

const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockPrismaClient = {
  product: {
    create: mockCreate,
    findMany: mockFindMany,
    findUnique: mockFindUnique,
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

  it('should retrieve all products from the database', async () => {
    const products = [
      { id: '1', name: 'X-Burger', category: 'Lanche', price: 10.5 },
      { id: '2', name: 'Y-Burger', category: 'Lanche', price: 12.0 },
    ];

    mockFindMany.mockResolvedValueOnce(products);

    const result = await repository.getAll();

    expect(result).toEqual(products);
    expect(mockFindMany).toHaveBeenCalled();
  });

  it('should retrieve a product by ID', async () => {
    const product = {
      id: '1',
      name: 'X-Burger',
      category: 'Lanche',
      price: 10.5,
    };

    mockFindUnique.mockResolvedValueOnce(product);

    const result = await repository.getById('1');

    expect(result).toEqual(product);
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should return null if product by ID does not exist', async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    const result = await repository.getById('non-existent-id');

    expect(result).toBeNull();
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'non-existent-id' },
    });
  });

  it('should retrieve products by category', async () => {
    const products = [
      { id: '1', name: 'X-Burger', category: 'Lanche', price: 10.5 },
    ];

    mockFindMany.mockResolvedValueOnce(products);

    const result = await repository.getByCategory('Lanche');

    expect(result).toEqual(products);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { category: 'Lanche' },
    });
  });
});

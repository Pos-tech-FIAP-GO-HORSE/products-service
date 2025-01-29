import { mock } from 'jest-mock-extended';
import { CreateProductUseCase } from './createProductUseCase';
import type { ProductRepository } from '../domain/repositories/productRepository';
import type { Product, ProductCategoryType } from '../domain/entities/product';

const mockProductRepository = mock<ProductRepository>();

describe('CreateProductUseCase', () => {
	const createProductUseCase = new CreateProductUseCase(mockProductRepository);

	it('should create a product successfully', async () => {
		const input = {
			name: 'X-Burger',
			category: 'Lanche' as keyof typeof ProductCategoryType,
			price: 10.5,
			description: 'Um hambúrguer delicioso com queijo, bacon e alface',
			imageUrl: 'http://example.com/product.jpg',
			isAvailable: true,
			preparationTime: 15,
		};

		const createdProduct = {
			...input,
			id: '1',
			publicId: 'uuid-123',
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		mockProductRepository.create.mockResolvedValueOnce(createdProduct);

		const result = await createProductUseCase.execute(input);

		expect(result).toEqual(createdProduct);
		expect(mockProductRepository.create).toHaveBeenCalledWith(
			expect.objectContaining(input),
		);
	});

	it('should handle errors gracefully', async () => {
		const invalidInput = {} as Omit<
			Product,
			'id' | 'publicId' | 'createdAt' | 'updatedAt'
		>;
		mockProductRepository.create.mockRejectedValueOnce(
			new Error('Error creating product'),
		);

		await expect(createProductUseCase.execute(invalidInput)).rejects.toThrow(
			'Error creating product',
		);
	});
});

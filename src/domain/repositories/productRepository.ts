import type { Product } from '../entities/product';

export interface ProductRepository {
	create(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
}

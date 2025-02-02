import type { Product } from '../entities/product';

export interface ProductRepository {
  create(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getByCategory(category: Product['category']): Promise<Product[]>;
  delete(id: string): Promise<void>;
}

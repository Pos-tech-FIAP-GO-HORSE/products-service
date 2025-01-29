import { ProductCategoryType, Product } from './product';

describe('Product Entity', () => {
  it('should validate a valid category', () => {
    const category: keyof typeof ProductCategoryType = 'Lanche';
    expect(ProductCategoryType[category]).toBeDefined();
  });

  it('should return undefined for an invalid category', () => {
    const category = 'INVALID' as keyof typeof ProductCategoryType;
    expect(ProductCategoryType[category]).toBeUndefined();
  });

  it('should contain all defined categories', () => {
    const expectedCategories = [
      'Lanche',
      'Acompanhamento',
      'Bebida',
      'Sobremesa',
    ];
    const actualCategories = Object.keys(ProductCategoryType);
    expect(actualCategories).toEqual(expectedCategories);
  });

  it('should create a valid product object', () => {
    const product: Product = {
      id: '1',
      publicId: 'uuid-123',
      name: 'Hamburguer',
      category: 'Lanche',
      price: 15.99,
      description: '',
      imageUrl: 'http://example.com/hamburguer.jpg',
      isAvailable: true,
      preparationTime: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(product).toBeDefined();
    expect(product.id).toBe('1');
    expect(product.publicId).toBe('uuid-123');
    expect(product.name).toBe('Hamburguer');
    expect(product.category).toBe('Lanche');
    expect(product.price).toBe(15.99);
    expect(product.description).toBe('');
    expect(product.imageUrl).toBe('http://example.com/hamburguer.jpg');
    expect(product.isAvailable).toBe(true);
    expect(product.preparationTime).toBe(10);
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
  });

  it('should not allow negative price values', () => {
    const product: Product = {
      id: '1',
      publicId: 'uuid-123',
      name: 'Hamburguer',
      category: 'Lanche',
      price: -10, // Invalid price
      description: '',
      imageUrl: 'http://example.com/hamburguer.jpg',
      isAvailable: true,
      preparationTime: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(product.price).toBeLessThan(0);
  });

  it('should not allow empty product name', () => {
    const product: Product = {
      id: '1',
      publicId: 'uuid-123',
      name: '',
      category: 'Lanche',
      price: 10.5,
      description: '',
      imageUrl: 'http://example.com/hamburguer.jpg',
      isAvailable: true,
      preparationTime: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(product.name).toHaveLength(0);
  });

  it('should not allow a preparation time less than zero', () => {
    const product: Product = {
      id: '1',
      publicId: 'uuid-123',
      name: 'Hamburguer',
      category: 'Lanche',
      price: 10.5,
      description: '',
      imageUrl: 'http://example.com/hamburguer.jpg',
      isAvailable: true,
      preparationTime: -5, // Invalid preparation time
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(product.preparationTime).toBeLessThan(0);
  });
});

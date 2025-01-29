export const ProductCategoryType = {
	Lanche: 'Lanche',
	Acompanhamento: 'Acompanhamento',
	Bebida: 'Bebida',
	Sobremesa: 'Sobremesa',
} as const;

export interface Product {
	id: string;
	publicId: string;
	name: string;
	category: keyof typeof ProductCategoryType;
	price: number;
	description: string;
	imageUrl: string;
	isAvailable: boolean;
	preparationTime: number;
	createdAt: Date;
	updatedAt: Date;
}

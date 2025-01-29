import type { Options as SwaggerOptions } from 'swagger-jsdoc';

const swaggerOptions: SwaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Product API',
			version: '1.0.0',
			description: 'API documentation for managing products',
		},
		servers: [
			{
				url: `http://localhost:${process.env.PORT}`,
				description: 'Development Server',
			},
		],
		components: {
			schemas: {
				Product: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						publicId: { type: 'string' },
						name: { type: 'string' },
						category: {
							type: 'string',
							enum: ['Lanche', 'Acompanhamento', 'Bebida', 'Sobremesa'],
						},
						price: { type: 'number' },
						description: { type: 'string' },
						imageUrl: { type: 'string' },
						isAvailable: { type: 'boolean' },
						preparationTime: { type: 'number' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
			},
		},
	},
	apis: ['./src/adapters/routes/*.ts'],
};

export default swaggerOptions;

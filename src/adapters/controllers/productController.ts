import type { Request, Response } from 'express';
import { CreateProductUseCase } from '../../usecases/createProductUseCase';
import { PrismaProductRepository } from '../../infrastructure/repositories/prismaProductRepository';
import { HTTP_STATUS } from '../../constants/httpStatusCodes';
import { MESSAGES } from '../../constants/messages';

const productRepository = new PrismaProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);

async function createProduct(req: Request, res: Response) {
	try {
		const productData = req.body;
		const product = await createProductUseCase.execute(productData);

		res.status(HTTP_STATUS.CREATED).json({
			message: MESSAGES.PRODUCT_CREATED,
			product,
		});
	} catch (error) {
		res.status(HTTP_STATUS.BAD_REQUEST).json({
			message: MESSAGES.ERROR_CREATING_PRODUCT,
			error: (error as Error).message,
		});
	}
}

export const ProductController = {
	createProduct,
};

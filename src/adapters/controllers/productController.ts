import type { Request, Response } from 'express';
import { PrismaProductRepository } from '../../infrastructure/repositories/prismaProductRepository';
import { CreateProductUseCase } from '../../usecases/createProductUseCase';
import { GetAllProductsUseCase } from '../../usecases/getAllProductsUseCase';
import { GetProductByIdUseCase } from '../../usecases/getProductByIdUseCase';
import { GetProductsByCategoryUseCase } from '../../usecases/getProductsByCategoryUseCase';
import { DeleteProductUseCase } from '../../usecases/deleteProductUseCase';
import type { ProductCategoryType } from '../../domain/entities/product';
import { HTTP_STATUS } from '../../constants/httpStatusCodes';
import { MESSAGES } from '../../constants/messages';

const productRepository = new PrismaProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);
const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(
  productRepository,
);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

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

async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await getAllProductsUseCase.execute();

    res.status(HTTP_STATUS.OK).json({ products });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.ERROR_FETCHING_PRODUCTS,
      error: (error as Error).message,
    });
  }
}

async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await getProductByIdUseCase.execute(id);

    if (!product) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: MESSAGES.PRODUCT_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ product });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.ERROR_FETCHING_PRODUCT,
      error: (error as Error).message,
    });
  }
}

async function getProductsByCategory(req: Request, res: Response) {
  try {
    const { category } = req.params;
    const products = await getProductsByCategoryUseCase.execute(
      category as keyof typeof ProductCategoryType,
    );

    if (products.length === 0) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: MESSAGES.PRODUCT_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ products });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.ERROR_FETCHING_PRODUCTS,
      error: (error as Error).message,
    });
  }
}

async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteProductUseCase.execute(id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.ERROR_DELETING_PRODUCT,
      error: (error as Error).message,
    });
  }
}

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  deleteProduct,
};

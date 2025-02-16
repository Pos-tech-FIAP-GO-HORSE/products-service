import type { Request, Response } from 'express';
import { ProductController } from './productController';
import { MESSAGES } from '../../constants/messages';
import { HTTP_STATUS } from '../../constants/httpStatusCodes';
import { CreateProductUseCase } from '../../usecases/createProductUseCase';
import { GetAllProductsUseCase } from '../../usecases/getAllProductsUseCase';
import { GetProductByIdUseCase } from '../../usecases/getProductByIdUseCase';
import { GetProductsByCategoryUseCase } from '../../usecases/getProductsByCategoryUseCase';
import { DeleteProductUseCase } from '../../usecases/deleteProductUseCase';
import { UpdateProductUseCase } from '../../usecases/updateProductUseCase';
import { publishToSNS } from '../services/snsService';

// Mock dependencies
jest.mock('../../usecases/createProductUseCase');
jest.mock('../../usecases/getAllProductsUseCase');
jest.mock('../../usecases/getProductByIdUseCase');
jest.mock('../../usecases/getProductsByCategoryUseCase');
jest.mock('../../usecases/deleteProductUseCase');
jest.mock('../../usecases/updateProductUseCase');
jest.mock('../services/snsService');

describe('ProductController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    sendMock = jest.fn().mockReturnThis();

    req = {};
    res = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    };
  });

  describe('createProduct', () => {
    it('should create a product and return 201 status', async () => {
      const mockProduct = { id: '1', name: 'Test Product' };
      (CreateProductUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockProduct);

      req.body = { name: 'Test Product', category: 'Lanche', price: 10 };
      await ProductController.createProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(jsonMock).toHaveBeenCalledWith({
        message: MESSAGES.PRODUCT_CREATED,
        product: mockProduct,
      });
    });

    it('should return 400 status on error', async () => {
      (CreateProductUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Error'));

      req.body = {};
      await ProductController.createProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(jsonMock).toHaveBeenCalledWith({
        message: MESSAGES.ERROR_CREATING_PRODUCT,
        error: 'Error',
      });
    });
  });

  describe('getAllProducts', () => {
    it('should return all products with 200 status', async () => {
      const mockProducts = [{ id: '1', name: 'Test Product' }];
      (GetAllProductsUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockProducts);

      await ProductController.getAllProducts(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(jsonMock).toHaveBeenCalledWith({ products: mockProducts });
    });

    it('should return 500 status on error', async () => {
      (GetAllProductsUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Error'));

      await ProductController.getAllProducts(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith({
        message: MESSAGES.ERROR_FETCHING_PRODUCTS,
        error: 'Error',
      });
    });
  });

  describe('getProductById', () => {
    it('should return a product with 200 status', async () => {
      const mockProduct = { id: '1', name: 'Test Product' };
      (GetProductByIdUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockProduct);

      req.params = { id: '1' };
      await ProductController.getProductById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(jsonMock).toHaveBeenCalledWith({ product: mockProduct });
    });

    it('should return 404 status if product not found', async () => {
      (GetProductByIdUseCase.prototype.execute as jest.Mock).mockResolvedValue(null);

      req.params = { id: '1' };
      await ProductController.getProductById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(jsonMock).toHaveBeenCalledWith({
        message: MESSAGES.PRODUCT_NOT_FOUND,
      });
    });

    it('should return 500 status on error', async () => {
      (GetProductByIdUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Error'));

      req.params = { id: '1' };
      await ProductController.getProductById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith({
        message: MESSAGES.ERROR_FETCHING_PRODUCT,
        error: 'Error',
      });
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category with 200 status', async () => {
      const mockProducts = [{ id: '1', name: 'Test Product' }];
      (GetProductsByCategoryUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockProducts);

      req.params = { category: 'Lanche' };
      await ProductController.getProductsByCategory(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(jsonMock).toHaveBeenCalledWith({ products: mockProducts });
    });

    it('should return 404 status if no products found', async () => {
      (GetProductsByCategoryUseCase.prototype.execute as jest.Mock).mockResolvedValue([]);

      req.params = { category: 'Lanche' };
      await ProductController.getProductsByCategory(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(jsonMock).toHaveBeenCalledWith({
        message: MESSAGES.PRODUCT_NOT_FOUND,
      });
    });

    it('should return 500 status on error', async () => {
      (GetProductsByCategoryUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Error'));

      req.params = { category: 'Lanche' };
      await ProductController.getProductsByCategory(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith({
        message: MESSAGES.ERROR_FETCHING_PRODUCTS,
        error: 'Error',
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return 204 status', async () => {
      (DeleteProductUseCase.prototype.execute as jest.Mock).mockResolvedValue(undefined);

      req.params = { id: '1' };
      await ProductController.deleteProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
      expect(sendMock).toHaveBeenCalled();
    });

    it('should return 500 status on error', async () => {
      (DeleteProductUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Error'));

      req.params = { id: '1' };
      await ProductController.deleteProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith({
        message: MESSAGES.ERROR_DELETING_PRODUCT,
        error: 'Error',
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product and return 200 status', async () => {
      const mockProduct = { id: '1', name: 'Updated Product' };
      (UpdateProductUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockProduct);

      req.params = { id: '1' };
      req.body = { name: 'Updated Product' };
      await ProductController.updateProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(jsonMock).toHaveBeenCalledWith({
        message: MESSAGES.PRODUCT_UPDATED,
        product: mockProduct,
      });
    });

    it('should return 500 status on error', async () => {
      (UpdateProductUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Error'));

      req.params = { id: '1' };
      req.body = { name: 'Updated Product' };
      await ProductController.updateProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith({
        message: MESSAGES.ERROR_UPDATING_PRODUCT,
        error: 'Error',
      });
    });
  });
}); 
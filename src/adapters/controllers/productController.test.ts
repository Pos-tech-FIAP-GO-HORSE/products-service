import type { Request, Response } from 'express';
import { ProductController } from './productController';
import * as snsService from '../services/snsService';
import { HTTP_STATUS } from '../../constants/httpStatusCodes';
import { MESSAGES } from '../../constants/messages';

jest.mock('../services/snsService');
const mockPublishToSNS = jest.spyOn(snsService, 'publishToSNS');

describe('ProductController', () => {
  let mockRequest: Request;
  let mockResponse: Response;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    } as Request;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should publish to SNS after creating product successfully', async () => {
      const productData = {
        name: 'Test Product',
        price: 10.99,
      };
      const createdProduct = { ...productData, id: '1' };
      
      mockRequest.body = productData;
      mockPublishToSNS.mockResolvedValueOnce();

      await ProductController.createProduct(mockRequest, mockResponse);

      expect(mockPublishToSNS).toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should publish to SNS after deleting product successfully', async () => {
      const productId = '123';
      mockRequest.params = { id: productId };
      mockPublishToSNS.mockResolvedValueOnce();

      await ProductController.deleteProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(mockPublishToSNS).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should publish to SNS after updating product successfully', async () => {
      const productId = '123';
      const updateData = {
        name: 'Updated Product',
        price: 15.99,
      };
      const updatedProduct = { ...updateData, id: productId };
      
      mockRequest.params = { id: productId };
      mockRequest.body = updateData;
      mockPublishToSNS.mockResolvedValueOnce();

      await ProductController.updateProduct(mockRequest, mockResponse);

      expect(mockPublishToSNS).toHaveBeenCalledWith(
        JSON.stringify({
          message: MESSAGES.PRODUCT_UPDATED,
          product: expect.objectContaining(updatedProduct),
        }),
        process.env.SNS_TOPIC_ARN_UPDATED ?? '',
      );
    });
  });

  describe('SNS publishing errors', () => {
    it('should not affect response if SNS publishing fails during create', async () => {
      const productData = { name: 'Test Product' };
      mockRequest.body = productData;
      mockPublishToSNS.mockRejectedValueOnce(new Error('SNS Error'));

      await ProductController.createProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: MESSAGES.PRODUCT_CREATED,
        }),
      );
    });

    it('should not affect response if SNS publishing fails during delete', async () => {
      mockRequest.params = { id: '123' };
      mockPublishToSNS.mockRejectedValueOnce(new Error('SNS Error'));

      await ProductController.deleteProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
    });

    it('should not affect response if SNS publishing fails during update', async () => {
      mockRequest.params = { id: '123' };
      mockRequest.body = { name: 'Updated Name' };
      mockPublishToSNS.mockRejectedValueOnce(new Error('SNS Error'));

      await ProductController.updateProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: MESSAGES.PRODUCT_UPDATED,
        }),
      );
    });
  });
}); 
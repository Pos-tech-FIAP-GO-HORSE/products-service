import { Router } from "express";
import { ProductController } from "../controllers/productController";

const router = Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Lanche, Acompanhamento, Bebida, Sobremesa]
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *               preparationTime:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error or other issue
 */
router.post("/", ProductController.createProduct);

export default router;

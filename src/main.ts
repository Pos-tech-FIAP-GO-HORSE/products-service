import express from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger';
import productRoutes from './adapters/routes/products';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

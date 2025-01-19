import type { SwaggerOptions } from "swagger-jsdoc";

const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product API",
      version: "1.0.0",
      description: "API documentation for managing products",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development Server",
      },
    ],
  },
  apis: ["./src/adapters/routes/*.ts"],
};

export default swaggerOptions;

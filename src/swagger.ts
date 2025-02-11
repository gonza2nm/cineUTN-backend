import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';


const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Cine UTN',
      version: '1.0.0',
      description: 'Documentación de la API del sistema de gestión de cine.',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'authToken', // Nombre de la cookie que contiene el JWT
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ['./src/**/*.routes.ts'], // Busca en todos los archivos .routes rutas dentro de src/
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

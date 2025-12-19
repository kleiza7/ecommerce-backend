import { NextFunction, Request, Response } from "express";
import { OpenAPIV3 } from "openapi-types";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "Maglo E-Commerce Backend API Documentation",
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      // TODO — Phase 2: Global error schema buraya eklenecek.
      // Global Error Response Schema buraya eklenecek.
      //
      // Örnek:
      // schemas: {
      //   ErrorResponse: {
      //     type: "object",
      //     properties: {
      //       success: { type: "boolean", example: false },
      //       message: { type: "string", example: "Brand not found" },
      //       status: { type: "number", example: 404 }
      //     }
      //   }
      // }
    },
  },

  apis: [__dirname + "/../docs/swagger/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerUiSetup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const spec = swaggerSpec as OpenAPIV3.Document;

  const protocol = req.protocol;
  const host = req.get("host");

  spec.servers = [
    {
      url: `${protocol}://${host}/api`,
      description: "Dynamic Server URL",
    },
  ];

  return swaggerUi.setup(spec, { explorer: true })(req, res, next);
};

export { swaggerUi };

import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import expressPromBundle from "express-prom-bundle";
import productRoutes from '../src/shared/product/product.routes';

const app: Express = express();

// Database Connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Prometheus metrics middleware
const metricsMiddleware = expressPromBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: "products-service" },
  promClient: {
    collectDefaultMetrics: {},
  },
});

// Middleware
app.use(metricsMiddleware);
app.use(cors());
app.use(express.json());

// Products endpoints
app.use('/api/products', productRoutes);


// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ 
    status: "healthy",
    service: "products-service",
    dbStatus: pool ? "connected" : "disconnected"
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Not Found",
    path: req.path,
  });
});

// Start server
const PORT = Number(process.env.PORT) || 8002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Products service running on port ${PORT}`);
});

export default app;
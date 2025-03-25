import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./user/user.routes";
import axios from "axios";
import expressPromBundle from "express-prom-bundle";

const app: Express = express();

// Load API URLs from .env
const ORDERS_API_URL = process.env.ORDERS_API_URL || "http://localhost:8001";
const CART_API_URL = process.env.CART_API_URL || "http://localhost:8001";
const PRODUCTS_API_URL = process.env.PRODUCTS_API_URL || "http://localhost:8002";
const TENANTS_API_URL = process.env.TENANTS_API_URL || "http://localhost:8003";
const WISHLIST_API_URL = process.env.WISHLIST_API_URL || "http://localhost:8004";

// Prometheus metrics middleware
const metricsMiddleware = expressPromBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: "marketplace-monolith" },
  promClient: {
    collectDefaultMetrics: {},
  },
});

// Middleware
app.use(metricsMiddleware);
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Proxy route handlers for external services
const proxyRequest = async (req: Request, res: Response, targetUrl: string) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${targetUrl}${req.originalUrl.replace("/api", "")}`,
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error(`Error forwarding request to ${targetUrl}:`, error.message);
    res.status(error.response?.status || 500).json({
      message: "Service unavailable",
      error: error.response?.data || error.message,
    });
  }
};

// Proxy API routes to their respective services
app.use("/api/order", (req, res) => proxyRequest(req, res, ORDERS_API_URL));
app.use("/api/cart", (req, res) => proxyRequest(req, res, CART_API_URL));
app.use("/api/product", (req, res) => proxyRequest(req, res, PRODUCTS_API_URL));
app.use("/api/tenant", (req, res) => proxyRequest(req, res, TENANTS_API_URL));
app.use("/api/wishlist", (req, res) => proxyRequest(req, res, WISHLIST_API_URL));

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "healthy" });
});

// Root endpoint
app.get("/", (_, res) => {
  res.status(200).json({
    message: "Marketplace API",
    version: "1.0.0",
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
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;

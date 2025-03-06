import dotenv from "dotenv";
dotenv.config();

import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";

import authRoutes from "../../authentication/src/user/user.routes";
import orderRoutes from "../../orders/src/order/order.routes";
import cartRoutes from "../../orders/src/cart/cart.routes";
import productRoutes from '../../products/src/product/product.routes';
import tenantRoutes from '../../tenant/src/tenant/tenant.routes';
import wishlistRoutes from "../../wishlist/src/wishlist/wishlist.routes";

import express_prom_bundle from "express-prom-bundle";

const app: Express = express();

// Prometheus metrics middleware
const metricsMiddleware = express_prom_bundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: 'marketplace-monolith' },
  promClient: {
    collectDefaultMetrics: {}
  }
});

// Middleware
app.use(metricsMiddleware);
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/product", productRoutes);
app.use("/api/tenant", tenantRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Root endpoint
app.get('/', (_, res) => {
  res.status(200).json({
    message: 'Marketplace API',
    version: '1.0.0'
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Not Found',
    path: req.path
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
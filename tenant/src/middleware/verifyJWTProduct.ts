import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";

export const verifyJWTProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract Bearer token
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    // Verify token via AUTH service
    const AUTH_API_URL = process.env.AUTH_API_URL || "http://localhost:8000";
    const authResponse = await axios.post(`${AUTH_API_URL}/api/auth/verify-token`, { token });

    if (authResponse.status !== 200 || !authResponse.data?.user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = authResponse.data.user;

    // Fetch tenant info from TENANT service
    const SERVER_TENANT_ID = process.env.TENANT_ID;
    if (!SERVER_TENANT_ID) {
      return res.status(500).json({ message: "Server Tenant ID not found" });
    }

    const TENANTS_API_URL = process.env.TENANTS_API_URL || "http://localhost:8003";
    const tenantResponse = await axios.get(`${TENANTS_API_URL}/api/tenants/${SERVER_TENANT_ID}`);

    if (tenantResponse.status !== 200 || !tenantResponse.data?.tenants) {
      return res.status(500).json({ message: "Server Tenant not found" });
    }

    const tenantData = tenantResponse.data.tenants;

    // Check if the user is the tenant owner
    if (user.id !== tenantData.owner_id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Attach user data to request
    req.body.user = user;
    next();
  } catch (error: any) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json(new UnauthenticatedResponse("Invalid token").generate());
  }
};

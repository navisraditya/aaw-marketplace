import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { UnauthenticatedResponse } from "../../src/commons/patterns/exceptions";

export const verifyJWTProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({ message: "Invalid token" });
    }

    // Verify token using AUTH API
    const AUTH_API_URL = process.env.AUTH_API_URL || "http://localhost:8000";
    const tokenResponse = await axios.post(`${AUTH_API_URL}/api/auth/verify-token`, { token });

    if (tokenResponse.status !== 200) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const user = tokenResponse.data.user;

    // Fetch tenant info using TENANT API
    const SERVER_TENANT_ID = process.env.TENANT_ID;
    if (!SERVER_TENANT_ID) {
      return res.status(500).send({ message: "Server Tenant ID not found" });
    }

    const TENANTS_API_URL = process.env.TENANTS_API_URL || "http://localhost:8003";
    const tenantResponse = await axios.get(`${TENANTS_API_URL}/api/tenants/${SERVER_TENANT_ID}`);

    if (tenantResponse.status !== 200 || !tenantResponse.data) {
      return res.status(500).send({ message: "Server Tenant not found" });
    }

    const tenantData = tenantResponse.data.tenants;

    // Check for tenant ownership
    if (user.id !== tenantData.owner_id) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.body.user = user;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json(new UnauthenticatedResponse("Invalid token").generate());
  }
};

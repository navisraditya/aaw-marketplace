import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { UnauthenticatedResponse } from "../../src/commons/patterns/exceptions";

export const verifyJWTTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    // Verify token with AUTH service
    const AUTH_API_URL = process.env.AUTH_API_URL || "http://localhost:8000";
    const tokenResponse = await axios.post(`${AUTH_API_URL}/api/auth/verify-token`, { token });

    if (tokenResponse.status !== 200 || !tokenResponse.data?.user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach user data to request
    req.body.user = tokenResponse.data.user;
    next();
  } catch (error: any) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json(new UnauthenticatedResponse("Invalid token").generate());
  }
};

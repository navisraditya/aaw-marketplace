import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";

// Load AUTH API URL from environment variables
const AUTH_API_URL = process.env.AUTH_API_URL || "http://localhost:8000";

export const verifyJWTTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({ message: "Invalid token" });
    }

    // Make a request to the authentication service to verify the token
    const response = await axios.post(`${AUTH_API_URL}/api/auth/verify`, {
      token,
    });

    if (response.status !== 200) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.body.user = response.data.user;
    next();
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json(
      new UnauthenticatedResponse("Invalid token").generate()
    );
  }
};

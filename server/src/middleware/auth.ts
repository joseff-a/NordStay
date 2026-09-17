/**
 * Authentication Middleware
 * 
 * This middleware checks if a request has a valid JWT token.
 * If valid, it attaches the userId to the request object.
 * If invalid or missing, it returns a 401 Unauthorized error.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include userId
// This lets us use req.userId in our route handlers
export interface AuthRequest extends Request {
  userId?: string;
}

// Secret key for signing/verifying JWT tokens
// In production, this should be in an environment variable!
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to require authentication
 * 
 * Checks for Authorization header: "Bearer <token>"
 * Verifies the token and attaches userId to request
 */
export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized. Please provide a valid token.' 
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify and decode the token
    // If invalid, this will throw an error
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Attach userId to request object for use in route handlers
    req.userId = decoded.userId;

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ 
      error: 'Invalid or expired token.' 
    });
  }
};


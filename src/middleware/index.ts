/**
 * This middleware has been outdated and is replaced by the simple-jwt-auth-middleware package.
 */
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction as Next } from "express";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to verify token and attach user info to the request
export const authenticate = (req: Request, res: Response, next: Next): void => {
  // validate the request
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ error: "Authentication is not provided!" });
    return;
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token is not provided" });
    return;
    // return next(new Error("Unauthorized: No token provided"));
  }

  try {
    //   validate the premissions
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const decodedToken = decoded as jwt.JwtPayload & { user: any };

    if (!decoded || !decodedToken.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    req.user = decodedToken.user; // Attach the user payload (id, role) to the request
    next();
  } catch (err) {
    // next(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check user roles for protected routes
export const authorize = (req: Request, res: Response, next: Next): void => {
  if (!req.user || !req.user.roles || !Array.isArray(req.user.roles)) {
    res.status(403).json({ message: "Access denied" });
    return;
  }
  if (!req.user?.roles.includes("admin")) {
    res.status(403).json({ message: "Access denied" });
    return;
  }
  next();
};

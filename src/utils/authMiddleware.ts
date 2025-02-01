import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware combinado para autenticación y autorización
const authMiddleware = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verifica si hay un token en las cookies
      const token = req.cookies.authToken;
      if (!token) {
        return res.status(401).json({ message: 'No token provided', });
      }

      // Verifica si el token es correcto
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: string };

      // Verifica si el rol está permitido
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
      next();
    } catch (error) { 
      return res.status(401).json({ message: 'Invalid or expired token', error });
    }
  };
};

export { authMiddleware};

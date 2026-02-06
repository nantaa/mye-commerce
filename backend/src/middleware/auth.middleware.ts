import { Request, Response, NextFunction } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

// Define custom property on Request if needed, but ClerkExpressWithAuth handles it.
// We need to extend Express Request type to include `auth` property if we want strong typing.
declare global {
    namespace Express {
        interface Request {
            auth: {
                userId: string | null;
                sessionId: string | null;
                getToken: () => Promise<string | null>;
            };
        }
    }
}

// Config is loaded from CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY env vars
export const authMiddleware = ClerkExpressWithAuth({
    // options if needed
});

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !req.auth.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

import { PrismaClient } from '@prisma/client';
// @ts-ignore
const prisma = new PrismaClient(); // In a real app, import singleton

export const requireRole = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.auth || !req.auth.userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Fetch user from DB to check role
            // Note: In production, consider caching roles in the token (Clerk metadata) or Redis
            const user = await prisma.user.findUnique({
                where: { id: req.auth.userId } // Assuming Clerk User ID matches DB ID or is mapped
            });

            if (!user) {
                // If user doesn't exist in our DB yet, they might need to sync
                return res.status(403).json({ error: 'User record not found' });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error("Role check error", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
};

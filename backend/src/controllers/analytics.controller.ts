import { Request, Response } from 'express';
import redis from '../lib/redis';
// @ts-ignore
import { PrismaClient } from '@prisma/client';

// @ts-ignore
const prisma = new PrismaClient();

export const trackProductView = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Increment total views for the product
        await redis.incr(`analytics:views:product:${productId}`);

        // Increment daily total views
        await redis.incr(`analytics:views:daily:${date}`);

        res.json({ success: true });
    } catch (error) {
        console.error('Track View Error:', error);
        res.status(500).json({ error: 'Failed to track view' });
    }
};

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString().split('T')[0];

        const [
            totalUsers,
            totalOrders,
            totalRevenue,
            dailyViews
        ] = await Promise.all([
            prisma.user.count(),
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: { total: true }
            }),
            redis.get(`analytics:views:daily:${date}`)
        ]);

        res.json({
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue._sum.total || 0,
            dailyViews: Number(dailyViews) || 0
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

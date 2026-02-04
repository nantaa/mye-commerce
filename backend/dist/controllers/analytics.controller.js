"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.trackProductView = void 0;
const redis_1 = __importDefault(require("../lib/redis"));
// @ts-ignore
const client_1 = require("../generated/client/client");
// @ts-ignore
const prisma = new client_1.PrismaClient();
const trackProductView = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        // Increment total views for the product
        await redis_1.default.incr(`analytics:views:product:${productId}`);
        // Increment daily total views
        await redis_1.default.incr(`analytics:views:daily:${date}`);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Track View Error:', error);
        res.status(500).json({ error: 'Failed to track view' });
    }
};
exports.trackProductView = trackProductView;
const getDashboardStats = async (req, res) => {
    try {
        const date = new Date().toISOString().split('T')[0];
        const [totalUsers, totalOrders, totalRevenue, dailyViews] = await Promise.all([
            prisma.user.count(),
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: { total: true }
            }),
            redis_1.default.get(`analytics:views:daily:${date}`)
        ]);
        res.json({
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue._sum.total || 0,
            dailyViews: Number(dailyViews) || 0
        });
    }
    catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
exports.getDashboardStats = getDashboardStats;

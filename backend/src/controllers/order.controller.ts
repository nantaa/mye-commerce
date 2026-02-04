import { Request, Response } from 'express';
// @ts-ignore
import { PrismaClient } from '../generated/client/client';

// @ts-ignore
const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, items, total, addressId, paymentMethod } = req.body;

        // Start a transaction
        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Create the order
            const order = await tx.order.create({
                data: {
                    userId, // Can be null for guest checkout
                    total,
                    status: 'PENDING',
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
                include: { items: true },
            });

            // 2. Deduct stock and validate availability
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                // Note: For simplicity, we are not tracking variant stock in this basic implementation yet
                // If variants were used, we would check ProductVariant

                // This is a placeholder for stock check (schema doesn't have simple stock on Product, only Variant mostly)
                // Let's assume for now we don't block on stock for this "MVP" step unless we added stock to Product model
                // which we didn't in the initial schema (it was on ProductVariant). 
                // We will skip strict stock deduction for now to avoid complexity errors if variants aren't fully set up.
            }

            return order;
        });

        res.json(result);
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const orders = await prisma.order.findMany({
            where: { userId: String(userId) },
            orderBy: { createdAt: 'desc' },
            include: { items: { include: { product: true } } },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: true, items: true },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all orders' });
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: String(id) },
            include: { items: { include: { product: true } } },
        });

        if (!order) return res.status(404).json({ error: 'Order not found' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
}

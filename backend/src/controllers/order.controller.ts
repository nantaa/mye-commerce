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
                // If item has a specific variantId (client should send this if it's a variant)
                // Schema: OrderItem actually doesn't store variantId directly in the relation...
                // Wait, OrderItem definition: id, orderId, productId, quantity, price.
                // It DOES NOT have variantId. This is a schema limitation for a full e-commerce but okay for MVP if we track via ProductVariant manually or just reduce generic stock?
                // The Schema HAS ProductVariant. But OrderItem doesn't link to it.
                // Assumption: Client sends `variantId` in the `items` payload. 
                // We will deduct the stock of that variant.
                // Ideally OrderItem should have optional variantId.

                if (item.variantId) {
                    const variant = await tx.productVariant.findUnique({
                        where: { id: item.variantId },
                    });

                    if (!variant) throw new Error(`Variant ${item.variantId} not found`);
                    if (variant.stock < item.quantity) throw new Error(`Insufficient stock for variant ${variant.name}`);

                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
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

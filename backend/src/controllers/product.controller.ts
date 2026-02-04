import { Request, Response } from 'express';
import { PrismaClient } from '../generated/client/client';

// @ts-ignore
const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            category,
            minPrice,
            maxPrice,
            sort = 'newest'
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: String(search), mode: 'insensitive' } },
                { description: { contains: String(search), mode: 'insensitive' } },
            ];
        }

        if (category) {
            where.category = { slug: String(category) };
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = Number(minPrice);
            if (maxPrice) where.price.lte = Number(maxPrice);
        }

        let orderBy: any = {};
        if (sort === 'price_asc') orderBy.price = 'asc';
        else if (sort === 'price_desc') orderBy.price = 'desc';
        else if (sort === 'newest') orderBy.createdAt = 'desc';

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                take: limitNumber,
                skip,
                orderBy,
                include: {
                    images: true,
                    category: true,
                },
            }),
            prisma.product.count({ where }),
        ]);

        res.json({
            data: products,
            meta: {
                total,
                page: pageNumber,
                last_page: Math.ceil(total / limitNumber),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const product = await prisma.product.findUnique({
            where: { slug: String(slug) },
            include: {
                images: true,
                category: true,
                variants: true,
            },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

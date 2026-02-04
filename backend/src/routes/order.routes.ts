import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, getOrderById } from '../controllers/order.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Protect all order routes (or specific ones)
router.post('/', requireAuth, createOrder);
router.get('/user/:userId', requireAuth, getUserOrders); // TODO: Ensure userId matches auth.userId
router.get('/admin/all', requireAuth, getAllOrders); // TODO: Add Admin check
router.get('/:id', requireAuth, getOrderById);

export default router;

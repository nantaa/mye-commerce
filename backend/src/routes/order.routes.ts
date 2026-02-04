import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, getOrderById } from '../controllers/order.controller';

const router = Router();

router.post('/', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/admin/all', getAllOrders);
router.get('/:id', getOrderById);

export default router;

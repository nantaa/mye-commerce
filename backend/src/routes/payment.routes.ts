import { Router } from 'express';
import { createStripeIntent, createMidtransSnap } from '../controllers/payment.controller';

const router = Router();

router.post('/create-stripe-intent', createStripeIntent);
router.post('/create-midtrans-snap', createMidtransSnap);

export default router;

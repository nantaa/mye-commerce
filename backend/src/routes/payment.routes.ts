import { Router } from 'express';
import { createXenditInvoice, createDokuPayment, createMidtransSnap } from '../controllers/payment.controller';

const router = Router();

router.post('/create-xendit-invoice', createXenditInvoice);
router.post('/create-doku-payment', createDokuPayment);
router.post('/create-midtrans-snap', createMidtransSnap);

export default router;

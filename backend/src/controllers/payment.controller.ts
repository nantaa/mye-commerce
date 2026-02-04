import { Request, Response } from 'express';
import stripe from '../lib/stripe';
import { snap } from '../lib/midtrans';

export const createStripeIntent = async (req: Request, res: Response) => {
    try {
        const { amount, currency = 'usd' } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
};

export const createMidtransSnap = async (req: Request, res: Response) => {
    try {
        const { amount, orderId, customerDetails } = req.body;

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount,
            },
            customer_details: {
                first_name: customerDetails?.firstName,
                last_name: customerDetails?.lastName,
                email: customerDetails?.email,
                phone: customerDetails?.phone,
            },
            credit_card: {
                secure: true,
            },
        };

        const transaction = await snap.createTransaction(parameter);
        res.json({ token: transaction.token, redirect_url: transaction.redirect_url });
    } catch (error) {
        console.error('Midtrans error:', error);
        res.status(500).json({ error: 'Failed to create Snap transaction' });
    }
};

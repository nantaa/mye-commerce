"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMidtransSnap = exports.createStripeIntent = void 0;
const stripe_1 = __importDefault(require("../lib/stripe"));
const midtrans_1 = require("../lib/midtrans");
const createStripeIntent = async (req, res) => {
    try {
        const { amount, currency = 'usd' } = req.body;
        const paymentIntent = await stripe_1.default.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
};
exports.createStripeIntent = createStripeIntent;
const createMidtransSnap = async (req, res) => {
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
        const transaction = await midtrans_1.snap.createTransaction(parameter);
        res.json({ token: transaction.token, redirect_url: transaction.redirect_url });
    }
    catch (error) {
        console.error('Midtrans error:', error);
        res.status(500).json({ error: 'Failed to create Snap transaction' });
    }
};
exports.createMidtransSnap = createMidtransSnap;

import { Request, Response } from 'express';
// @ts-ignore
import { Invoice } from '../lib/xendit';
import { createDokuInvoice } from '../lib/doku';
import { snap } from '../lib/midtrans';


export const createXenditInvoice = async (req: Request, res: Response) => {
    try {
        const { orderId, amount, customerEmail } = req.body;

        // Setup invoice data
        const invoiceData = {
            externalId: orderId,
            amount: amount,
            payerEmail: customerEmail,
            description: `Invoice for Order #${orderId}`,
            shouldSendEmail: true,
        };

        const resp = await Invoice.createInvoice({
            data: invoiceData,
        });

        res.json({ invoiceUrl: resp.invoiceUrl });

    } catch (error) {
        console.error("Xendit Error:", error);
        res.status(500).json({ error: "Failed to create Xendit invoice" });
    }
};


export const createDokuPayment = async (req: Request, res: Response) => {
    try {
        const { orderId, amount, customerEmail } = req.body;

        const response = await createDokuInvoice(orderId, amount, customerEmail);

        res.json({ paymentUrl: response.response.payment.url }); // Adapting to Doku response structure
    } catch (error) {
        console.error('Doku Error:', error);
        res.status(500).json({ error: 'Failed to create Doku payment' });
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

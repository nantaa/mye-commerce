import axios from 'axios';
import crypto from 'crypto';

const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID || '';
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY || '';
const DOKU_API_URL = process.env.DOKU_API_URL || 'https://api-sandbox.doku.com';

const generateSignature = (payload: any, timestamp: string, path: string) => {
    const digest = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('base64');
    const rawSignature = `Client-Id:${DOKU_CLIENT_ID}\nRequest-Timestamp:${timestamp}\nRequest-Target:${path}\nDigest:${digest}`;
    return crypto.createHmac('sha256', DOKU_SECRET_KEY).update(rawSignature).digest('base64');
};

export const createDokuInvoice = async (orderId: string, amount: number, customerEmail: string) => {
    const path = '/checkout/v1/payment';
    const timestamp = new Date().toISOString();

    const payload = {
        order: {
            invoice_number: orderId,
            amount: amount,
        },
        payment: {
            payment_due_date: 60, // 60 minutes
        },
        customer: {
            email: customerEmail,
        }
    };

    const signature = generateSignature(payload, timestamp, path);

    try {
        const response = await axios.post(`${DOKU_API_URL}${path}`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Client-Id': DOKU_CLIENT_ID,
                'Request-Timestamp': timestamp,
                'Signature': `HMACSHA256=${signature}`,
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("Doku Error:", error.response?.data || error.message);
        throw new Error('Doku Payment Creation Failed');
    }
};

// @ts-ignore
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';

dotenv.config();

export const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder',
});

export const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder',
});

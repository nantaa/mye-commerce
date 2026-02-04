import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

import productRoutes from './routes/product.routes';
import paymentRoutes from './routes/payment.routes';
import orderRoutes from './routes/order.routes';
import analyticsRoutes from './routes/analytics.routes';

import { authMiddleware } from './middleware/auth.middleware';

app.use(cors());
app.use(express.json());
app.use(authMiddleware); // Populates req.auth on every request (loose mode)

app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
    res.send('E-Commerce Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

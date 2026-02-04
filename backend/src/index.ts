import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

import productRoutes from './routes/product.routes';
import paymentRoutes from './routes/payment.routes';
import orderRoutes from './routes/order.routes';

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('E-Commerce Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

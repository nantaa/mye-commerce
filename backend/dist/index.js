"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/products', product_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.get('/', (req, res) => {
    res.send('E-Commerce Backend is running!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

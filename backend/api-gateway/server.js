const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const cors = require('cors');
app.use(cors());

// Proxy routes
app.use('/api/auth', createProxyMiddleware({ target: 'http://auth-service:5000', changeOrigin: true }));
app.use('/api/orders', createProxyMiddleware({ target: 'http://order-service:8000', changeOrigin: true }));
//app.use('/api/restaurants', createProxyMiddleware({ target: 'http://restaurant-service:8001', changeOrigin: true }));
//app.use('/api/payments', createProxyMiddleware({ target: 'http://payment-service:8002', changeOrigin: true }));
//app.use('/api/notifications', createProxyMiddleware({ target: 'http://notification-service:8003', changeOrigin: true }));

app.listen(8080, () => {
  console.log('API Gateway running on port 8080');
});
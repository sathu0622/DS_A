// server.js or app.js
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // adjust in prod
    methods: ['GET', 'POST'],
  },
});

let deliverySockets = {};

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Delivery personnel register themselves
  socket.on('registerDelivery', (userId) => {
    deliverySockets[userId] = socket.id;
  });

  // Optional: Clean up on disconnect
  socket.on('disconnect', () => {
    for (let id in deliverySockets) {
      if (deliverySockets[id] === socket.id) {
        delete deliverySockets[id];
      }
    }
  });
});

// Function to send order notification to delivery personnel
const notifyDelivery = (deliveryPersonId, orderData) => {
  const socketId = deliverySockets[deliveryPersonId];
  if (socketId) {
    io.to(socketId).emit('orderAssigned', orderData);
  }
};

module.exports = { app, server, notifyDelivery };

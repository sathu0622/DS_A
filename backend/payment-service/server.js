const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectToDatabase = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5009;
const MONGO_URI = process.env.MONGO_URI;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
connectToDatabase();

const corsOptions = {
    origin: "*", 
    methods: "GET,POST,PUT,DELETE",
    credentials: true, 
  };
  
app.use(cors(corsOptions));

const calculateTotalOrderAmount = (items) => {
    return items.reduce((total, item) => total + item.amount * 100, 0);
  };
  
  app.post("/api/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    
    console.log("Received payment request:", items); 
  
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateTotalOrderAmount(items),
            currency: "cad",
            description: "QR Life Time Payment",
            automatic_payment_methods: { enabled: true },
        });
  
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send({ error: error.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
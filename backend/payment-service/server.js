const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToDatabase = require("./config/database");

const app = express();
const PORT = process.env.PORT || 8001;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
connectToDatabase();

// const corsOptions = {
//     origin: "*", 
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true, 
//   };
  
// app.use(cors(corsOptions));

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000",  "http://food-app.127.0.0.1.nip.io"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  credentials: true,
};

  
app.use(cors(corsOptions));

const paymentRoutes = require('./routes/paymentRoutes');
const promoRoutes = require('./routes/promoRoutes');

const calculateTotalOrderAmount = (items) => {
    return items.reduce((total, item) => total + item.amount * 100, 0);
  };
  
  app.post("/api/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    
    console.log("Received payment request:", items); 
  
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateTotalOrderAmount(items),
            currency: "lkr",
            description: "food payment",
            automatic_payment_methods: { enabled: true },
        });
  
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send({ error: error.message });
    }
  });

app.use('/api/promo', promoRoutes);
app.use('/api/payments', paymentRoutes);

  // app.listen(PORT, () => {
  //   console.log(`Server is running on port ${PORT}`);
  // });
  app.listen(PORT, '0.0.0.0', () => console.log("Server running"));
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDatabase = require('./config/database');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectToDatabase();
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
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

  
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);

// app.listen(PORT, () => {
//   console.log(`Auth service is running on port ${PORT}`);
// });

app.listen(5000, '0.0.0.0', () => console.log("Server running"));

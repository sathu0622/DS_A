const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDatabase = require('./config/database');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectToDatabase();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
});

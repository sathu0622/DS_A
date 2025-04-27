const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToDatabase = require("./config/database");
const deliveryRoutes = require('./routes/deliveryTrackingRoutes');
const driverRoutes = require('./routes/driverRoutes');

const app = express();
const PORT = process.env.PORT || 8002;

app.use(express.json());
connectToDatabase();

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use('/api/drivers', driverRoutes);
app.use('/api/deliveryTracking', deliveryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

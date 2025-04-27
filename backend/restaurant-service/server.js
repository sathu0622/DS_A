const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToDatabase = require("./config/database");


const menuRoutes = require("./routes/menuRoutes");
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());
connectToDatabase();

const corsOptions = {
	origin: "*",
	methods: "GET,POST,PUT,DELETE",
	credentials: true,
};

app.use(cors(corsOptions));


app.listen(PORT, () => {
	console.log(`Restaurant service is running on port ${PORT}`);
});

app.use("/api/menu", menuRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/restaurants', restaurantRoutes);


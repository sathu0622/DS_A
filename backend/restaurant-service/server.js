const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToDatabase = require("./config/database");

const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");


const app = express();
const PORT = process.env.PORT || 8001;

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
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToDatabase = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const orderRoutes = require("./routes/orderRoutes");
const addToCartRoutes = require("./routes/addToCartRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
connectToDatabase();

const corsOptions = {
	origin: "*",
	methods: "GET,POST,PUT,DELETE",
	credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/orders", orderRoutes);
app.use("/api/addtocart", addToCartRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Order service is running on port ${PORT}`);
});


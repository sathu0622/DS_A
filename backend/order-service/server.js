const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToDatabase = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const pendingOrderRoutes = require("./routes/pendingOrderRoutes");
const addToCartRoutes = require("./routes/addToCartRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
connectToDatabase();

const corsOptions = {
	origin: "*",
	methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
	credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/orders", pendingOrderRoutes);
app.use("/api/addtocart", addToCartRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Order service is running on port ${PORT}`);
});


const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToDatabase = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const pendingOrderRoutes = require("./routes/pendingOrderRoutes");
const addToCartRoutes = require("./routes/addToCartRoutes");
const cron = require("node-cron");
const PendingOrder = require("./models/PendingOrder");
const CompleteOrder = require("./models/CompleteOrder");

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

// Schedule a job to run every minute
cron.schedule("* * * * *", async () => {
	try {
		const tenMinutesAgo = new Date(Date.now() - 20 * 60 * 1000); // 10 minutes ago

		// Find orders with status "Completed" that were updated more than 10 minutes ago
		const completedOrders = await PendingOrder.find({
			status: "Complete",
			updatedAt: { $lte: tenMinutesAgo },
		});

		for (const order of completedOrders) {
			// Move the order to the CompleteOrder table
			const completeOrder = new CompleteOrder({
				userId: order.userId,
				restaurantId: order.restaurantId,
				items: order.items,
				address: order.address,
				paymentOption: order.paymentOption,
				status: "Complete",
				createdAt: order.createdAt,
				completedAt: order.updatedAt,
			});
			await completeOrder.save();
			await PendingOrder.findByIdAndDelete(order._id);
			console.log(`Order ${order._id} moved to CompleteOrder table.`);
		}
	} catch (error) {
		console.error("Error processing completed orders:", error);
	}
});


const mongoose = require("mongoose");

const completeOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
      quantity: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
    },
  ],
  address: { type: String, required: true },
  paymentOption: { type: String, required: true },
  status: { type: String, default: "Complete" },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CompleteOrder", completeOrderSchema);
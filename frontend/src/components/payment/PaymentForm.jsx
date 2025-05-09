import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import axios from "axios";

const PAYMENT_SUCCESS_URL = "http://localhost:5173/tracking"; 

const PaymentForm = ({ totalAmount, orderId, userId, restaurantId}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const savePaymentDetails = async (paymentData) => {
      try {
        const response = await axios.post("http://food-app.127.0.0.1.nip.io/api/payments/save-payment", {
          ...paymentData,
          orderId,
          userId,
          restaurantId,
        });
        console.log("Payment saved successfully:", response.data);
      } catch (err) {
        console.error("Failed to save payment:", err);
      }
    };

    const updateOrderStatus = async () => {
      try {
        console.log("Updating orderId:", orderId); 
        const response = await axios.patch(
          `http://food-app.127.0.0.1.nip.io/api/orders/pending-orders/${orderId}/status`
        );
        console.log("Order status updated:", response.data);
      } catch (err) {
        console.error("Failed to update order status:", err.response?.data || err.message);
      }
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setMessage("Stripe not ready. Please try again shortly.");
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const name = localStorage.getItem("fullName") || "Sathushan";
        const email = localStorage.getItem("email") || "sathushan622@gmail.com";

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) throw new Error(submitError.message);

            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    payment_method_data: {
                        billing_details: { name, email },
                    },
                },
                redirect: "if_required",
            });

            if (result.error) throw new Error(result.error.message);
            const { paymentIntent } = result;

            if (paymentIntent?.status === "succeeded") {
                await savePaymentDetails({
                    userId,
                    restaurantId,
                    orderId,
                    stripePaymentId: paymentIntent.id,
                    stripeCustomerId: paymentIntent.customer,
                    // amount: paymentIntent.amount/100,
                    amount: totalAmount,
                    status: paymentIntent.status,
                });
                await updateOrderStatus(); 
                setMessage("Payment successful!");
                window.location.href = PAYMENT_SUCCESS_URL;
            } else {
                setMessage("Payment not completed. Please try again.");
            }
        } catch (err) {
            console.error("Payment error:", err);
            setMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white px-4 py-8">
        <motion.div
          className="w-full max-w-lg border-2 border-red-500 shadow-xl rounded-2xl p-6 bg-white/90 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
            Secure Payment
          </h1>
  
          <div className="text-lg font-semibold text-center text-gray-800 mb-4">
            Total:{" "}
            <span className="text-red-500">{totalAmount.toFixed(2)}</span>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
  
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
              disabled={isLoading || !stripe || !elements}
            >
              {isLoading ? "Processing..." : "Pay Now"}
            </motion.button>
          </form>
  
          {message && (
            <div className="mt-4 text-center text-red-600 font-medium">{message}</div>
          )}
        </motion.div>
      </div>
    );
};

export default PaymentForm;

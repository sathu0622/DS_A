import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import PaymentForm from "./PaymentForm";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripePayment = () => {
  const location = useLocation();
  const { orderId, userId, restaurantId, amount } = location.state || {};

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [appliedCode, setAppliedCode] = useState(null);
  const [finalAmount, setFinalAmount] = useState(amount);
  const [applyingPromo, setApplyingPromo] = useState(false);

  const fetchClientSecret = async (amountToUse) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8001/api/create-payment-intent", {
        items: [{ id: orderId, name: "Order Payment", amount: amountToUse }],
      });
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error fetching client secret:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (amount) {
      fetchClientSecret(finalAmount);
    }
  }, [finalAmount]);

  const handleApplyPromo = async () => {
    setApplyingPromo(true);
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.post("http://localhost:8001/api/promo/apply-promo", {
        userId,
        promoCode,
      });

      const discountPercentage = res.data.discountPercentage;
      const discountedAmount = amount - (amount * discountPercentage) / 100;

      setDiscount(discountPercentage);
      setAppliedCode(promoCode);
      setErrorMessage("");
      setFinalAmount(Math.round(discountedAmount));

      // 🎉 Trigger confetti on success
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
      setDiscount(0);
      setAppliedCode(null);
      setErrorMessage(err.response?.data?.error || "Invalid promo code");
    } finally {
      setApplyingPromo(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 p-6">
      {/* Left Side - Payment Form */}
      <div className="md:w-2/3 w-full bg-white rounded-2xl shadow-lg p-6">
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              totalAmount={finalAmount} // Pass discounted final amount correctly!
              orderId={orderId}
              userId={userId}
              restaurantId={restaurantId}
            />
          </Elements>
        )}
      </div>

      {/* Right Side - Promo Code */}
      <div className="md:w-1/3 w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-red-600 mb-3 text-center">
          🎁 Apply Promo Code
        </h3>
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter your promo code"
          className={`border p-3 rounded w-full focus:outline-none focus:ring-2 ${appliedCode ? "focus:ring-green-400" : "focus:ring-red-400"
            } transition-all mb-3`}
          disabled={applyingPromo}
        />
        <button
          onClick={handleApplyPromo}
          disabled={!promoCode || applyingPromo}
          className={`w-full py-2.5 rounded transition ${applyingPromo
            ? "bg-red-300 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 text-white"
            }`}
        >
          Apply Promo
        </button>

        <AnimatePresence>
          {errorMessage && (
            <motion.p
              className="text-red-500 text-sm mt-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              ❌ {errorMessage}
            </motion.p>
          )}
          {appliedCode && (
            <motion.p
              className="text-green-600 text-sm mt-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              ✅ Promo <strong>{appliedCode}</strong> applied: {discount}% OFF!
            </motion.p>
          )}
        </AnimatePresence>

        {/* Summary */}
        <div className="bg-red-50 mt-5 p-4 rounded-lg shadow-inner">
          <div className="flex justify-between">
            <span>Original Amount:</span>
            <span>RS: {amount}</span>
          </div>
          {discount > 0 && (
            <>
              <div className="flex justify-between text-green-600">
                <span>Discount ({discount}%):</span>
                <span>- RS: {(amount * discount / 100).toFixed(2)}</span>
              </div>
              <hr className="my-2" />
            </>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Final Amount to Pay:</span>
            <span>RS: {finalAmount}</span>
          </div>
        </div>
      </div>
</div>

  );
};

export default StripePayment;

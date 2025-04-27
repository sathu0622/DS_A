// import React, { useState, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import axios from "axios";
// import PaymentForm from "./PaymentForm";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// const StripePayment = () => {
//     const [clientSecret, setClientSecret] = useState("");
//     const [loading, setLoading] = useState(false);

//     const fetchClientSecret = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.post("http://localhost:8001/api/create-payment-intent", {
//                 items: [{ id: "default", name: "Default Plan", amount: 1000 }],
//             });
//             setClientSecret(response.data.clientSecret);
//         } catch (error) {
//             console.error("Error fetching client secret:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchClientSecret();
//     }, []);

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-white">
//             <div className="p-6 bg-white border-2 border-orange-500 shadow-xl rounded-2xl w-96 text-center">
//                 <h2 className="text-2xl font-bold text-orange-600 mb-4">Complete Your Payment</h2>
//                 {loading && <p className="text-orange-500">Loading payment details...</p>}
//                 {clientSecret && (
//                     <Elements stripe={stripePromise} options={{ clientSecret }}>
//                         <PaymentForm totalAmount={1000 / 100} /> {/* converting to dollars */}
//                     </Elements>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default StripePayment;
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

  // const handleApplyPromo = async () => {
  //   setApplyingPromo(true);
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     const res = await axios.post("http://localhost:8001/api/promo/apply-promo", {
  //       userId,
  //       promoCode,
  //     });

  //     const discountPercentage = res.data.discountPercentage;
  //     const discountedAmount = amount - (amount * discountPercentage) / 100;

  //     setDiscount(discountPercentage);
  //     setAppliedCode(promoCode);
  //     setErrorMessage("");
  //     setFinalAmount(Math.round(discountedAmount));

  //     // 🎉 Fetch new clientSecret with the discounted amount!
  //     await fetchClientSecret(Math.round(discountedAmount));

  //     // Trigger confetti 🎉
  //     confetti({
  //       particleCount: 100,
  //       spread: 70,
  //       origin: { y: 0.6 },
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     setDiscount(0);
  //     setAppliedCode(null);
  //     setErrorMessage(err.response?.data?.error || "Invalid promo code");
  //   } finally {
  //     setApplyingPromo(false);
  //   }
  // };


  return (
    // <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100 p-6">
    //   <motion.h2
    //     className="text-4xl font-bold text-orange-600 mb-8 text-center"
    //     initial={{ opacity: 0, y: -20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.8 }}
    //   >
    //     Complete Your Payment
    //   </motion.h2>

    //   <motion.div
    //     className="flex flex-col md:flex-row gap-6 bg-white/80 w-full max-w-4xl p-6 rounded-2xl shadow-lg backdrop-blur-md"
    //     initial={{ opacity: 0, scale: 0.95 }}
    //     animate={{ opacity: 1, scale: 1 }}
    //     transition={{ duration: 0.5 }}
    //   >
    //     {/* Promo Code Section */}
    //     <div className="md:w-1/2 w-full bg-white border border-dashed border-orange-300 rounded-xl p-5 shadow-sm">
    //       <h3 className="text-2xl font-semibold text-orange-600 mb-4 text-center">
    //         🎁 Have a Promo Code?
    //       </h3>
    //       <div className="relative mb-3">
    //         <input
    //           type="text"
    //           value={promoCode}
    //           onChange={(e) => setPromoCode(e.target.value)}
    //           placeholder="Enter your promo code"
    //           className={`border p-3 rounded w-full focus:outline-none focus:ring-2 ${appliedCode ? "focus:ring-green-400" : "focus:ring-orange-400"
    //             } transition-all`}
    //           disabled={applyingPromo}
    //         />
    //         {applyingPromo && (
    //           <span className="absolute right-4 top-3 animate-spin">🔄</span>
    //         )}
    //       </div>
    //       <button
    //         onClick={handleApplyPromo}
    //         disabled={!promoCode || applyingPromo}
    //         className={`w-full py-2.5 rounded transition ${applyingPromo
    //           ? "bg-orange-300 cursor-not-allowed"
    //           : "bg-orange-500 hover:bg-orange-600 text-white"
    //           }`}
    //       >
    //         Apply Promo
    //       </button>
    //       <AnimatePresence>
    //         {errorMessage && (
    //           <motion.p
    //             className="text-red-500 text-sm mt-3 text-center"
    //             initial={{ opacity: 0 }}
    //             animate={{ opacity: 1 }}
    //             exit={{ opacity: 0 }}
    //           >
    //             ❌ {errorMessage}
    //           </motion.p>
    //         )}
    //         {appliedCode && (
    //           <motion.p
    //             className="text-green-600 text-sm mt-3 text-center"
    //             initial={{ opacity: 0 }}
    //             animate={{ opacity: 1 }}
    //             exit={{ opacity: 0 }}
    //           >
    //             ✅ Promo <strong>{appliedCode}</strong> applied: {discount}% OFF!
    //           </motion.p>
    //         )}
    //       </AnimatePresence>
    //     </div>

    //     {/* Payment Section */}
    //     <div className="md:w-1/2 w-full text-center flex flex-col justify-center">
    //       {loading && (
    //         <p className="text-orange-500 mb-4">Loading payment details...</p>
    //       )}

    //       <motion.div
    //         className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-5 shadow-md"
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1 }}
    //         transition={{ delay: 0.3 }}
    //       >
    //         <h4 className="text-lg font-semibold text-orange-600 mb-3">
    //           🧾 Order Summary
    //         </h4>
    //         <div className="flex justify-between font-bold text-xl">
    //           <span>Total to Pay:</span>
    //           <span>RS: {finalAmount}</span>
    //         </div>
    //       </motion.div>

    //       {clientSecret && (
    //         <Elements stripe={stripePromise} options={{ clientSecret }}>
    //           <PaymentForm
    //             totalAmount={finalAmount}
    //             orderId={orderId}
    //             userId={userId}
    //             restaurantId={restaurantId}
    //           />
    //         </Elements>
    //       )}
    //     </div>
    //   </motion.div>
    // </div>
    <div className="flex flex-col md:flex-row gap-6 min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100 p-6">
      {/* Left Side - Payment Form */}
      <div className="md:w-2/3 w-full bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">💳 Payment Details</h2>
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
        <h3 className="text-xl font-semibold text-orange-600 mb-3 text-center">
          🎁 Apply Promo Code
        </h3>
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter your promo code"
          className={`border p-3 rounded w-full focus:outline-none focus:ring-2 ${appliedCode ? "focus:ring-green-400" : "focus:ring-orange-400"
            } transition-all mb-3`}
          disabled={applyingPromo}
        />
        <button
          onClick={handleApplyPromo}
          disabled={!promoCode || applyingPromo}
          className={`w-full py-2.5 rounded transition ${applyingPromo
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
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
        <div className="bg-orange-50 mt-5 p-4 rounded-lg shadow-inner">
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

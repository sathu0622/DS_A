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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripePayment = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [appliedCode, setAppliedCode] = useState(null);

  const baseAmount = 1000; // in cents ($10.00)

  const fetchClientSecret = async (amountToPay = baseAmount) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8001/api/create-payment-intent", {
        items: [{ id: "default", name: "Default Plan", amount: amountToPay }],
      });
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error fetching client secret:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientSecret();
  }, []);

  const handleApplyPromo = async () => {
    try {
      const userId = localStorage.getItem("userId"); // replace with actual user ID logic

      const res = await axios.post("http://localhost:8001/api/promo/apply-promo", {
        userId,
        promoCode,
      });

      const discountPercentage = res.data.discountPercentage;
      const discountedAmount = baseAmount - (baseAmount * discountPercentage) / 100;

      setDiscount(discountPercentage);
      setAppliedCode(promoCode);
      setErrorMessage("");

      fetchClientSecret(Math.round(discountedAmount)); // round to nearest cent

    } catch (err) {
      console.error(err);
      setDiscount(0);
      setAppliedCode(null);
      setErrorMessage(err.response?.data?.error || "Invalid promo code");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="p-6 bg-white border-2 border-orange-500 shadow-xl rounded-2xl w-96 text-center">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Complete Your Payment</h2>

        <div className="mb-4">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleApplyPromo}
            className="mt-2 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            Apply Promo
          </button>
          {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
          {appliedCode && (
            <p className="text-green-600 text-sm mt-1">
              Promo <strong>{appliedCode}</strong> applied: {discount}% OFF
            </p>
          )}
        </div>

        {loading && <p className="text-orange-500">Loading payment details...</p>}

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm totalAmount={(baseAmount * (1 - discount / 100)) / 100} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default StripePayment;

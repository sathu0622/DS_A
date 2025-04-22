// import React, { useState } from "react";
// import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { motion } from "framer-motion";

// const PAYMENT_SUCCESS_URL = "http://localhost:5173/success";

// const PaymentForm = ({ totalAmount }) => {
//     const stripe = useStripe();
//     const elements = useElements();

//     const [message, setMessage] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!stripe || !elements) return;
    
//         setIsLoading(true);
//         setMessage("Processing your payment...");
    
//         // Ensure all elements are submitted correctly
//         const { error: submitError } = await elements.submit();
//         if (submitError) {
//             setMessage(submitError.message);
//             setIsLoading(false);
//             return;
//         }        
    
//         // Confirm the payment
//         // const { paymentIntent, error } = await stripe.confirmPayment({
//         //     elements,
//         //     confirmParams: { return_url: PAYMENT_SUCCESS_URL },
//         //     redirect: "if_required", // Prevents redirect issues
//         // });
//         const { paymentIntent, error } = await stripe.confirmPayment({
//             elements,
//             confirmParams: {
//                 return_url: PAYMENT_SUCCESS_URL,
//                 payment_method_data: {
//                     billing_details: {
//                         name: "Customer Name",
//                         email: "customer@example.com", // Optionally, pass customer email
//                     }
//                 }
//             }
//         });
        
//         if (error) {
//             setMessage(error.message || "Oops! Something went wrong. Please try again.");
//         } else if (paymentIntent && paymentIntent.status === "succeeded") {
//              // Save payment details to backend
//     try {
//         await axios.post("http://localhost:8001/api/payments", {
//             userId: "USER_ID", // replace with actual user data
//             restaurantId: "RESTAURANT_ID", // replace if applicable
//             orderId: "ORDER_ID", // pass from context or props
//             stripePaymentId: paymentIntent.id,
//             stripeCustomerId: paymentIntent.customer,
//             amount: paymentIntent.amount,
//             status: paymentIntent.status,
//         });
//         setMessage("Payment successful and saved!");
//     } catch (saveError) {
//         console.error("Failed to save payment:", saveError);
//         setMessage("Payment successful, but saving failed.");
//     }
//         } else {
//             setMessage("Payment incomplete. Please try again.");
//         }
    
//         setIsLoading(false);
//     };
    

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
//             <motion.div 
//                 className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
//                     Secure Payment
//                 </h1>
                
//                 {/* Display Total Amount */}
//                 <div className="text-lg font-semibold text-center text-gray-700 mb-4">
//                     Total Amount: <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <PaymentElement />
//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
//                         disabled={isLoading || !stripe || !elements}
//                     >
//                         {isLoading ? "Processing..." : "Pay Now"}
//                     </motion.button>
//                 </form>
//                 {message && (
//                     <div className="mt-4 text-center text-red-600 font-medium">
//                         {message}
//                     </div>
//                 )}
//             </motion.div>
//         </div>
//     );
// };

// export default PaymentForm;



// import React, { useState } from "react";
// import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { motion } from "framer-motion";
// import axios from "axios";

// const PAYMENT_SUCCESS_URL = "http://localhost:5173/success"; // Update as needed

// const PaymentForm = ({ totalAmount }) => {
//     const stripe = useStripe();
//     const elements = useElements();

//     const [message, setMessage] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!stripe || !elements) return;

//         setIsLoading(true);
//         // setMessage("Processing your payment...");

//         const name = localStorage.getItem("fullName") || "Customer Name";
//         const email = localStorage.getItem("email") || "customer@example.com";
//         const userId = localStorage.getItem("userId") || "jhjhjhjh";
//         const restaurantId = localStorage.getItem("restaurantId") || "jhjhjhjh";
//         const orderId = localStorage.getItem("orderId") || "jhjhjhjh";

//         try {
//             const { error: submitError } = await elements.submit();
//             if (submitError) {
//                 throw new Error(submitError.message);
//             }

//             const { paymentIntent, error } = await stripe.confirmPayment({
//                 elements,
//                 confirmParams: {
//                     payment_method_data: {
//                         billing_details: {
//                             name,
//                             email,
//                         },
//                     },
//                 },
//                 redirect: "if_required",
//             });

//             if (error) {
//                 throw new Error(error.message || "Oops! Something went wrong.");
//             }

//             if (paymentIntent?.status === "succeeded") {
//                 await savePaymentDetails({
//                     userId,
//                     restaurantId,
//                     orderId,
//                     stripePaymentId: paymentIntent.id,
//                     stripeCustomerId: paymentIntent.customer,
//                     amount: paymentIntent.amount,
//                     status: paymentIntent.status,
//                 });
//                 setMessage("Payment successful!");
//                 window.location.href = PAYMENT_SUCCESS_URL;
//             } else {
//                 setMessage("Payment incomplete. Please try again.");
//             }
//         } catch (err) {
//             console.error("Payment error:", err);
//             setMessage(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const savePaymentDetails = async (paymentData) => {
//         try {
//             const response = await axios.post("http://localhost:8001/api/payments/save-payment", paymentData);
//             console.log("Payment saved successfully:", response.data);
//         } catch (err) {
//             console.error("Failed to save payment:", err);
//             setMessage("Payment successful, but saving details failed.");
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-white px-4 py-8">
//             <motion.div
//                 className="w-full max-w-lg border-2 border-orange-500 shadow-xl rounded-2xl p-6"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold text-orange-600 text-center mb-6">
//                     Secure Payment
//                 </h1>

//                 <div className="text-lg font-semibold text-center text-gray-800 mb-4">
//                     Total: <span className="text-orange-500">${totalAmount.toFixed(2)}</span>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <PaymentElement />

//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
//                         disabled={isLoading || !stripe || !elements}
//                     >
//                         {isLoading ? "Processing..." : "Pay Now"}
//                     </motion.button>
//                 </form>

//                 {message && (
//                     <div className="mt-4 text-center text-red-600 font-medium">
//                         {message}
//                     </div>
//                 )}
//             </motion.div>
//         </div>
//     );
// };

// export default PaymentForm;


import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import axios from "axios";

const PAYMENT_SUCCESS_URL = "http://localhost:5173/success"; // Update for production

const PaymentForm = ({ totalAmount }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setMessage("Stripe not ready. Please try again shortly.");
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const name = localStorage.getItem("fullName") || "Customer Name";
        const email = localStorage.getItem("email") || "customer@example.com";
        const userId = localStorage.getItem("userId") || "661e84aaf39c4c04d8f2781b";
        const restaurantId = localStorage.getItem("restaurantId") || "661e84aaf39c4c04d8f2781b";
        const orderId = localStorage.getItem("orderId") || "661e84aaf39c4c04d8f2781b";

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
                    amount: paymentIntent.amount,
                    status: paymentIntent.status,
                });

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

    const savePaymentDetails = async (paymentData) => {
        try {
            const response = await axios.post("http://localhost:8001/api/payments/save-payment", paymentData);
            console.log("Payment saved successfully:", response.data);
        } catch (err) {
            console.error("Failed to save payment:", err);
            setMessage("Payment successful, but saving details failed.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white px-4 py-8">
            <motion.div
                className="w-full max-w-lg border-2 border-orange-500 shadow-xl rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-orange-600 text-center mb-6">
                    Secure Payment
                </h1>

                <div className="text-lg font-semibold text-center text-gray-800 mb-4">
                    Total: <span className="text-orange-500">${totalAmount.toFixed(2)}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <PaymentElement />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
                        disabled={isLoading || !stripe || !elements}
                    >
                        {isLoading ? "Processing..." : `Pay Now`}
                    </motion.button>
                </form>

                {message && (
                    <div className="mt-4 text-center text-red-600 font-medium">
                        {message}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PaymentForm;

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
//                 // Example static item, adjust as needed
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
//                         <PaymentForm totalAmount={1000} /> {/* Adjust this if needed */}
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

    const fetchClientSecret = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8001/api/create-payment-intent", {
                items: [{ id: "default", name: "Default Plan", amount: 1000 }],
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

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="p-6 bg-white border-2 border-orange-500 shadow-xl rounded-2xl w-96 text-center">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">Complete Your Payment</h2>
                {loading && <p className="text-orange-500">Loading payment details...</p>}
                {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm totalAmount={1000 / 100} /> {/* converting to dollars */}
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default StripePayment;

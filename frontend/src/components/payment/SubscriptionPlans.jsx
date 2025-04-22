import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SubscriptionPlans = () => {
    const { cardId } = useParams();

    const plans = [
        { id: "three_months", name: "3-Month Plan", price: 25, duration: "3 Months", benefits: ["Discounted Price", "Full Access", "Cancel Anytime"] },
        { id: "lifetime", name: "Lifetime Plan", price: 100, duration: "Lifetime", benefits: ["One-Time Payment", "Full Access Forever"] },
    ];

    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-500 via-black to-gray-500 p-6 overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0">
                <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
                <div className="absolute w-80 h-80 bg-white opacity-10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
            </div>

            <motion.h1 
                className="text-5xl font-extrabold text-white mb-10 relative z-10"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Choose Your Plan
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {plans.map((plan, index) => (
                    <motion.div 
                        key={plan.id} 
                        className="bg-white shadow-xl rounded-2xl p-8 text-center w-80 relative overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        {/* Animated Glow Effect */}
                        <div className="absolute w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl -top-24 -left-24"></div>

                        <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
                        <p className="text-3xl text-blue-600 font-extrabold mt-2">${plan.price}</p>
                        <p className="text-gray-500">{plan.duration}</p>
                        <ul className="mt-4 text-gray-700">
                            {plan.benefits.map((benefit, index) => (
                                <li key={index} className="mb-1">✅ {benefit}</li>
                            ))}
                        </ul>

                        <motion.div whileTap={{ scale: 0.95 }}>
                            <button
                                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-lg inline-block text-lg font-semibold transition-all duration-300"
                                onClick={() => navigate(`/payment/${cardId}`, { state: { plan, cardId } })}
                            >
                                Select Plan
                            </button>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPlans;

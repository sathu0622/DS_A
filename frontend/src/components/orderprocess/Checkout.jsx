import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/main_components/NavBar";
import StripePayment from "../payment/StripePayment"; 

const Checkout = () => {
  const location = useLocation();
	const navigate = useNavigate();
  const { cartItems, restaurantName, restaurantLocation, subtotal } = location.state || {};

  const deliveryFee = 150;
  const [serviceFee, setServiceFee] = useState(30);
	const [selectedOption, setSelectedOption] = useState("Cash on Delivery");
	const [selectedDeliveryOption, setSelectedDeliveryOption] = useState("Standard");
  const [isLoading, setIsLoading] = useState(false); 
  const total = subtotal + deliveryFee + serviceFee;

  const handlePaymentMethodChange = (method) => {
    setSelectedOption(method);
    if (method === "Card Payment") {
		setServiceFee(0); 
      setIsLoading(true); 
      setTimeout(() => {
        setIsLoading(false);
        navigate("/payment");
      }, 2000); 
    } else {
      setServiceFee(30);
    }
  };

  const handleDeliveryOptionChange = (option) => {
    setSelectedDeliveryOption(option);
    if (option === "Priority") {
      setServiceFee(serviceFee + 200); 
    } else {
      setServiceFee(serviceFee - 200);
    }
  };

	const handlePlaceOrder = async () => {
		try {
			const userId = localStorage.getItem("userId");
			const restaurantId = cartItems[0]?.restaurantId; // Assuming all items are from the same restaurant
			const address = "Seewalee Mawatha, Kaduwela"; // Replace with dynamic address input if needed

			const response = await fetch("http://localhost:8000/api/orders/pending-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId,
					restaurantId,
					items: cartItems.map((item) => ({
						menuItemId: item.menuItemId,
						quantity: item.quantity,
						totalAmount: item.totalAmount,
					})),
					address,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to place order");
			}

			const data = await response.json();
			alert("Order placed successfully!");

			// Clear the cart and navigate to a success page
			navigate("/");
		} catch (error) {
			console.error("Error placing order:", error);
			alert("Failed to place order. Please try again.");
		}
	};

  return (
    <div>
      <NavBar />
		  <div className="min-h-screen bg-gray-100 p-4 pl-20 pr-20">
			  <h1 className="text-3xl font-bold mb-2 ml-5">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-600 font-bold">Seewalee Mawatha Kaduwela</p>
                  <p className="text-gray-500">New Kandy Road, Malabe</p>
                </div>
                <button className="bg-gray-300 text-black text-sm font-bold rounded-4xl py-1 px-2 hover:bg-gray-400">
                  Edit
                </button>
              </div>
              <h2 className="text-xl font-bold mb-4">Delivery Options</h2>
              <button
                className={`flex items-center justify-between mb-4 border p-4 rounded-lg w-full ${
                  selectedDeliveryOption === "Priority" ? "border-black" : "border-gray-300"
                }`}
                onClick={() => handleDeliveryOptionChange("Priority")}
              >
                <div>
                  <p className="text-gray-600 font-bold">
                    Priority <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2">Faster</span>
                  </p>
                  <p className="text-gray-500 text-sm">20-30 min • Delivered directly to you</p>
                </div>
                <p className="text-gray-600 font-bold">+LKR 200.00</p>
              </button>
              <button
                className={`flex items-center justify-between mb-4 border p-4 rounded-lg w-full ${
                  selectedDeliveryOption === "Standard" ? "border-black" : "border-gray-300"
                }`}
                onClick={() => handleDeliveryOptionChange("Standard")}
              >
                <div>
                  <p className="text-gray-600 font-bold">Standard</p>
                  <p className="text-gray-500 text-sm">40-55 min</p>
                </div>
              </button>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">Payment Options</h2>
              	<p className="text-green-600 font-bold mb-4">
					Have a nice day! You choose card payment. Then Service Fee is 0.00
				</p>
			  <div className="flex justify-between items-center">
                {/* Cash on Delivery */}
							  <div className="flex items-center  ml-20">
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={selectedOption === "Cash on Delivery"}
                    onChange={() => handlePaymentMethodChange("Cash on Delivery")}
                    className="mr-2"
                  />
                  <label htmlFor="cashOnDelivery" className="text-black font-bold text-lg">
                    Cash on Delivery
                  </label>
                </div>

                {/* Card Payment */}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cardPayment"
                    name="paymentMethod"
                    value="Card Payment"
                    checked={selectedOption === "Card Payment"}
                    onChange={() => handlePaymentMethodChange("Card Payment")}
                    className="mr-2"
								  />
								  <label htmlFor="cardPayment" className="text-black font-bold text-lg mr-20">
                    Card Payment
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Cart Summary */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
              <p className="text-gray-600 font-bold">{restaurantName}</p>
              <p className="text-gray-500 mb-4">{restaurantLocation}</p>
              <ul>
                {cartItems.map((item) => (
                  <li key={item._id} className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-bold">{item.menuItemName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">LKR {item.totalAmount}</p>
                  </li>
                ))}
              </ul>
              <hr className="my-4" />
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-bold">LKR {subtotal}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Delivery Fee</p>
                <p className="font-bold">LKR {deliveryFee}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-gray-600">Service Fee</p>
                <p className="font-bold">LKR {serviceFee}</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <p>Total</p>
                <p>LKR {total}</p>
              </div>
              {selectedOption !== "Card Payment" && (
							  <button
								  className="mt-4 bg-orange-500 text-white py-2 px-4 cursor-pointer rounded hover:bg-orange-600 w-full font-bold"
								  onClick={handlePlaceOrder}
							  >
                  Place a Order
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[1px]">
            <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
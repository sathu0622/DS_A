import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/main_components/NavBar";
import UpdateLocation from "../../pages/UpdateLocation";

const Checkout = () => {
  const location = useLocation();
	const navigate = useNavigate();
  const { cartItems, restaurantName, restaurantLocation, subtotal } = location.state || {};

  const deliveryFee = 150;
  const [serviceFee, setServiceFee] = useState(30);
	const [selectedOption, setSelectedOption] = useState("Cash on Delivery");
	const [selectedDeliveryOption, setSelectedDeliveryOption] = useState("Standard");
  const [isLoading, setIsLoading] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userLocation, setUserLocation] = useState("");
  const [addressParts, setAddressParts] = useState({
    addressNo: "",
    streetName: "",
    city: "",
  });

  const total = subtotal + deliveryFee + serviceFee;


  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`);
        const data = await response.json();

        if (response.ok && data.location) {
          setUserLocation(data.location);

          const [addressNo, streetName, city] = data.location.split(", ");
          setAddressParts({ addressNo, streetName, city });
        } else {
          console.error("Failed to fetch user location:", data.msg || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    fetchUserLocation();

    const interval = setInterval(fetchUserLocation, 1000);
    return () => clearInterval(interval);
  }, []);


  const handleDeliveryOptionChange = (option) => {
    if (selectedDeliveryOption === option) {
      return;
    }
    setSelectedDeliveryOption(option);

    if (option === "Priority") {
      setServiceFee((prevFee) => prevFee + 200);
    } else if (option === "Standard") {
      setServiceFee((prevFee) => prevFee - 200);
    }
  };


  const handlePaymentMethodChange = (method) => {
    setSelectedOption(method);
    if (method === "Card Payment") { 
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      setServiceFee(0);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      setServiceFee(30);
    }
  };

  const handleclickedit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(true)
    }, 2000);
  };

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
  
      const userId = localStorage.getItem("userId");
      const restaurantId = cartItems[0]?.restaurantId;
  
      const orderData = {
        userId,
        restaurantId,
        items: cartItems.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          totalAmount: item.totalAmount,
        })),
        address: userLocation,
        paymentOption: selectedOption,
        totalAmount: total,
        status: selectedOption === "Cash on Delivery" ? "Pending" : "Pending",
      };

      const response = await fetch("http://localhost:8000/api/orders/pending-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to place order");
      }
  
      const data = await response.json();
      const orderId = data.pendingOrder._id;
  
      if (selectedOption === "Cash on Delivery") {
        // Navigate to the tracking page
        navigate("/tracking", {
          state: {
            orderId,
            userId,
            restaurantId,
            amount: total
          },
        });
      } else if (selectedOption === "Card Payment") {
        // Navigate to the payment page
        navigate("/payment", {
          state: {
            orderId,
            userId,
            restaurantId,
              amount: total, // Pass the total amount to the payment page
            },
          });
        }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("please add your location");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-4 pl-20 pr-20 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-600 font-bold">{addressParts.addressNo || "Loading..."}</p>
                  <p className="text-gray-500">{addressParts.streetName}, {addressParts.city || "Loading..."}</p>
                </div>
                <button className="bg-gray-300 cursor-pointer text-black text-sm font-bold rounded-4xl py-1 px-2 hover:bg-gray-400"
                  onClick={handleclickedit}
                >
                  Edit
                </button>
              </div>
              <h2 className="text-xl font-bold mb-4">Delivery Options</h2>
              <button
                className={`flex items-center cursor-pointer justify-between mb-4 border p-4 rounded-lg w-full ${
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
                className={`flex items-center cursor-pointer justify-between mb-4 border p-4 rounded-lg w-full ${
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
                  <li key={item._id} className="rounded-lg shadow flex items-center p-2">
                    <img
                      src={`http://localhost:8002/uploads/${item.image}`}
                      alt={item.image}
                      className="w-12 h-12 object-cover rounded-full mr-2"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.menuItemName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-right ml-auto font-bold text-gray-700">
                      LKR {item.totalAmount}.00
                    </p>
                  </li>
                ))}
              </ul>
              <hr className="my-4" />
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-bold">LKR {subtotal}.00</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Delivery Fee</p>
                <p className="font-bold">LKR {deliveryFee}.00</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-gray-600">Service Fee</p>
                <p className="font-bold">LKR {serviceFee}.00</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <p>Total</p>
                <p>LKR {total}.00</p>
              </div>
              <button
								  className="mt-4 bg-orange-500 text-white py-2 px-4 cursor-pointer rounded hover:bg-orange-600 w-full font-bold"
								  onClick={handlePlaceOrder}
							  >
                  Place a Order
              </button>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[1px]">
            <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        )}

        {isModalOpen && (
          <div
            className="fixed backdrop-blur-[1px] inset-0 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)} // Close the modal when clicking outside
          >
            <div
              className="relative bg-white p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setIsModalOpen(false)} // Close button inside the modal
              >
                ✕
              </button>
              <UpdateLocation />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
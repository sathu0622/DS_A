import { useState, useEffect } from "react";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [orderPage, setOrderPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [promoPage, setPromoPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUserProfile();
    fetchPromoCodes();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // setOrderHistory([
      //   { id: 1, restaurant: "Pizza Hut", date: "2025-04-20", amount: 2500 },
      //   { id: 2, restaurant: "Burger King", date: "2025-04-15", amount: 1800 },
      //   { id: 3, restaurant: "Dominos", date: "2025-04-10", amount: 2200 },
      //   { id: 4, restaurant: "KFC", date: "2025-04-05", amount: 2000 },
      //   { id: 5, restaurant: "Subway", date: "2025-04-02", amount: 1500 },
      //   { id: 6, restaurant: "McDonald's", date: "2025-03-28", amount: 2100 },
      // ]);
  
      const userId = localStorage.getItem("userId");
  
      const response3 = await fetch("http://localhost:8002/api/restaurants"); // Or your correct restaurant endpoint
if (!response3.ok) throw new Error("Failed to fetch restaurants");
const data3 = await response3.json();
setRestaurants(data3);


      const response2 = await fetch(`http://localhost:8000/api/orders/user-orders/${userId}`);
      if (!response2.ok) throw new Error("Failed to fetch user profile");
      const data2 = await response2.json(); 
      setOrderHistory(data2);  // ✅ Corrected line

      const response1 = await fetch(`http://localhost:5000/api/auth/users/all/${userId}`);
      if (!response1.ok) throw new Error("Failed to fetch user profile");
      const data1 = await response1.json(); 
      setUserDetails(data1);  // ✅ Corrected line
  
      const response = await fetch(`http://localhost:8001/api/payments/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch payment history");
      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    }
  };
  
  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((r) => r._id === restaurantId);
    return restaurant ? restaurant.name : "Unknown Restaurant";
  };

  
  const fetchPromoCodes = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:8001/api/promo/promo-codes/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch promo codes");
      const data = await response.json();
      setPromoCodes((data.promoCodes || []).filter((promo) => !promo.used));
    } catch (error) {
      console.error("Failed to fetch promo codes", error);
    }
  };

  const paginate = (array, pageNumber) => {
    const start = (pageNumber - 1) * itemsPerPage;
    return array.slice(start, start + itemsPerPage);
  };

  const totalOrderPages = Math.ceil(orderHistory.length / itemsPerPage);
  const totalPaymentPages = Math.ceil(paymentHistory.length / itemsPerPage);
  const totalPromoPages = Math.ceil(promoCodes.length / itemsPerPage);

  const handleCopyPromoCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert("Promo code copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen bg-[#EEF2F7] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Account Overview</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Info */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Profile Info</h2>
            {userDetails && (
              <div className="space-y-3 text-gray-700">
            
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{userDetails.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span>{userDetails.user.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{userDetails.user.phone}</span>
                </div>
              </div>
            )}
          </div>

          {/* Promo Codes */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Promo Codes</h2>
            <div className="space-y-4">
              {paginate(promoCodes, promoPage).length > 0 ? (
                paginate(promoCodes, promoPage).map((promo) => (
                  <div key={promo.code} className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">{promo.code}</p>
                      <p className="text-sm text-gray-500">Expires: {new Date(promo.expiresAt).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">Discount: {promo.discountPercentage}%</p>
                    </div>
                    <button
                      onClick={() => handleCopyPromoCode(promo.code)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Copy
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No promo codes available.</p>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setPromoPage((prev) => Math.max(prev - 1, 1))}
                disabled={promoPage === 1}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setPromoPage((prev) => Math.min(prev + 1, totalPromoPages))}
                disabled={promoPage === totalPromoPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Orders</h2>
          <div className="space-y-4">
            {paginate(orderHistory, orderPage).map((order) => (
 <div key={order._id} className="flex justify-between items-center border-b pb-3">
 <div>
   <p className="font-semibold text-lg">{getRestaurantName(order.restaurantId)}</p>
   <p className="text-sm text-gray-500">
     {new Date(order.createdAt).toLocaleDateString("en-US", {
       year: "numeric",
       month: "long",
       day: "numeric",
     })}
   </p>
 </div>
 <p className="font-bold text-green-600">LKR {order.totalAmount}</p>
</div>

            ))}
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              onClick={() => setOrderPage((prev) => Math.max(prev - 1, 1))}
              disabled={orderPage === 1}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              onClick={() => setOrderPage((prev) => Math.min(prev + 1, totalOrderPages))}
              disabled={orderPage === totalOrderPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Payment History</h2>
          <div className="space-y-4">
            {paginate(paymentHistory, paymentPage).map((payment) => (
              <div key={payment.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold text-lg capitalize">{payment.status}</p>
                  <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-green-600">LKR {payment.amount}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              onClick={() => setPaymentPage((prev) => Math.max(prev - 1, 1))}
              disabled={paymentPage === 1}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              onClick={() => setPaymentPage((prev) => Math.min(prev + 1, totalPaymentPages))}
              disabled={paymentPage === totalPaymentPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

import { useState, useEffect } from "react";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);

  // Pagination states
  const [orderPage, setOrderPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUserProfile();
    fetchPromoCodes();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setUserDetails({
        name: "John Doe",
        email: "john@example.com",
        address: "Seewalee Mawatha Kaduwela",
      });

      setOrderHistory([
        { id: 1, restaurant: "Pizza Hut", date: "2025-04-20", amount: 2500 },
        { id: 2, restaurant: "Burger King", date: "2025-04-15", amount: 1800 },
        { id: 3, restaurant: "Dominos", date: "2025-04-10", amount: 2200 },
        { id: 4, restaurant: "KFC", date: "2025-04-05", amount: 2000 },
        { id: 5, restaurant: "Subway", date: "2025-04-02", amount: 1500 },
        { id: 6, restaurant: "McDonald's", date: "2025-03-28", amount: 2100 },
      ]);

      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:8001/api/payments/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch payment history");
      }
      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:8001/api/promo/promo-codes/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch promo codes");
      }
      const data = await response.json();
      setPromoCodes(data.promoCodes || []);
    } catch (error) {
      console.error("Failed to fetch promo codes", error);
    }
  };

  // Helper functions for pagination
  const paginate = (array, pageNumber) => {
    const start = (pageNumber - 1) * itemsPerPage;
    return array.slice(start, start + itemsPerPage);
  };

  const totalOrderPages = Math.ceil(orderHistory.length / itemsPerPage);
  const totalPaymentPages = Math.ceil(paymentHistory.length / itemsPerPage);

  // Copy Promo Code Function
  const handleCopyPromoCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert("Promo code copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-gray-900">Account</h1>

        {/* User Details */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Profile Info</h2>
          {userDetails && (
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Name:</span>
                <span>{userDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Email:</span>
                <span>{userDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Address:</span>
                <span>{userDetails.address}</span>
              </div>
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Orders</h2>
          <div className="space-y-6">
            {paginate(orderHistory, orderPage).map((order) => (
              <div key={order.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{order.restaurant}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <p className="font-bold text-green-600">LKR {order.amount}</p>
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setOrderPage((prev) => Math.max(prev - 1, 1))}
              disabled={orderPage === 1}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setOrderPage((prev) => Math.min(prev + 1, totalOrderPages))}
              disabled={orderPage === totalOrderPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Payment History</h2>
          <div className="space-y-6">
            {paginate(paymentHistory, paymentPage).map((payment) => (
              <div key={payment.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg capitalize">{payment.status}</p>
                  <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-green-600">LKR {payment.amount}</p>
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setPaymentPage((prev) => Math.max(prev - 1, 1))}
              disabled={paymentPage === 1}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setPaymentPage((prev) => Math.min(prev + 1, totalPaymentPages))}
              disabled={paymentPage === totalPaymentPages}
            >
              Next
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Promo Codes</h2>
      <div className="space-y-6">
        {promoCodes.length > 0 ? (
          promoCodes.map((promo) => (
            <div
              key={promo.code}
              className={`flex justify-between items-center ${
                promo.used ? "text-red-600 blur-sm" : ""
              }`}
            >
              <div>
                <p className="font-semibold text-lg">{promo.code}</p>
                <p className="text-sm text-gray-500">
                  Expires at: {new Date(promo.expiresAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Discount: {promo.discountPercentage}%
                </p>
              </div>
              {!promo.used && (
                <button
                  onClick={() => handleCopyPromoCode(promo.code)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Copy
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No promo codes available</p>
        )}
      </div>
    </div>
  

      </div>
    </div>
  );
};

export default UserProfile;

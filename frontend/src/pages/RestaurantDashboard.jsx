import React from "react";

const RestaurantDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-pink-600">Good Morning!</h1>
        <p className="text-gray-600">John Doe</p>
        <div className="bg-red-100 text-red-600 p-2 rounded mt-2">
          Reminder: Dummy data will be reset in every 30 minutes.
        </div>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <button className="bg-pink-500 text-white p-4 rounded-lg shadow cursor-pointer hover:bg-pink-600">
          <h2 className="text-lg font-bold">Total Sales</h2>
          <p className="text-2xl font-bold">$</p>
        </button>
        <button className="bg-blue-500 text-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-600">
          <h2 className="text-lg font-bold">Total Orders</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
        <button className="bg-blue-400 text-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-500">
          <h2 className="text-lg font-bold">Total Customers</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
        <button className="bg-purple-500 text-white p-4 rounded-lg shadow cursor-pointer hover:bg-purple-600">
          <h2 className="text-lg font-bold">Total Menu Items</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
      </div>

      {/* Order Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold text-pink-500">Total Orders</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold text-yellow-500">Pending</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold text-green-500">Processing</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold text-blue-500">Out For Delivery</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold text-green-600">Delivered</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold text-red-500">Canceled</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold text-purple-500">Returned</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold text-red-600">Rejected</h2>
          <p className="text-2xl font-bold">0</p>
        </button>
      </div>

      {/* Sales Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold">Sales Summary</h2>
          <div className="mt-4">
            <p className="text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold">$0</p>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Avg. Sales Per Day</p>
            <p className="text-2xl font-bold">$0</p>
          </div>
        </button>
        <button className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
          <h2 className="text-lg font-bold">Orders Summary</h2>
          <div className="mt-4">
            <p className="text-gray-600">Delivered (%)</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "50%" }}></div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Returned (%)</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "20%" }}></div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Canceled (%)</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "10%" }}></div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Rejected (%)</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "5%" }}></div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/main_components/NavBar";
import { useAuth } from "../context/AuthContext";
import { AiOutlineClose } from "react-icons/ai";
import Toast from "../components/main_components/Toast";

import CartSlider from "../components/orderprocess/CartSlider";

const Menuitem = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [quantity, setQuantity] = useState(1); 
  const { auth } = useAuth();
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (userRole !== "customer") {
      navigate("/");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    setIsCartOpen(true);
  }, []);

  useEffect(() => {
    const fetchCartItemCount = async () => {
      if (auth.token && auth.userId) {
        try {
          const response = await fetch(`http://food-app.127.0.0.1.nip.io/api/addtocart/${auth.userId}/count`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch cart item count");
          }

          const data = await response.json();
          setCartItemCount(data.totalQuantity);
        } catch (error) {
          console.error("Error fetching cart item count:", error);
        }
      }
    };
    fetchCartItemCount();

    const intervalId = setInterval(() => {
      fetchCartItemCount();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [auth.token, auth.userId]); 

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `http://food-app.127.0.0.1.nip.io/api/menu?restaurantId=${restaurantId}`
        );
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const addToCart = async (item) => {
    const userId = localStorage.getItem("userId");
    const menuItemId = item._id; 
    const totalAmount = item.price * quantity;
    const image = item.image;

    try {
      const response = await fetch("http://food-app.127.0.0.1.nip.io/api/addtocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          restaurantId,
          menuItemId,
          quantity,
          totalAmount,
          image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      console.log("Item added to cart:", data);

      // Update the cart state and open the CartSlider
      setCart((prevCart) => [...prevCart, { ...item, quantity, totalAmount }]);
      setIsCartOpen(true);
      setToast({ type: "success", message: "Item added to cart successfully!" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToast({ type: "error", message: "Failed to add item to cart. Please try again." });
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div>
        <NavBar restaurantId={restaurantId} />
      <div className="min-h-screen bg-gray-100 p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-8">Menu Items</h1>

        {/* Menu Item Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-lg rounded-2xl overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => openModal(item)}
              >
                {/* Image */}
                <img
                  src={`http://food-app.127.0.0.1.nip.io/uploads/${item.image}`}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                {/* Content */}
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h2>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                  <p className="text-gray-700 font-semibold mb-2">Price: Rs. {item.price}.00</p>
                  {item.offer && (
                    <span className="inline-block bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2">
                      {item.offer}
                    </span>
                  )}

                  {/* Delivery Info */}
                  <div className="flex justify-between items-center text-gray-500 text-sm">
                    <span>⭐ {item.rating || "4.5"}</span>
                    <span>🚚 {item.deliveryFee || "150.00"} Fee</span>
                    <span>⏱️ {item.deliveryTime || "30 min"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

      </div>

      {/* Cart Slider */}
      <CartSlider
        isOpen={isCartOpen}
        cartItems={cart}
        onClose={() => setIsCartOpen(false)}
      />

      {/* popup window*/}
      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-96 p-6 relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
                <AiOutlineClose />
            </button>
            <img
                src={`http://food-app.127.0.0.1.nip.io/uploads/${selectedItem.image}`}
                alt={selectedItem.image}
                className="w-full h-48 object-cover"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
            <p className="text-gray-600 mb-4">{selectedItem.description}</p>
            <p className="text-gray-800 font-bold mb-4">Price: Rs. {selectedItem.price}.00</p>

            {/* Quantity Selector */}
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-4 text-gray-600">
                Quantity:
              </label>
              <select
                id="quantity"
                className="border border-gray-300 rounded px-2 py-1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Add to Order Button */}
            <button
                className="bg-red-500 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 w-full mb-4"
              onClick={() => {
                addToCart(selectedItem);
                closeModal();
              }}
            >
              Add {quantity} to Order - Rs. {selectedItem.price * quantity}.00
            </button>

              {/* <button
              className="bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300 w-full"
              onClick={() => {
                console.log("See details clicked");
              }}
            >
              See Details
            </button> */}
          </div>
        </div>
      )}
    </div>
      {/* Cart Slider */}
      <CartSlider
        isOpen={isCartOpen}
        userId={auth.userId}
        restaurantId={restaurantId}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Menuitem;
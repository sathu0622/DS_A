import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Player } from "@lottiefiles/react-lottie-player";
import cartAnimation from "../../assets/lottie/cartanim.json";

const CartSliderCat = ({ isOpen, userId, currentPage, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [groupedCart, setGroupedCart] = useState([]);
	const sliderRef = useRef(null);
	const navigate = useNavigate();

  useEffect(() => {
	  let intervalId;

    const fetchCartData = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:8000/api/addtocart/${userId}/details`);
          if (!response.ok) {
            throw new Error("Failed to fetch cart data");
          }
          const data = await response.json();
          setCartItems(data);

          // Group data by restaurant if not on the "newtemp" page
          if (currentPage !== "/newtemp") {
            const grouped = data.reduce((acc, item) => {
              const { restaurantName, restaurantLocation, restaurantImage, restaurantId } = item;
              if (!acc[restaurantName]) {
                acc[restaurantName] = {
                  restaurantName,
                  restaurantLocation,
                  restaurantImage,
					restaurantId,
                  subtotal: 0,
                  quantity: 0,
                };
              }
              acc[restaurantName].subtotal += item.totalAmount;
              acc[restaurantName].quantity += item.quantity;
              return acc;
            }, {});
            setGroupedCart(Object.values(grouped));
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    };

    if (isOpen) {
      fetchCartData();
		intervalId = setInterval(fetchCartData, 1000);
    }
	  return () => {
		  clearInterval(intervalId);
	  };
  }, [isOpen, userId, currentPage]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleCardClick = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  return (
    <div
		  className={`fixed top-10 right-30 bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-[150%]"
      } transition-transform duration-100 w-96 z-50`}
    >
		  <div ref={sliderRef} className="h-full flex flex-col cursor-pointer">

        {currentPage === "/newtemp" ? (
				  <div className="flex-1 overflow-y-auto">
            {/* Display cart items as usual */}
            {cartItems.map((item) => (
				<div key={item._id}>
                <p className="font-bold">{item.menuItemName}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-500">LKR {item.totalAmount}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Display grouped cart data */}
            {groupedCart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Player
                  autoplay
                  loop
                  src={cartAnimation}
                  style={{ height: "150px", width: "150px" }}
                />
                <p className="text-gray-500 text-lg font-bold">Your cart is empty</p>
              </div>
            ) : (
              groupedCart.map((group, index) => (
                <div
                  key={group.restaurantName}
                  className="p-4 rounded-lg shadow flex items-center hover:bg-gray-300 cursor-pointer"
                  onClick={() => handleCardClick(group.restaurantId)}
                >
                  <img
                    src={`http://localhost:8002/uploads/${group.restaurantName}`}
                    alt={group.restaurantName}
                    className="w-12 h-12 object-cover rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-bold">{group.restaurantImage}</p>
                    <p className="text-sm text-gray-500">
                      Subtotal: LKR {group.subtotal.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Deliver to {group.restaurantLocation}
                    </p>
                  </div>
                  <span className="bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {group.quantity}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSliderCat;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { useAuth } from "../../context/AuthContext";
import CartSlider from "../orderprocess/CartSlider";
import CartSliderCat from "../orderprocess/CartSliderCat";

const NavBar = ({ restaurantId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchCartItemCount = async () => {
      if (auth.token && auth.userId && restaurantId) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/addtocart/${auth.userId}/count?restaurantId=${restaurantId}`,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );

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
  }, [auth.token, auth.userId, restaurantId]);

  useEffect(() => {
    const fetchCartItemCount = async () => {
      if (auth.token && auth.userId) {
        try {

          const isNewTempPage = location.pathname.startsWith("/restaurants/");
          if (isNewTempPage) return; 

          const response = await fetch(
            `http://localhost:8000/api/addtocart/${auth.userId}/count`,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );

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
  }, [auth.token, auth.userId, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignupClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-white text-white p-2 border-b border-black">
        <div className="container mx-auto flex justify-between items-center">
          {/* Left: Menu Icon */}
          <div className="flex justify-start">
            <button
              className="text-2xl text-black ml-0 cursor-pointer"
              onClick={toggleMenu}
            >
              <TiThMenu />
            </button>
          </div>

          <div className="flex gap-4 ml-auto items-center relative">
            {/* Cart Icon */}
            {auth.token && auth.role === "customer" && (
              <button
                className="bg-gray-100 text-black px-4 py-2 rounded-4xl hover:bg-gray-200 shadow-lg flex items-center gap-2 cursor-pointer relative"
                onClick={handleCartClick}
              >
                <FaShoppingCart className="text-lg" />
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </button>
            )}

            {/* User Role */}
            {auth.token && auth.role === "customer" ? (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-4xl hover:bg-red-600 shadow-lg cursor-pointer"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            ) : (
                <>
                <button
                  className="bg-white text-black px-4 py-2 rounded-4xl hover:bg-gray-100 shadow-lg cursor-pointer"
                  onClick={handleLoginClick}
                >
                  Login
                </button>

                <button
                  className="bg-black px-4 py-2 rounded-4xl hover:bg-gray-800 text-white shadow-lg cursor-pointer"
                  onClick={handleSignupClick}
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Sliding Menu */}
      <div
        ref={menuRef} 
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
      >
        <button
          className="text-2xl p-4 cursor-pointer"
          onClick={closeMenu}
        >
          ✕
        </button>
        <div className="p-4">
          {!auth.token && (
            <>
              <button
                className="w-full bg-black text-white py-2 mb-4 rounded hover:bg-gray-800 cursor-pointer"
                onClick={handleSignupClick}
              >
                Sign up
              </button>
              <button
                className="w-full bg-gray-200 text-black py-2 mb-4 rounded hover:bg-gray-300 cursor-pointer"
                onClick={handleLoginClick}
              >
                Log in
              </button>
            </>
          )}
          <ul className="space-y-4">
            <li>
              <a
                href="#business"
                className="block text-gray-700 hover:text-black cursor-pointer"
              >
                Create a business account
              </a>
            </li>
            <li>
              <a
                href="/register-restaurant"
                className="block text-gray-700 hover:text-black cursor-pointer"
              >
                Add your restaurant
              </a>
            </li>
            <li>
              <a
                href="/register-driver"
                className="block text-gray-700 hover:text-black cursor-pointer"
              >
                Sign up to deliver
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Conditionally Render CartSlider or CartSliderCat */}
      {location.pathname.startsWith("/restaurants/") ? (
        <CartSlider
          isOpen={isCartOpen}
          userId={auth.userId}
          restaurantId={restaurantId}
          onClose={() => setIsCartOpen(false)}
        />
      ) : (
        <CartSliderCat
          isOpen={isCartOpen}
          userId={auth.userId}
          currentPage={location.pathname}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
};

export default NavBar;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaRegRegistered, FaHistory } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { TbTruckDelivery } from "react-icons/tb";
import { ImSpoonKnife } from "react-icons/im";
import { CiLogin } from "react-icons/ci";
import { useAuth } from "../../context/AuthContext";
import CartSlider from "../orderprocess/CartSlider";
import CartSliderCat from "../orderprocess/CartSliderCat";
import logo from "../../assets/logo.png";
import { FaUserCircle } from "react-icons/fa";

const NavBar = ({ restaurantId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const location = useLocation();
  const menuRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

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

  const navigateTracking = () => {
    navigate("/tracking")
  };

  const handleSignupClick = () => {
    navigate("/register");
  };

  const handlehomeclick = () => {
    if (!auth.token) {
      navigate("/");
    } else if (auth.role === "customer") {
      navigate("/loghome");
    } else if (auth.role === "restaurant") {
      navigate("/restaurant/dashboard");
    } else {
      alert("Access restricted.");
    }
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
  const navigateUserProfile = () => {
    navigate("/user-profile");
  };
  

  return (
    <div>
      {/* Navigation Bar */}
      <nav
        className={`bg-red-600 bg-opacity- backdrop-blur-md text-white p-2 border-black rounded-b-4xl fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Left: Menu Icon */}
          <div className="flex justify-start">
            <button
              className="text-2xl text-black ml-0 cursor-pointer"
              onClick={toggleMenu}
            >
              <TiThMenu />
            </button>
            <div
              className="flex items-center ml-4 animate-pulse cursor-pointer"
              onClick={handlehomeclick}
            >
              <img src={logo} alt="Logo" className="h-12 w-16" />
              <span className="text-xl font-bold text-white">SpeedySpoon</span>
            </div>
          </div>

          <div className="flex gap-4 ml-auto items-center relative">
            {/* Delivery Icon - Hidden on Mobile */}
            {auth.token && auth.role === "customer" && (
              <button
                className="hidden md:flex bg-gray-100 text-black px-4 py-2 rounded-4xl hover:bg-gray-200 shadow-lg flex items-center gap-2 cursor-pointer relative"
                onClick={navigateTracking}
              >
                <TbTruckDelivery className="text-lg" />
              </button>
            )}

            {/* Cart Icon - Hidden on Mobile */}
            {auth.token && auth.role === "customer" && (
              <button
                className="hidden md:flex bg-gray-100 text-black px-4 py-2 rounded-4xl hover:bg-gray-200 shadow-lg flex items-center gap-2 cursor-pointer relative"
                onClick={handleCartClick}
              >
                <FaShoppingCart className="text-lg" />
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </button>
            )}

            {/* Profile Button - Hidden on Mobile */}
            {auth.token && (
              <button
                className="hidden md:flex bg-gray-100 text-black px-4 py-2 rounded-4xl hover:bg-gray-200 shadow-lg flex items-center gap-2 cursor-pointer"
                onClick={navigateUserProfile}
              >
                <FaUserCircle className="text-lg" />
              </button>
            )}

            {/* Logout Button - Hidden on Mobile */}
            {auth.token ? (
              <button
                className="hidden md:flex bg-black font text-white px-4 py-2 rounded-4xl hover:bg-red-600 shadow-lg cursor-pointer"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            ) : (
                <>
                  {/* Login Button - Hidden on Mobile */}
                <button
                    className="hidden md:flex bg-white text-black font-bold px-4 py-2 rounded-4xl hover:bg-gray-100 shadow-lg cursor-pointer"
                  onClick={handleLoginClick}
                >
                  Login
                </button>

                  {/* Signup Button - Hidden on Mobile */}
                <button
                    className="hidden md:flex bg-black px-4 py-2 font-bold rounded-4xl hover:bg-gray-800 text-white shadow-lg cursor-pointer"
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
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
      >
        <button className="text-2xl p-4 cursor-pointer" onClick={closeMenu}>
          ✕
        </button>
        <div className="space-y-4 p-4">
          {!auth.token && (
            <>
              <button
                className="w-full bg-gray-100 text-black px-4 cursor-pointer py-3 rounded-lg hover:bg-red-600 shadow-md flex items-center gap-3"
                onClick={handleLoginClick}
              >
                <CiLogin className="text-xl" />
                <span className="font-medium">Login</span>
              </button>
              <button
                className="w-full bg-gray-100 text-black px-4 py-3 cursor-pointer rounded-lg hover:bg-red-600 shadow-md flex items-center gap-3"
                onClick={handleSignupClick}
              >
                <FaRegRegistered className="text-xl" />
                <span className="font-medium">Signup</span>
              </button>
              <button
                className="w-full bg-gray-100 text-black px-4 py-3 cursor-pointer rounded-lg hover:bg-red-600 shadow-md flex items-center gap-3"
                onClick={() => navigate("/register-restaurant")}
              >
                <ImSpoonKnife className="text-xl" />
                <span className="font-medium">Add your restaurant</span>
              </button>
              <button
                className="w-full bg-gray-100 text-black px-4 py-3 cursor-pointer rounded-lg hover:bg-red-600 shadow-md flex items-center gap-3"
                onClick={() => navigate("/register-driver")}
              >
                <TbTruckDelivery className="text-xl" />
                <span className="font-medium">Sign up to deliver</span>
              </button>
            </>
          )}
        </div>
        <div className="space-y-4 p-4">
          {auth.token && auth.role === "customer" && (
            <>
              <button
                className="w-full bg-gray-100 cursor-pointer text-black px-4 py-3 rounded-lg hover:bg-gray-200 shadow-md flex items-center gap-3"
                onClick={navigateTracking}
              >
                <TbTruckDelivery className="text-xl" />
                <span className="font-medium">Track Orders</span>
              </button>
              <button
                className="w-full bg-gray-100 cursor-pointer text-black px-4 py-3 rounded-lg hover:bg-gray-200 shadow-md flex items-center gap-3"
                onClick={handleCartClick}
              >
                <FaShoppingCart className="text-xl" />
                <span className="font-medium">Cart</span>
              </button>
              <button
                className="w-full bg-gray-100 cursor-pointer text-black px-4 py-3 rounded-lg hover:bg-gray-200 shadow-md flex items-center gap-3"
                onClick={navigateUserProfile}
              >
                <FaUserCircle className="text-xl" />
                <span className="font-medium">Profile</span>
              </button>
              <button
                className="w-full bg-gray-100 text-black cursor-pointer px-4 py-3 rounded-lg hover:bg-gray-200 shadow-md flex items-center gap-3"
                onClick={() => navigate("/order-history")}
              >
                <FaHistory className="text-xl" />
                <span className="font-medium">Order History</span>
              </button>
              <button
                className="w-full bg-red-600 cursor-pointer text-white px-4 py-3 rounded-lg hover:bg-red-700 shadow-md flex items-center gap-3"
                onClick={handleLogoutClick}
              >
                <span className="font-medium">Logout</span>
              </button>
            </>
          )}
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
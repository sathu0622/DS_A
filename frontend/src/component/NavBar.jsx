import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-white text-white p-2 border-b border-black">
        <div className="container mx-auto flex justify-between items-center">
          {/* Left: Menu Icon */}
          <div className="flex justify-start">
            <button
              className="text-2xl text-black ml-0"
              onClick={toggleMenu}
            >
              ☰
            </button>
          </div>

          {/* Right: Login and Signup Buttons */}
          <div className="flex gap-4 ml-auto">
            <button
              className="bg-white text-black px-4 py-2 rounded-4xl hover:bg-gray-100 shadow-lg"
              onClick={handleLoginClick}
            >
              Login
            </button>
            <button
              className="bg-black px-4 py-2 rounded-4xl hover:bg-gray-800 text-white shadow-lg"
              onClick={handleSignupClick}
            >
              Signup
            </button>
          </div>
        </div>
      </nav>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
      >
        <button
          className="text-2xl p-4"
          onClick={closeMenu}
        >
          ✕
        </button>
        <div className="p-4">
          <button className="w-full bg-black text-white py-2 mb-4 rounded hover:bg-gray-800"
			onClick={handleSignupClick}
		  >
            Sign up
          </button>
          <button className="w-full bg-gray-200 text-black py-2 mb-4 rounded hover:bg-gray-300"
		  onClick={handleLoginClick}
		  >
            Log in
          </button>
          <ul className="space-y-4">
            <li>
              <a href="#business" className="block text-gray-700 hover:text-black">
                Create a business account
              </a>
            </li>
            <li>
              <a href="#restaurant" className="block text-gray-700 hover:text-black">
                Add your restaurant
              </a>
            </li>
            <li>
              <a href="#deliver" className="block text-gray-700 hover:text-black">
                Sign up to deliver
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
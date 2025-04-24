import React from 'react';
import NavBar from '../components/main_components/NavBar';
import bgimg from '../assets/bgimage.jpg';
import Footer from '../components/main_components/Footer';
import { FaMapMarkerAlt } from 'react-icons/fa';

import pizzaImg from '../assets/o5.jpg';
import burgerImg from '../assets/o4.jpg';
import sushiImg from '../assets/o3.jpg';
import pastaImg from '../assets/o2.jpg';
import dessertsImg from '../assets/o1.jpg';
import sc from "../assets/dv.jpg"

const imageMap = {
  Pizza: pizzaImg,
  Burger: burgerImg,
  Sushi: sushiImg,
  Pasta: pastaImg,
  Desserts: dessertsImg,
};


const Home = () => {
  return (
    <div>
      <NavBar />
      {/* Background Section */}
      <div
        className="h-[80vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgimg})`,
        }}
      >
        {/* Add any content here if needed */}
      </div>

      {/* Middle Section
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">
          More Than <span className="text-red-500">10,000</span> Dishes To Order!
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to the biggest network of food ordering & delivery.
        </p>
      </div> */}


       {/* Hero Section
       <section className="bg-cover bg-center h-[600px]" style={{ backgroundImage: "url('/path-to-your-burger-image.jpg')" }}>
        <div className="max-w-4xl mx-auto pt-40 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Order delivery near you</h1>
          <div className="bg-white flex items-center rounded-lg overflow-hidden shadow-md w-full max-w-3xl">
            <div className="flex items-center px-4 w-full">
              <FaMapMarkerAlt className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter delivery address"
                className="flex-1 py-3 px-2 focus:outline-none"
              />
            </div>
            <select className="border-l border-gray-200 px-3 py-3 text-sm text-gray-600">
              <option>Deliver now</option>
              <option>Schedule</option>
            </select>
            <button className="bg-black text-white px-6 py-3 text-sm">Find Food</button>
          </div>
          <p className="text-xs mt-2 text-gray-500">Or <a href="#" className="underline">Sign In</a></p>
        </div>
      </section> */}

      {/* Dishes Highlight */}
      <section className="text-center py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-semibold">
          More Than <span className="text-red-500">10,000</span> Dishes <br /> To Order!
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Welcome to The Biggest Network of Food Ordering & Delivery
        </p>

        {/* Category Cards */}
        <div className="mt-10 flex justify-center flex-wrap gap-4">
        {['Pizza', 'Burger', 'Sushi', 'Pasta', 'Desserts'].map((item) => (
  <a
    key={item}
    href="#"
    className="bg-white rounded-xl shadow-md px-6 py-4 w-28 text-center hover:shadow-lg transition"
  >
    <img src={imageMap[item]} alt={item} className="w-10 h-10 mx-auto mb-2" />
    <p className="text-sm font-medium">{item}</p>
  </a>
))}

          {/* Promo Block */}
          <a
            href="#"
            className="bg-gray-100 rounded-xl shadow-md px-6 py-4 flex items-center gap-4 hover:shadow-lg transition"
          >
            <div>
              <p className="text-sm">
                Find <span className="text-red-500">deals</span>, <span className="text-green-500">free delivery</span>, and more
                from our restaurant partners.
              </p>
            </div>
            <img src={sc} alt="delivery scooter" className="w-16 h-16" />
          </a>
        </div>

        {/* Quote */}
        <blockquote className="mt-10 text-sm italic text-gray-500 max-w-lg mx-auto">
          <div className="text-3xl text-black font-bold">“</div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </blockquote>
      </section>

      {/* App Section */}
      <section className="text-center">
        {/* How to Order */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold">How To Order?</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Choose your location', icon: '📍' },
              { step: '02', title: 'Choose what to eat', icon: '👩‍🍳' },
              { step: '03', title: 'May your first order', icon: '🍔' },
              { step: '04', title: 'Now! Your food in way', icon: '🏠' }
            ].map(({ step, title, icon }) => (
              <a
                key={step}
                href="#"
                className="bg-white rounded-xl shadow-md px-6 py-8 text-center hover:shadow-lg transition"
              >
                <p className="text-red-500 text-xl font-bold">{step}</p>
                <div className="text-3xl my-2">{icon}</div>
                <p className="text-sm font-medium">{title}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

	  <Footer /> 
    </div>
  );
};

export default Home;
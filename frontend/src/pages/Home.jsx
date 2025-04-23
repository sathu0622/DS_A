import React from 'react';
import NavBar from '../components/main_components/NavBar';
import bgimg from '../assets/bgimage.jpg';
import Footer from '../components/main_components/Footer';

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

      {/* Middle Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">
          More Than <span className="text-red-500">10,000</span> Dishes To Order!
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to the biggest network of food ordering & delivery.
        </p>
      </div>
	  <Footer /> 
    </div>
  );
};

export default Home;
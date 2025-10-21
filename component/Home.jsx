import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const goToLogin=()=>{
    navigate("/login");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#80aae46c] px-4">
      <div className="bg-[#80aae46c] p-12 rounded-[20px] shadow-[10px_10px_20px_#a3b1c6,_-10px_-10px_20px_#ffffff] max-w-3xl text-center transition-all duration-500 hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-4 tracking-wide">
          Welcome to <span className="text-blue-600">AutoTrack</span>
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Your smart companion for managing <strong>vehicle insurance</strong> with ease. 
          Say goodbye to manual tracking and hello to <span className="font-semibold text-gray-700">timely reminders</span> via email and WhatsApp.
        </p>

        <p className="text-gray-600 text-base leading-relaxed italic">
          Explore features like <span className="text-gray-800 font-medium">Login</span>, <span className="text-gray-800 font-medium">Contact</span>, and <span className="text-gray-800 font-medium">About</span> to know more.
        </p>

        <div className="mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={goToLogin}
          >
            Get Started <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

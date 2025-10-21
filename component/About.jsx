import React from 'react';
import { FaBell, FaShieldAlt, FaCar } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#80aae46c] px-6 py-12">
      <div className="bg-[#80aae46c] p-10 rounded-[20px] max-w-3xl shadow-[10px_10px_20px_#a3b1c6,_-10px_-10px_20px_#ffffff] text-center transition-all duration-500 hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-6 tracking-wide">Who We Are</h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          <span className="inline-flex items-center gap-2 font-semibold text-gray-700">
            <FaShieldAlt className="text-blue-500" />
            Smart. Secure. Seamless.
          </span>
          <br />
          We are on a mission to eliminate the hassle of managing <strong>vehicle insurance policies</strong>.
          Our intelligent platform ensures you’re always ahead—never behind.
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          <span className="inline-flex items-center gap-2 font-semibold text-gray-700">
            <FaBell className="text-green-600" />
            Timely Reminders
          </span>
          <br />
          Receive automated <strong>email</strong> and <strong>WhatsApp</strong> alerts
          <span className="text-gray-800 font-medium"> exactly 5 days before expiry</span>,
          so renewals are smooth and stress-free.
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          <span className="inline-flex items-center gap-2 font-semibold text-gray-700">
            <FaCar className="text-indigo-500" />
            Built for Everyone
          </span>
          <br />
          Whether you're a car owner or manage an entire fleet, our solution adapts to your needs,
          delivering convenience and reliability at every turn.
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mt-6 italic">
          Embrace the smarter way to manage insurance. No stress. No surprises. Just peace of mind.
        </p>
      </div>
    </div>
  );
};

export default About;

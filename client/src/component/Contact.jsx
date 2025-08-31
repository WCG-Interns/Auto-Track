import React, { useState, useEffect } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let timer;
    if (submitted) {
      timer = setTimeout(() => setSubmitted(false), 3500);
    }
    return () => clearTimeout(timer);
  }, [submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    e.target.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#80aae46c] px-4">
      <div className="bg-[#a6c5f0] p-10 rounded-[20px] w-full max-w-xl shadow-[10px_10px_20px_#a3b1c6,_-10px_-10px_20px_#ffffff]">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name" 
            required
            className="w-full p-3 rounded-[20px] bg-[#e0e5ec] shadow-inner
              shadow-[inset_10px_10px_20px_#a3b1c6,_inset_-10px_-10px_20px_#ffffff]
              placeholder-gray-500 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Your Email"
            required
            className="w-full p-3 rounded-[20px] bg-[#e0e5ec] shadow-inner
              shadow-[inset_10px_10px_20px_#a3b1c6,_inset_-10px_-10px_20px_#ffffff]
              placeholder-gray-500 focus:outline-none"
          />

          <textarea
            rows="4"
            placeholder="Your Message"
            required
            className="w-full p-3 rounded-[20px] bg-[#e0e5ec] shadow-inner
              shadow-[inset_10px_10px_20px_#a3b1c6,_inset_-10px_-10px_20px_#ffffff]
              placeholder-gray-500 focus:outline-none resize-none"
          ></textarea>

          <button
            type="submit"
            className="w-full py-2 rounded-[20px] bg-[#5993e4]
              shadow-[10px_10px_20px_#a3b1c6,_-10px_-10px_20px_#ffffff]
              hover:scale-105 transition-all text-gray-700 font-medium"
          >
            {submitted ? "Message Sent!" : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

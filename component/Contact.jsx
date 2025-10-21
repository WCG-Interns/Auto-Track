import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
   const [errorMsg, setErrorMsg] = useState("");


    useEffect(() => {
    let timer;
    if (submitted || errorMsg) {
      timer = setTimeout(() => {
        setSubmitted(false);
        setErrorMsg("");
      }, 3500); // auto-hide after 3.5s
    }
    return () => clearTimeout(timer);
  }, [submitted, errorMsg]);
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_284851q",   // 🔹 replace with your EmailJS service ID
        "template_1tv4l43",  // 🔹 replace with your EmailJS template ID
        e.target,
        "Bgi_-TNE4JD0JO9Ws"    // 🔹 replace with your EmailJS public key
      )
      .then(
        () => {
          setSubmitted(true);
          e.target.reset();
        },
        (error) => {
          console.error("EmailJS Error:", error.text);
        }
      );
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
            name="user_name"
            placeholder="Your Name"
            required
            className="w-full p-3 rounded-[20px] bg-[#e0e5ec] shadow-inner
              shadow-[inset_10px_10px_20px_#a3b1c6,_inset_-10px_-10px_20px_#ffffff]
              placeholder-gray-500 focus:outline-none"
          />

          <input
            type="email"
            name="user_email"
            placeholder="Your Email"
            required
            className="w-full p-3 rounded-[20px] bg-[#e0e5ec] shadow-inner
              shadow-[inset_10px_10px_20px_#a3b1c6,_inset_-10px_-10px_20px_#ffffff]
              placeholder-gray-500 focus:outline-none"
          />

          <textarea
            name="message"
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
               hover:cursor-pointer
               hover:text-white
              shadow-[10px_10px_20px_#a3b1c6,_-10px_-10px_20px_#ffffff]
              hover:scale-105 transition-all text-gray-900 font-medium"
              
          >
            {submitted ? "Message Sent!" : "Send Message"}
          </button>
        </form>
        {/* ✅ Feedback message */}
        {submitted && (
          <p className="mt-4 text-green-600 font-medium text-center">
            ✅ Your message has been sent successfully!
          </p>
        )}
        {errorMsg && (
          <p className="mt-4 text-red-600 font-medium text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

export default Contact;

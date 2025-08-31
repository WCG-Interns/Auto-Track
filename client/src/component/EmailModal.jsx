import React, { useState } from 'react';

const EmailModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      alert("Please enter an email address.");
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      //console.log(email)

      const res = await fetch('https://auto-track-server.onrender.com/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 400) {
        setMessage(data.message || 'This email is already added.');
      } else if (res.ok) {
        setMessage('✅ Email added successfully!');
        setEmail('');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setMessage(data.message || 'Something went wrong. Try again.');
      }
    } catch (err) {
      setMessage('❌ Failed to connect to server.',err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#262525d2] bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📧 Email Management</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
          Recipient Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 transition duration-200"
        />

        {message && (
          <p className="text-sm mb-3" style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Add Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;


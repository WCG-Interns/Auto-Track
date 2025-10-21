import React, { useState } from 'react';

const PhoneModal = ({ onClose, onAddPhone }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    // const cleanedPhone = phone.replace(/\D/g, '');
    // if (cleanedPhone.length !== 10) {
    //   alert('Please enter a valid 10-digit phone number');
    //   return;
    // }

    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('https://auto-track-server.onrender.com/api/phones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Backend error:', data);
        setMessage(data.message || '❌ Something went wrong.');
      } else {
        setMessage('✅ Phone added successfully!');
        setPhone('');

        // Pass back the new phone object to parent to update list
        if (onAddPhone) onAddPhone(data);

        // Auto close after 1 sec
        setTimeout(() => onClose(), 1000);
      }
    } catch (err) {
      setMessage('❌ Failed to connect to server.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Phone Number</h2>

        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter 10-digit phone"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />

        {message && (
          <p
            className={`mb-3 text-sm ${
              message.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            {isLoading ? 'Adding...' : 'Add Phone'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneModal;

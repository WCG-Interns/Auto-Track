import React, { useEffect, useState } from 'react';

const PhoneList = ({ token }) => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPhones = async () => {
    try {
    
      const response = await fetch('https://auto-track-server.onrender.com/api/phones', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch phone numbers');

      setPhones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePhone = async (id) => {
    if (!window.confirm('Are you sure you want to delete this phone number?')) return;

    try {
      const response = await fetch(`https://auto-track-server.onrender.com/api/phones/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete phone number');
      }

      // Remove from state instantly
      setPhones((prev) => prev.filter((phone) => phone.id !== id && phone._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  if (loading) return <p className="text-gray-600">Loading phone numbers...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <ul className="list-disc list-inside text-gray-800">
      {phones.length > 0 ? (
        phones.map((ph) => (
          <li
            key={ph.id || ph._id}
            className="flex justify-between items-center border-b py-1"
          >
            <span>{ph.phone}</span>
            <button
              onClick={() => deletePhone(ph.id || ph._id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </li>
        ))
      ) : (
        <p>No phone numbers found.</p>
      )}
    </ul>
  );
};

export default PhoneList;

import React, { useEffect, useState } from 'react';
import VehicleForm from './component/VehicleForm';
import PhoneModal from './component/PhoneModal';
import UserVehicleList from './component/UserVehicleList';
import PhoneList from './component/PhoneDeatils'
import EmailModal from './component/EmailModal';
import EmailList from './component/EmailList';


const UserDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [phones, setPhones] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPhoneDetails, setShowPhoneDetails] = useState(false);
  const [showEmailList, setShowEmailList] = useState(false);

  // Add vehicle to local state
  const addVehicle = (vehicle) => {
    setVehicles([...vehicles, { ...vehicle, id: Date.now() }]);
    setShowForm(false);
  };

  // Fetch vehicles from backend
  const fetchData = async () => {
    try {
      const response = await fetch('https://auto-track-server.onrender.com/api/vehicles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch vehicles');
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Add phone number to state instantly (called from PhoneModal)
  const handleAddPhone = (newPhone) => {
    setPhones((prevPhones) => [...prevPhones, newPhone]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          User Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row sm:justify-between px-2 gap-4 mb-6">
          <div className="flex flex-row sm:flex-row gap-2 px-1">
            <button
              className="w-full sm:w-auto bg-purple-700 hover:bg-purple-400 text-white font-medium px-6 py-2 rounded transition duration-300"
              onClick={() => setShowEmailModal(true)}
            >
              Manage Emails
            </button>

            <button
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded transition duration-300"
              onClick={() => setShowPhoneModal(true)}
            >
              Manage Contact Number
            </button>

            <button
              className="w-full sm:w-auto hover:bg-gray-300 text-black border font-mono px-3 py-0 rounded transition duration-300"
              onClick={() => setShowEmailList(true)}
            >
              All Email
            </button>
            <button
              className="w-full sm:w-auto hover:bg-gray-300 text-black border font-mono px-3 py-0 rounded transition duration-300"
              onClick={() => setShowPhoneDetails(true)}
            >
              Phone Details
            </button>
          </div>
        </div>

        {/* Vehicle List */}
        {vehicles.length === 0 ? (
          <div className="text-gray-600 mb-5">No vehicles found. Please add a vehicle.</div>
        ) : (
          <div className="mt-4">
            <UserVehicleList vehicleDetails={vehicles} setVehicles={setVehicles} />
          </div>
        )}

        {/* Show form */}
        {showForm && (
          <div className="mt-6">
            <VehicleForm onSave={addVehicle} onClose={() => setShowForm(false)} />
          </div>
        )}

        {/* Modals */}
        {showEmailModal && <EmailModal onClose={() => setShowEmailModal(false)} />}
        {showPhoneModal && (
          <PhoneModal onClose={() => setShowPhoneModal(false)} onAddPhone={handleAddPhone} />
        )}

        {/* Email List */}
        {showEmailList && (
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800">All Emails</h2>
              <button
                className="text-red-600 hover:underline text-sm"
                onClick={() => setShowEmailList(false)}
              >
                Close
              </button>
            </div>
            <EmailList token={localStorage.getItem('token')} />
          </div>
        )}

        {/* Phone List */}
        {showPhoneDetails && (
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800">All Phone Numbers</h2>
              <button
                className="text-red-600 hover:underline text-sm"
                onClick={() => setShowPhoneDetails(false)}
              >
                Close
              </button>
            </div>
            <PhoneList phones={phones} setPhones={setPhones} token={localStorage.getItem('token')} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

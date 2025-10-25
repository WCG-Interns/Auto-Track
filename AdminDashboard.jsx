import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VehicleList from './component/VehicleList';
import VehicleForm from './component/VehicleForm';
import EditForm from './component/EditForm';
import { GoShare } from "react-icons/go";
import SmsForm from './messages/SmsFrom';

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState(''); 
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [showSmsForm, setShowSmsForm] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://auto-track-server.onrender.com/api/vehicles', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setVehicles(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch vehicles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);
console.log(vehicles)
  // Called when user clicks "Add Vehicle"
  const handleAddClick = () => {
  setMode('add');
  setSelectedVehicle(null);
};

  // Called when user clicks "Edit" on a vehicle
  const handleEditClick = (vehicle) => {
    setMode('edit');
    setSelectedVehicle(vehicle);
  };

  // Called when user clicks "View" on a vehicle (if needed)
  const handleViewClick = (vehicle) => {
    setMode('view');
    setSelectedVehicle(vehicle);
  };

  // Called when the form submits data for add or edit
  const handleSave = async (vehicleData) => {
    console.log("Saved Successfully");
  try{
    await fetchVehicles();
    setMode('');
    setSelectedVehicle(null);
  } catch (err) {
    console.error(err);
    alert('Failed to save vehicle');
  }
  };
  


  const handleCloseForm = () => {
    setMode('');
    setSelectedVehicle(null);
  };

  // Called when user clicks Delete button on a vehicle
  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };
  const handleSmsForm = () => {
    setShowSmsForm(true);
    setSelectedVehicle(null);
  };

  // Confirm delete API call
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `https://auto-track-server.onrender.com/api/vehicles/${vehicleToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setVehicles(vehicles.filter((v) => v._id !== vehicleToDelete._id));
    } catch (err) {
      alert('Failed to delete vehicle',err);
    } finally {
      setShowDeleteModal(false);
      setVehicleToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className='flex gap-3 justify-between items-center'>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Admin Dashboard
        </h1>
        <button 
        onClick={handleSmsForm}
        className='text-2xl mb-7'>
            <GoShare/>
        </button>
      </div>

        {loading && <p className="text-gray-500">Loading vehicles...</p>}

        {!loading && error && (
          <div className="text-red-600 bg-red-100 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="text-center text-gray-600 py-10">
            <p>No Vehicles Found</p>
            <button
              onClick={handleAddClick}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + Add Vehicle
            </button>
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <VehicleList
            vehiclesDetails={vehicles}
            setVehicles={setVehicles}
            onAdd={handleAddClick}
            onEdit={handleEditClick}
            onView={handleViewClick}
            onDelete={handleDeleteClick}
          />
        )}

        {(mode === 'add' || mode === 'view') && (
          <div className="mt-6">
            <VehicleForm
              vehicle={selectedVehicle}
              mode={mode}
              onSave={handleSave}
              onClose={handleCloseForm}
            />
          </div>
        )}
        {mode === 'edit' && selectedVehicle && (
          <EditForm
            vehicle={selectedVehicle}
            onClose={handleCloseForm}
            onSave={handleSave}
          />
)}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-6">
                Are you sure you want to delete{' '}
                <strong>{vehicleToDelete?.vehicleNumber}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {showSmsForm && (
          <SmsForm
            vehicle={selectedVehicle}
            onClose={() => setShowSmsForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

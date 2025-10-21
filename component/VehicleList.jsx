import React, { useState } from 'react';
import Modal from './Modal';

const VehicleList = ({ vehiclesDetails, onAdd, onEdit, onView, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const confirmDelete = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (onDelete && vehicleToDelete) {
      onDelete(vehicleToDelete);
    }
    setShowModal(false);
    setVehicleToDelete(null);
  };

  const getExpiryColor = (dateStr) => {
    const expiry = new Date(dateStr);
    const today = new Date();
    const diffInDays = (expiry - today) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7 ? 'red' : 'black';
  };


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Vehicle List</h1>
        <button
          onClick={onAdd}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
        >
          + Add New Vehicle
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">No.</th>
              <th className="px-6 py-3">Vehicle Number</th>
              <th className="px-6 py-3">Owner Name</th>
              <th className="px-6 py-3">Vehicle Type</th>
              <th className="px-6 py-3">Insurance Expiry</th>
              <th className="px-6 py-3">Fitness Expiry</th>
              <th className="px-6 py-3">Permit Expiry</th>
              <th className="px-6 py-3">Pollution Expiry</th>
              <th className="px-6 py-3">Tax Expiry</th>
              <th className="px-6 py-3">Document Status</th>
              <th className="px-6 py-3">Created By</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehiclesDetails.map((v, index) => (
              <tr key={v._id || index} className="bg-white border-t hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{v.vehicleNumber}</td>
                <td className="px-6 py-4">{v.ownerName}</td>
                <td className="px-6 py-4">{v.vehicleType}</td>
                <td className="px-6 py-4" style={{ color: getExpiryColor(v.insuranceExpiry) }}>{v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4" style={{ color: getExpiryColor(v.fitnessExpiry) }}>{v.fitnessExpiry ? new Date(v.fitnessExpiry).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4" style={{ color: getExpiryColor(v.permitExpiry) }}>{v.permitExpiry ? new Date(v.permitExpiry).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4" style={{ color: getExpiryColor(v.pollutionExpiry) }}>{v.pollutionExpiry ? new Date(v.pollutionExpiry).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4" style={{ color: getExpiryColor(v.taxExpiry) }}>{v.taxExpiry ? new Date(v.taxExpiry).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4">{v.documentStatus}</td>
                <td className="px-6 py-4">{v.createdBy?.name || v.createdBy?.email || v.createdBy}</td>
                <td className="px-6 py-4">{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4 flex justify-center gap-3">
                  <button onClick={() => onView(v)} className="text-blue-600 hover:underline">View</button>
                  <button onClick={() => onEdit(v)} className="text-green-600 hover:underline">Edit</button>
                  <button
                    onClick={() => confirmDelete(v)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${vehicleToDelete?.vehicleNumber}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default VehicleList;

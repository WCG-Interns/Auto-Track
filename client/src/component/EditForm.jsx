import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditForm = ({ vehicle, onClose, onSave }) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: '',
    ownerName: '',
    insuranceExpiry: '',
    fitnessExpiry: '',
    permitExpiry: '',
    pollutionExpiry: '',
    taxExpiry: '',
    documentStatus: '',
    createdBy: '',
    oldVehicle: false,
    _id: '',
  });

  const dateFields = [
    'insuranceExpiry',
    'fitnessExpiry',
    'permitExpiry',
    'pollutionExpiry',
    'taxExpiry',
  ];

  const fields = [
    'vehicleNumber',
    'ownerName',
    'vehicleType',
    'insuranceExpiry',
    'fitnessExpiry',
    'permitExpiry',
    'pollutionExpiry',
    'taxExpiry',
    'documentStatus',
    'createdBy',
  ];

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleNumber: vehicle.vehicleNumber || '',
        vehicleType: vehicle.vehicleType || '',
        ownerName: vehicle.ownerName || '',
        insuranceExpiry: vehicle.insuranceExpiry || '',
        fitnessExpiry: vehicle.fitnessExpiry || '',
        permitExpiry: vehicle.permitExpiry || '',
        pollutionExpiry: vehicle.pollutionExpiry || '',
        taxExpiry: vehicle.taxExpiry || '',
        documentStatus: vehicle.documentStatus || '',
        createdBy: vehicle.createdBy || '',
        oldVehicle: vehicle.oldVehicle || false,
        _id: vehicle._id,
      });
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date ? date.toISOString().split('T')[0] : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { _id, ...dataToSend } = formData;
      if (typeof dataToSend.createdBy === 'object' && dataToSend.createdBy._id) {
        dataToSend.createdBy = dataToSend.createdBy._id;
      }
      console.log("Submitting data to update:", dataToSend);
      const response = await axios.put(
        `https://auto-track-server.onrender.com/api/vehicles/${_id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Vehicle updated successfully!');
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Failed to update vehicle 🥲');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Vehicle</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field, idx) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700 mb-1 capitalize"
            >
              {field}
            </label>

            {field === 'createdBy' ? (
              <input
                type="text"
                id={field}
                name={field}
                value={formData.createdBy.name || formData.createdBy.email || formData.createdBy}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
                disabled
              />
            ) : dateFields.includes(field) ? (
              <DatePicker
                id={field}
                selected={formData[field] ? new Date(formData[field]) : null}
                onChange={(date) => handleDateChange(date, field)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                className="w-full px-4 py-2 border rounded-lg"
              />
            ) : (
              <input
                ref={idx === 0 ? inputRef : null}
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            )}
          </div>
        ))}

        {/* Old Vehicle Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="oldVehicle"
            name="oldVehicle"
            checked={formData.oldVehicle || false}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label htmlFor="oldVehicle" className="text-sm text-gray-700">
            Old Vehicle (Disable Notifications)
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;



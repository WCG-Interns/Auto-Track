import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const VehicleForm = ({ vehicle, mode, onClose, onSave }) => {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isAdd = mode === 'add';
  const inputRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
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
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://auto-track-server.onrender.com/api/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(res.data || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();

    // Prefill form if editing or viewing
    if ((isEdit || isView) && vehicle) {
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
        _id: vehicle._id, // For update requests
      });
    } else if (isAdd) {
      // Clear form for add mode
      setFormData({
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
      });
    }

    if (inputRef.current && !isView) {
      inputRef.current.focus();
    }
  }, [vehicle, isEdit, isView, isAdd]);

  const handleChange = (e) => {
  if (isView) return;
  const { name, type, value, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value
  }));
};


  const handleDateChange = (date, field) => {
    if (isView) return;
    setFormData((prev) => ({
      ...prev,
      [field]: date ? date.toISOString().split('T')[0] : '',
    }));
  };

   
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAdd) {
        const response = await axios.post(
          'https://auto-track-server.onrender.com/api/vehicles',
          formData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        alert('Vehicle added successfully!');
        onSave(response.data); // Return new vehicle to parent
      } else if (isEdit) {
        const response = await axios.put(
        
          `https://auto-track-server.onrender.com/api/vehicles/${formData._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        alert('Vehicle updated successfully!');
        onSave(response.data); // Return updated vehicle
      }
      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Failed to upadates details🥲');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isView ? 'View Vehicle' : isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
      </h2>

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
              <select
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={isView}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Creator</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            ) : dateFields.includes(field) ? (
              <DatePicker
                id={field}
                selected={formData[field] ? new Date(formData[field]) : null}
                onChange={(date) => handleDateChange(date, field)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                className="w-full px-4 py-2 border rounded-lg"
                disabled={isView}
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
                disabled={isView}
              />
            )}
          </div>
        ))}
         <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="oldVehicle"
            name="oldVehicle"
            checked={formData.oldVehicle || false}
            onChange={handleChange}
            
            disabled={isView}
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
            Close
          </button>

          {!isView && (
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;

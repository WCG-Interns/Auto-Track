import React, { useState } from 'react';
const Modal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const VehicleForm = ({ vehicle, mode, onClose, onSave }) => {
  const isView = mode === 'view';
  const [formData, setFormData] = useState(
    vehicle || {
      vehicleNumber: '',
      //model: '',
      vehicleType: '',
      ownerName: '',
      insurance: '',
      fitnessExpiry: '',
      permitExpiry: '',
      pollutionExpiry: '',
      taxExpiry: '',
      documentStatus: '',
      createdBy: '',
      createdAt: new Date().toISOString().split('T')[0],
    }
  );

  const handleChange = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isView) {
      onSave(formData);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">
        {mode.charAt(0).toUpperCase() + mode.slice(1)} Vehicle
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Vechicle Number', name: 'number' },
          //  { label: 'Vechicle Model', name: 'model' },
          { label: 'Vechicle Type', name: 'type' },
          { label: 'OwnerName', name: 'owner' },
          { label: 'InsuranceExpiry', name: 'insurance' },
          { label: 'FitnessExpiry', name: 'fitness' },
          { label: 'PermitExpiry', name: 'permit' },
          { label: 'PollutionExpiry', name: 'pollution' },
          { label: 'TaxExpiry', name: 'tax' },
          { label: 'documentStatus', name: 'status' },
          { label: 'Created By', name: 'createdBy' },
          { label: 'Created At', name: 'createdAt' },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block font-medium mb-1" htmlFor={name}>
              {label}
            </label>
            {isView ? (
              <p className="border p-2 rounded bg-gray-100">{formData[name]}</p>
            ) : (
              <input
                type="text"
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const UserVehicleList = ({ vehicleDetails }) => {
  const [vehicles, setVehicles] = useState(vehicleDetails);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    setVehicles(vehicles.filter((v) => v.id !== selected.id));
    setShowModal(false);
    setSelected(null);
  };

  const getExpiryColor = (dateStr) => {
    const expiry = new Date(dateStr);
    const today = new Date();
    const diffInDays = (expiry - today) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7 ? 'red' : 'black';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Vehicle List</h1>

      </div>

      {mode ? (
        <VehicleForm
          vehicle={selected}
          mode={mode}
          onClose={() => {
            setMode('');
            setSelected(null);
          }}
          onSave={(data) => {
            if (mode === 'edit') {
              setVehicles(vehicles.map((v) => (v.id === data.id ? data : v)));
            } else {
              setVehicles([...vehicles, { ...data, id: Date.now() }]);
            }
            setMode('');
            setSelected(null);
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
            <thead className="text-xs uppercase bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3">No.</th>
                <th className="px-6 py-3">Number</th>
                <th className="px-6 py-3">Owner Name</th>
                <th className="px-6 py-3">Vehicle type</th>
                <th className="px-6 py-3">Insurance Expiry</th>
                <th className="px-6 py-3">Fitness Expiry</th>
                <th className="px-6 py-3">Permit Expiry</th>
                <th className="px-6 py-3">Pollution Expiry</th>
                <th className="px-6 py-3">Tax Expiry</th>
                <th className="px-6 py-3">Document Status</th>
                <th className="px-6 py-3">Create By</th>
                <th className="px-6 py-3">Create At</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, index) => (
                <tr
                  key={v.id}
                  className="bg-white border-t hover:bg-gray-50 transition duration-150"
                >
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


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${selected?.number}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default UserVehicleList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VehicleList from './component/VehicleList';
import VehicleForm from './component/VehicleForm';
import EditForm from './component/EditForm';
import { GoShare } from "react-icons/go";
import { FaCar, FaUsers, FaBell, FaPlus, FaChartBar, FaExclamationTriangle, FaSearch, FaFilter } from "react-icons/fa";
import SmsForm from './messages/SmsFrom';

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState(''); 
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [showSmsForm, setShowSmsForm] = useState(false);
  
  // New state for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);

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

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://auto-track-server.onrender.com/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      // Don't show error to user for users fetch, just log it
    }
  };

  // Function to check if vehicle has any expiring dates
  const isVehicleExpiringSoon = (vehicle) => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Use the correct date field names
    const dateFields = [
      'insuranceExpiry',
      'taxExpiry',
      'pollutionExpiry',
      'permitExpiry',
      'fitnessExpiry',
    ];

    console.log('Checking vehicle:', vehicle.vehicleNumber, 'Vehicle data:', vehicle); // Debug log

    return dateFields.some(field => {
      if (vehicle[field]) {
        try {
          const expiryDate = new Date(vehicle[field]);
          const isExpiring = expiryDate <= thirtyDaysFromNow && expiryDate >= today;
          if (isExpiring) {
            console.log(`Vehicle ${vehicle.vehicleNumber} has ${field} expiring on:`, expiryDate); // Debug log
          }
          return isExpiring;
        } catch (error) {
          console.error(`Error parsing date ${field}:`, vehicle[field]);
          return false;
        }
      }
      return false;
    });
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...vehicles];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(vehicle => 
        vehicle.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply expiring soon filter
    if (showExpiringSoon) {
      filtered = filtered.filter(vehicle => isVehicleExpiringSoon(vehicle));
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, showExpiringSoon]);

  useEffect(() => {
    fetchVehicles();
    fetchUsers();
  }, []);

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
      alert('Failed to delete vehicle');
    } finally {
      setShowDeleteModal(false);
      setVehicleToDelete(null);
    }
  };

  // Calculate stats - moved after vehicles state is set
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status !== 'expired').length;
  const expiringSoon = vehicles.filter(v => isVehicleExpiringSoon(v)).length;
  const totalUsers = users.length;

  // Debug log for expiring vehicles
  useEffect(() => {
    if (vehicles.length > 0) {
      console.log('Total vehicles:', vehicles.length);
      const expiringVehicles = vehicles.filter(v => isVehicleExpiringSoon(v));
      console.log('Expiring vehicles:', expiringVehicles);
      console.log('Expiring count:', expiringVehicles.length);
    }
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(156, 146, 172, 0.1) 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-gray-300">Manage vehicles, users, and system analytics</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Vehicles</p>
                <p className="text-3xl font-bold text-white">{totalVehicles}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <FaCar className="text-blue-400 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Vehicles</p>
                <p className="text-3xl font-bold text-green-400">{activeVehicles}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <FaChartBar className="text-green-400 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Expiring Soon</p>
                <p className="text-3xl font-bold text-yellow-400">{expiringSoon}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <FaBell className="text-yellow-400 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-purple-400">{totalUsers}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <FaUsers className="text-purple-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        {!loading && !error && vehicles.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by vehicle number or owner name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              {/* Filter Toggle */}
              <div className="flex items-center">
                <button
                  onClick={() => setShowExpiringSoon(!showExpiringSoon)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    showExpiringSoon
                      ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <FaFilter />
                  Expiring Soon
                </button>
              </div>
              
              {/* Clear Filters */}
              {(searchTerm || showExpiringSoon) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowExpiringSoon(false);
                  }}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-gray-300 border border-white/20 rounded-xl transition-all duration-300"
                >
                  Clear
                </button>
              )}
            </div>
            
            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-400">
              Showing {filteredVehicles.length} of {totalVehicles} vehicles
              {searchTerm && ` matching "${searchTerm}"`}
              {showExpiringSoon && ` with expiring documents`}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              <p className="text-gray-300 ml-4 text-lg">Loading vehicles...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl mb-6 flex items-center">
              <FaExclamationTriangle className="mr-3 text-red-400" />
              {error}
            </div>
          )}

          {!loading && !error && vehicles.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-blue-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCar className="text-blue-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Vehicles Found</h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Start building your fleet by adding your first vehicle to the system.
              </p>
              <button
                onClick={handleAddClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
              >
                <FaPlus className="mr-2" />
                Add Your First Vehicle
              </button>
            </div>
          )}

          {!loading && !error && vehicles.length > 0 && filteredVehicles.length === 0 && (searchTerm || showExpiringSoon) && (
            <div className="text-center py-16">
              <div className="bg-gray-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Vehicles Found</h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                No vehicles match your current search criteria. Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowExpiringSoon(false);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          )}

          {!loading && !error && vehicles.length > 0 && filteredVehicles.length > 0 && (
            <VehicleList
              vehiclesDetails={filteredVehicles}
              setVehicles={setVehicles}
              onAdd={handleAddClick}
              onEdit={handleEditClick}
              onView={handleViewClick}
              onDelete={handleDeleteClick}
            />
          )}

          {(mode === 'add' || mode === 'view') && (
            <div className="mt-8">
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
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-400 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Confirm Deletion</h2>
                <p className="text-gray-300">
                  Are you sure you want to delete vehicle{' '}
                  <span className="text-white font-semibold">{vehicleToDelete?.vehicleNumber}</span>?
                </p>
                <p className="text-red-300 text-sm mt-2">This action cannot be undone.</p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl border border-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default AdminDashboard;

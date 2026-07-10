import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import VehicleCard from '../components/ui/VehicleCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyVehicles = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/vehicles/my');
      setVehicles(data);
    } catch (error) {
      toast.error('Failed to load your vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const openDeleteModal = (id) => {
    setVehicleToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setVehicleToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/vehicles/${vehicleToDelete}`);
      toast.success('Vehicle deleted successfully');
      setVehicles(vehicles.filter(v => v._id !== vehicleToDelete));
      closeDeleteModal();
    } catch (error) {
      toast.error('Failed to delete vehicle');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>My Garage</h2>
          <Link to="/add-vehicle">
            <Button variant="primary">Add New Vehicle</Button>
          </Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : vehicles.length === 0 ? (
          <EmptyState message="You haven't listed any vehicles yet. Click 'Add New Vehicle' to get started." />
        ) : (
          <div className="vehicle-grid">
            {vehicles.map(vehicle => (
              <VehicleCard 
                key={vehicle._id} 
                vehicle={vehicle} 
                showActions={true}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen} 
        onClose={closeDeleteModal} 
        onConfirm={handleDelete}
        itemName="this vehicle"
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default MyVehicles;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import VehicleCard from '../components/ui/VehicleCard';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';
import Pagination from '../components/ui/Pagination';

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isArchivedFilter, setIsArchivedFilter] = useState(''); // '' means all, 'true' means archived, 'false' means active

  const fetchMyVehicles = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 6);
      if (isArchivedFilter !== '') {
        params.append('isArchived', isArchivedFilter);
      }
      const { data } = await api.get(`/vehicles/my?${params.toString()}`);
      setVehicles(data.vehicles || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      toast.error('Failed to load your vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVehicles();
  }, [page, isArchivedFilter]);

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
      if (vehicles.length === 1 && page > 1) setPage(page - 1);
      else fetchMyVehicles();
    } catch (error) {
      toast.error('Failed to delete vehicle');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-wrapper page-enter page-enter-active">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2>My Garage</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select 
              className="form-select" 
              style={{ width: 'auto', margin: 0 }}
              value={isArchivedFilter} 
              onChange={(e) => { setIsArchivedFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Vehicles</option>
              <option value="false">Active Only</option>
              <option value="true">Archived Only</option>
            </select>
            <Link to="/add-vehicle">
              <Button variant="primary">Add New Vehicle</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="vehicle-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="card glass-panel" style={{ padding: '0' }}>
                <Skeleton type="image" />
                <div style={{ padding: '1rem' }}>
                  <Skeleton type="title" />
                  <Skeleton type="text" count={2} />
                  <Skeleton type="btn" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <EmptyState 
            title="No vehicles found" 
            description={isArchivedFilter === '' ? "You haven't listed any vehicles yet." : "No vehicles match this filter."}
            actionText={isArchivedFilter === '' ? "List a Vehicle" : "Clear Filter"}
            onAction={isArchivedFilter === '' ? null : () => setIsArchivedFilter('')}
          />
        ) : (
          <>
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
            <Pagination page={page} pages={totalPages} onPageChange={setPage} />
          </>
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

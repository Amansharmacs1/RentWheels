import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { sendVerificationEmail } from '../../services/emailService';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/admin/vehicles?search=${search}&status=${statusFilter}`);
      setVehicles(data);
    } catch (error) {
      toast.error('Failed to load vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [search, statusFilter]);

  const handleAction = async (vehicleId, action, ownerEmail, ownerName, vehicleName) => {
    try {
      await api.patch(`/admin/vehicles/${vehicleId}/${action}`);
      const newStatus = action === 'verify' ? 'Verified' : 'Rejected';
      toast.success(`Vehicle marked as ${newStatus}`);
      
      // Notify owner via EmailJS
      sendVerificationEmail(
        ownerName,
        ownerEmail,
        `Vehicle Verification: ${newStatus}`,
        `Your listing for ${vehicleName} has been ${newStatus.toLowerCase()} by an administrator.`
      );
      
      fetchVehicles();
    } catch (error) {
      toast.error(`Failed to ${action} vehicle`);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', padding: '2rem' }}>
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>Vehicle Verification</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Search brand or model..." 
              className="form-input" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '250px' }}
            />
            <select 
              className="form-select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <Card style={{ padding: '0', overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: '2rem' }}><Loader /></div>
          ) : vehicles.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No vehicles found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem' }}>Vehicle</th>
                  <th style={{ padding: '1rem' }}>Owner</th>
                  <th style={{ padding: '1rem' }}>Reg No.</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={vehicle.images[0]} alt="vehicle" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        <Link to={`/vehicle/${vehicle._id}`} style={{ fontWeight: '500', color: 'var(--primary-color)', textDecoration: 'none' }}>
                          {vehicle.brand} {vehicle.model}
                        </Link>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {vehicle.owner?.name}<br />
                      <small>{vehicle.owner?.email}</small>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>{vehicle.registrationNumber}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.85rem',
                        backgroundColor: vehicle.verificationStatus === 'Verified' ? '#d1fae5' : vehicle.verificationStatus === 'Rejected' ? '#fee2e2' : '#fef3c7',
                        color: vehicle.verificationStatus === 'Verified' ? '#059669' : vehicle.verificationStatus === 'Rejected' ? '#b91c1c' : '#b45309'
                      }}>
                        {vehicle.verificationStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {vehicle.verificationStatus === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <Button 
                            variant="secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', borderColor: '#10b981', color: '#10b981' }}
                            onClick={() => handleAction(vehicle._id, 'verify', vehicle.owner?.email, vehicle.owner?.name, `${vehicle.brand} ${vehicle.model}`)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', borderColor: '#ef4444', color: '#ef4444' }}
                            onClick={() => handleAction(vehicle._id, 'reject', vehicle.owner?.email, vehicle.owner?.name, `${vehicle.brand} ${vehicle.model}`)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminVehicles;

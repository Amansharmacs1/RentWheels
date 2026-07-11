import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { sendSuspensionEmail } from '../../services/emailService';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/admin/users?search=${search}&role=${roleFilter}`);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleStatusChange = async (userId, newStatus, userEmail, userName) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      toast.success(`User account ${newStatus.toLowerCase()}`);
      
      // Notify user via EmailJS
      sendSuspensionEmail(
        userName,
        userEmail,
        `Account ${newStatus}`,
        `Your RentWheels account has been ${newStatus.toLowerCase()} by an administrator.`
      );
      
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', padding: '2rem' }}>
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>User Management</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Search name or email..." 
              className="form-input" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '250px' }}
            />
            <select 
              className="form-select" 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Customer">Customer</option>
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
        
        <Card style={{ padding: '0', overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: '2rem' }}><Loader /></div>
          ) : users.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No users found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.85rem',
                        backgroundColor: user.role === 'Admin' ? '#f3e8ff' : '#e0e7ff',
                        color: user.role === 'Admin' ? '#7e22ce' : '#4338ca'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.85rem',
                        backgroundColor: user.accountStatus === 'Active' ? '#d1fae5' : '#fee2e2',
                        color: user.accountStatus === 'Active' ? '#059669' : '#b91c1c'
                      }}>
                        {user.accountStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {user.role !== 'Admin' && (
                        user.accountStatus === 'Active' ? (
                          <Button 
                            variant="secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', borderColor: '#ef4444', color: '#ef4444' }}
                            onClick={() => handleStatusChange(user._id, 'Suspended', user.email, user.name)}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button 
                            variant="secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', borderColor: '#10b981', color: '#10b981' }}
                            onClick={() => handleStatusChange(user._id, 'Active', user.email, user.name)}
                          >
                            Activate
                          </Button>
                        )
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

export default AdminUsers;

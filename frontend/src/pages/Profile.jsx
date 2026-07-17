import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page page-wrapper">
      <div className="container">
        <div className="profile-container">
          <Card className="profile-sidebar">
            <div className="avatar profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3>{user?.name}</h3>
            <p className="profile-role">{user?.role}</p>
            <div className="profile-details-list">
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Member Since:</span>
                <span className="detail-value">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          <Card className="profile-content glass-panel" style={{ flex: 1 }}>
            <h2>Edit Profile</h2>
            
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
              <div className="avatar profile-avatar" style={{ width: '100px', height: '100px', fontSize: '3rem' }}>
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <input 
                  type="file" 
                  id="profileImage" 
                  style={{ display: 'none' }} 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('profileImage', file);
                    const toastId = toast.loading('Uploading profile picture...');
                    try {
                      const { data } = await api.post('/users/profile-picture', formData);
                      toast.success('Profile picture updated!', { id: toastId });
                      window.location.reload(); // Refresh to get updated user context
                    } catch (error) {
                      toast.error('Failed to upload picture', { id: toastId });
                    }
                  }}
                />
                <Button variant="secondary" onClick={() => document.getElementById('profileImage').click()} style={{ marginRight: '1rem' }}>
                  Change Picture
                </Button>
                {user?.profileImage && (
                  <Button variant="secondary" onClick={async () => {
                    if(!window.confirm('Remove profile picture?')) return;
                    try {
                      await api.delete('/users/profile-picture');
                      toast.success('Profile picture removed!');
                      window.location.reload();
                    } catch (e) {
                      toast.error('Failed to remove picture');
                    }
                  }}>
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <Input
                label="Email (Cannot be changed)"
                type="email"
                value={user?.email || ''}
                disabled
              />
              <Input
                label="Role (Cannot be changed)"
                type="text"
                value={user?.role || ''}
                disabled
              />
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>

            <hr style={{ margin: '2rem 0', borderColor: 'var(--border-color)' }} />
            
            <h2>Change Password</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const currentPassword = e.target.currentPassword.value;
              const newPassword = e.target.newPassword.value;
              const toastId = toast.loading('Changing password...');
              try {
                await api.put('/users/change-password', { currentPassword, newPassword });
                toast.success('Password changed successfully!', { id: toastId });
                e.target.reset();
              } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to change password', { id: toastId });
              }
            }} className="profile-form">
              <Input label="Current Password" type="password" name="currentPassword" required minLength="6" />
              <Input label="New Password" type="password" name="newPassword" required minLength="6" />
              <Button type="submit" variant="secondary">Change Password</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

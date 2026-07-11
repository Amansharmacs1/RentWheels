import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import VehicleCard from '../components/ui/VehicleCard';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (isLoading) return <div className="page-wrapper"><Loader /></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h2>My Wishlist</h2>
          <p style={{ color: 'var(--text-light)' }}>Vehicles you have saved for later.</p>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState message="Your wishlist is empty. Start exploring and save vehicles you love!" />
        ) : (
          <div className="vehicle-grid">
            {wishlist.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

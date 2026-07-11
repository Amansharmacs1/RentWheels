import React, { useState, useContext, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';

const WishlistButton = ({ vehicleId, initialIsWishlisted = false }) => {
  const { user } = useContext(AuthContext);
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If the component didn't receive initial state, we could fetch it here
    // For now, we rely on the parent or user context to pass it correctly
    if (user && user.wishlist) {
      setIsWishlisted(user.wishlist.includes(vehicleId));
    }
  }, [user, vehicleId]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }

    setIsLoading(true);
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${vehicleId}`);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/wishlist/${vehicleId}`);
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      style={{
        background: 'none',
        border: 'none',
        cursor: isLoading ? 'wait' : 'pointer',
        fontSize: '1.5rem',
        color: isWishlisted ? '#ef4444' : '#9ca3af',
        transition: 'color 0.2s',
        padding: '0.25rem'
      }}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWishlisted ? '♥' : '♡'}
    </button>
  );
};

export default WishlistButton;

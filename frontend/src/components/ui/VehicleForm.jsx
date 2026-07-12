import React, { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import ImageUploader from './ImageUploader';
import './VehicleForm.css';

const VehicleForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    type: 'Car',
    brand: '',
    model: '',
    year: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: '',
    engineCapacity: '',
    pricePerHour: '',
    pricePerDay: '',
    securityDeposit: '',
    state: '',
    city: '',
    pickupAddress: '',
    description: '',
    registrationNumber: '',
    insuranceValidTill: '',
    images: [],
    availability: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        insuranceValidTill: initialData.insuranceValidTill ? new Date(initialData.insuranceValidTill).toISOString().split('T')[0] : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="vehicle-form">
      <div className="form-section">
        <h3>Images</h3>
        <ImageUploader 
          existingImages={formData.images} 
          onImagesChange={(urls) => {
            let newFeatured = formData.featuredImage;
            if (!urls.includes(newFeatured)) newFeatured = urls[0] || '';
            setFormData({ ...formData, images: urls, featuredImage: newFeatured });
          }} 
          featuredImage={formData.featuredImage}
          onFeaturedChange={(img) => setFormData({ ...formData, featuredImage: img })}
        />
        {formData.images.length === 0 && <p className="error-message">At least one image is required.</p>}
      </div>

      <div className="form-section">
        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} />
          <span>Vehicle is currently available for rent</span>
        </label>
        
        {initialData && (
          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error-color)' }}>
            <input type="checkbox" name="isArchived" checked={formData.isArchived} onChange={handleChange} />
            <span>Archive this vehicle (Hide from public listings instead of deleting)</span>
          </label>
        )}
      </div>

      <Button type="submit" variant="primary" isFullWidth disabled={isLoading || formData.images.length === 0}>
        {isLoading ? 'Saving...' : 'Save Vehicle'}
      </Button>
    </form>
  );
};

export default VehicleForm;

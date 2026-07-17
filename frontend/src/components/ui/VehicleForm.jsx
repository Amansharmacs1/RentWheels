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
        <h3>Basic Details</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <select name="type" className="form-input" value={formData.type} onChange={handleChange} required>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>
          </div>
          <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g., Toyota, Honda" required />
          <Input label="Model" name="model" value={formData.model} onChange={handleChange} placeholder="e.g., Camry, CBR" required />
          <Input label="Year" type="number" name="year" value={formData.year} onChange={handleChange} placeholder="e.g., 2022" required />
          <Input label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="e.g., MH 12 AB 1234" required />
        </div>
      </div>

      <div className="form-section">
        <h3>Specifications</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Fuel Type</label>
            <select name="fuelType" className="form-input" value={formData.fuelType} onChange={handleChange} required>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Transmission</label>
            <select name="transmission" className="form-input" value={formData.transmission} onChange={handleChange} required>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          {formData.type === 'Car' ? (
            <Input label="Seating Capacity" type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} placeholder="e.g., 5" required />
          ) : (
            <Input label="Engine Capacity (cc)" type="number" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} placeholder="e.g., 350" required />
          )}
        </div>
      </div>

      <div className="form-section">
        <h3>Pricing & Security</h3>
        <div className="form-grid">
          <Input label="Price per Hour (₹)" type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} required />
          <Input label="Price per Day (₹)" type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required />
          <Input label="Security Deposit (₹)" type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-section">
        <h3>Location & Details</h3>
        <div className="form-grid">
          <Input label="State" name="state" value={formData.state} onChange={handleChange} placeholder="e.g., Maharashtra" required />
          <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g., Pune" required />
          <Input label="Insurance Valid Till" type="date" name="insuranceValidTill" value={formData.insuranceValidTill} onChange={handleChange} required />
        </div>
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label className="form-label">Pickup Address</label>
          <textarea name="pickupAddress" className="form-input" rows="2" value={formData.pickupAddress} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label className="form-label">Description</label>
          <textarea name="description" className="form-input" rows="4" value={formData.description} onChange={handleChange} placeholder="Describe your vehicle..." required></textarea>
        </div>
      </div>

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

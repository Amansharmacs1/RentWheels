import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import SearchBar from '../components/ui/SearchBar';
import FilterSidebar from '../components/ui/FilterSidebar';
import VehicleCard from '../components/ui/VehicleCard';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';
import './ExploreVehicles.css';

const ExploreVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
    availability: '',
    sort: 'newest'
  });
  const [search, setSearch] = useState('');

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '') params.append(key, filters[key]);
      });

      const { data } = await api.get(`/vehicles?${params.toString()}`);
      setVehicles(data);
    } catch (error) {
      toast.error('Failed to fetch vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filters, search]);

  return (
    <div className="explore-page page-wrapper">
      <div className="container">
        <div className="explore-header">
          <h2>Explore Premium Vehicles</h2>
          <div className="search-container">
            <SearchBar onSearch={setSearch} initialValue={search} />
          </div>
        </div>

        <div className="explore-content">
          <aside className="explore-sidebar">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          <main className="explore-main">
            {isLoading ? (
              <Loader />
            ) : vehicles.length === 0 ? (
              <EmptyState message="No vehicles found matching your criteria. Try adjusting your filters or search." />
            ) : (
              <div className="vehicle-grid">
                {vehicles.map(vehicle => (
                  <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ExploreVehicles;

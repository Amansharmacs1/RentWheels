import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import toast from 'react-hot-toast';
import SearchBar from '../components/ui/SearchBar';
import FilterSidebar from '../components/ui/FilterSidebar';
import VehicleCard from '../components/ui/VehicleCard';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import Pagination from '../components/ui/Pagination';
import './ExploreVehicles.css';

const ExploreVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
      params.append('page', page);
      params.append('limit', 9); // Show 9 per page
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '') params.append(key, filters[key]);
      });

      const { data } = await api.get(`/vehicles?${params.toString()}`);
      setVehicles(data.vehicles || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filters, search, page]);

  // Reset page when filters or search change
  useEffect(() => {
    setPage(1);
  }, [filters, search]);

  return (
    <div className="explore-page page-wrapper page-enter page-enter-active">
      <Helmet>
        <title>Explore Vehicles - RentWheels</title>
        <meta name="description" content="Browse our premium selection of cars and bikes. Filter by price, type, brand, and more." />
      </Helmet>
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
              <div className="vehicle-grid">
                {[1, 2, 3, 4, 5, 6].map(i => (
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
                description="Try adjusting your filters or search criteria." 
                actionText="Clear Filters"
                onAction={() => {
                  setFilters({ type: '', brand: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '', availability: '', sort: 'newest' });
                  setSearch('');
                }}
              />
            ) : (
              <>
                <div className="vehicle-grid">
                  {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                  ))}
                </div>
                <Pagination page={page} pages={totalPages} onPageChange={setPage} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ExploreVehicles;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import VehicleCard from '../../fleet-discovery/components/VehicleCard';
import { useVehicles } from '../../../contexts/VehicleContext';

const FleetShowcase = () => {
  const navigate = useNavigate();
  const { vehicles: contextVehicles, setSelectedVehicle } = useVehicles();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    // Could also open a modal or navigate to details page
  };

  const handleBookNow = (vehicle) => {
    navigate('/instant-booking-flow', { state: { selectedVehicle: vehicle } });
  };

  useEffect(() => {
    const filterAndSortVehicles = () => {
      try {
        setLoading(true);
        // Filter for luxury vehicles and SUVs only
        const filtered = contextVehicles.filter(vehicle => {
          const category = (vehicle.category || '').toLowerCase();
          return category.includes('luxury') || category.includes('suv');
        });
        // Sort by price descending and take top 3
        const sorted = filtered.sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 3);
        setVehicles(sorted);
      } catch (error) {
        console.error('Error processing vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    filterAndSortVehicles();
  }, [contextVehicles]);

  return (
    <section className="py-12 bg-gradient-to-b from-surface-premium/60 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-cosmic-depth mb-2 tracking-tight">Luxury Vehicles</h2>
          <p className="text-lg text-text-refined max-w-2xl mx-auto mb-4 leading-relaxed">
            Luxury vehicles and SUVs, fully insured and driven by licensed PSV drivers
          </p>
        </div>
        
        {/* Fleet-style Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-depth mx-auto mb-4"></div>
              <p className="text-text-refined">Loading luxury vehicles...</p>
            </div>
          ) : vehicles?.length > 0 ? (
            vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle?._id || vehicle?.id}
                vehicle={{
                  ...vehicle,
                  // Ensure compatibility with VehicleCard props
                  pricePerDay: vehicle?.price || vehicle?.pricePerDay,
                  passengers: vehicle?.specifications?.seats || vehicle?.passengers,
                  available: vehicle?.available !== false, // Default to available if not specified
                  class: vehicle?.category || vehicle?.class || 'Luxury',
                  images: vehicle?.images || [vehicle?.image] || ['/assets/images/no_image.png']
                }}
                onViewDetails={handleViewDetails}
                onBookNow={handleBookNow}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <Icon name="Car" size={48} className="text-cosmic-silver mx-auto mb-4" />
              <p className="text-text-refined">No luxury vehicles available at the moment.</p>
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
};

export default FleetShowcase;
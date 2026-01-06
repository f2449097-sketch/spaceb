import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { formatPriceWithSeparateSuffix } from '../../../utils/formatPrice';

const VehicleCard = ({ vehicle, onViewDetails, onBookNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === vehicle?.images?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? vehicle?.images?.length - 1 : prev - 1
    );
  };

  const getClassBadgeColor = (vehicleClass) => {
    switch (vehicleClass?.toLowerCase()) {
      case 'economy':
        return 'bg-green-100 text-green-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'luxury':
        return 'bg-purple-100 text-purple-800';
      case 'adventure':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-surface-premium rounded-lg overflow-hidden shadow-md hover:shadow-lg brand-transition cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(vehicle)}
    >
      {/* Image */}
      <div className="aspect-video w-full overflow-hidden relative bg-gray-200">
        <Image
          src={vehicle?.images?.[currentImageIndex]}
          alt={`${vehicle?.make} ${vehicle?.model}`}
          className="w-full h-full object-cover group-hover:scale-105 brand-transition duration-500"
        />

        {/* Class badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getClassBadgeColor(vehicle?.class)}`}>
            {vehicle?.class || 'Luxury'}
          </span>
        </div>

        {/* Availability */}
        <div className="absolute bottom-2 left-2">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
            <div className={`w-1.5 h-1.5 rounded-full ${vehicle?.available ? 'bg-success' : 'bg-error'}`} />
            <span className="text-xs font-medium text-cosmic-depth">{vehicle?.available ? 'Available' : 'Booked'}</span>
          </div>
        </div>

        {/* Price badge */}
        <div className="absolute top-2 right-2">
          <div className="bg-stellar-gold text-cosmic-depth px-2 py-1 rounded text-xs font-bold">
            KSH {vehicle?.pricePerDay?.toLocaleString()}/day
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-3">
        <div className="mb-2">
          <h3 className="text-sm font-bold text-cosmic-depth mb-1 group-hover:text-adventure-orange brand-transition line-clamp-1">
            {vehicle?.make} {vehicle?.model}
          </h3>
          <p className="text-text-refined text-xs">{vehicle?.category || vehicle?.class}</p>
        </div>

        {/* Quick specs */}
        <div className="flex items-center justify-between text-xs text-text-refined mb-3">
          <div className="flex items-center gap-1">
            <Icon name="Users" size={12} className="text-cosmic-depth" />
            <span>{typeof vehicle?.passengers === 'number' ? `${vehicle.passengers}` : '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Settings" size={12} className="text-cosmic-depth" />
            <span>{vehicle?.transmission === 'automatic' ? 'Auto' : vehicle?.transmission || '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Fuel" size={12} className="text-cosmic-depth" />
            <span>{vehicle?.fuelType || '—'}</span>
          </div>
        </div>

        {/* Action */}
        <Button
          variant="default"
          fullWidth
          size="sm"
          onClick={(e) => { 
            if (!vehicle?.available) return;
            e?.stopPropagation(); 
            onBookNow(vehicle); 
          }}
          disabled={!vehicle?.available}
          className={`${vehicle?.available ? 'bg-cosmic-depth hover:bg-cosmic-depth/90' : 'bg-gray-400 cursor-not-allowed'} text-white text-xs py-2`}
        >
          {vehicle?.available ? 'Book Now' : 'Booked'}
        </Button>
      </div>
    </div>
  );
};

export default VehicleCard;
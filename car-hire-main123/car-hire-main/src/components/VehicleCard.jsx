import React from 'react';
import { UPLOADS_URL } from '../config/api';

const VehicleCard = ({ vehicle = {} }) => {
  const {
    _id,
    name = 'Unnamed vehicle',
    type = '',
    price = 0,
    specifications = {},
    availability = true,
    features = []
  } = vehicle;

  const seats = specifications.seats || '-';
  const transmission = specifications.transmission || '-';

  // Prefer explicit imageUrl returned by the API if present, otherwise construct fallback URLs
  const apiProvidedImageUrl = vehicle.imageUrl || null;
  const primaryImageUrl = apiProvidedImageUrl || (_id ? `${UPLOADS_URL}/images/vehicles/${_id}` : null);
  const secondaryImageUrl = _id ? `${UPLOADS_URL}/api/vehicles/${_id}/image` : null;

  // Debug: log the image URLs being used
  console.log('Vehicle image primary URL:', primaryImageUrl, 'secondary URL:', secondaryImageUrl, 'for vehicle', name);

  // Error state handling and fallback attempts. We'll also try fetching the image as a blob when <img> errors
  const [imageSrc, setImageSrc] = React.useState(primaryImageUrl || '/assets/images/no_image.png');
  const [triedSecondary, setTriedSecondary] = React.useState(false);
  const [triedBlobFallback, setTriedBlobFallback] = React.useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-[16/9] sm:aspect-[3/2] relative">
        <img
          src={_id ? `/api/vehicles/${_id}/image` : '/assets/images/no_image.png'}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = '/assets/images/no_image.png';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
            availability ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
          }`}>
            {availability ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{name}</h3>
          <p className="text-adventure-orange font-bold whitespace-nowrap ml-2">
            KES {Number(price).toLocaleString()} / day
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{type}</span>
          <span className="px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{seats} seats</span>
          <span className="px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{transmission}</span>
        </div>
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {features.slice(0,3).map((feature, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-cosmic-silver/10 rounded-full text-gray-600">
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="text-xs px-2 py-1 bg-cosmic-silver/10 rounded-full text-gray-600">
                +{features.length - 3} more
              </span>
            )}
          </div>
        )}
        <button className="w-full py-3 px-4 bg-cosmic-depth text-white rounded-lg font-medium hover:bg-cosmic-depth/90 transition-all duration-300 mt-2">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;

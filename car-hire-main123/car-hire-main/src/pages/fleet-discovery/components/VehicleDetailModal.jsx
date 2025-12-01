import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VehicleDetailModal = ({ vehicle, isOpen, onClose, onBookNow }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !vehicle) return null;

  // Ensure we have images array, fallback to single image or placeholder
  const vehicleImages = vehicle?.images && vehicle.images.length > 0 
    ? vehicle.images 
    : vehicle?.imageUrl 
    ? [vehicle.imageUrl]
    : vehicle?.image
    ? [vehicle.image]
    : ['/assets/images/no_image.png'];
  
  console.log('Vehicle images in modal:', vehicleImages);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'specifications', label: 'Specifications', icon: 'Settings' }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === vehicleImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? vehicleImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-premium rounded-xl deep-shadow max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-text-charcoal">
              {vehicle?.make} {vehicle?.model}
            </h2>
            <p className="text-text-refined">{vehicle?.year} • {vehicle?.class}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="text-text-refined hover:text-text-charcoal"
          />
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Image Gallery */}
          <div className="lg:w-1/2 relative">
            <div className="relative h-64 lg:h-full">
              <Image
                src={vehicleImages[currentImageIndex]}
                alt={`${vehicle?.make} ${vehicle?.model}`}
                className="w-full h-full object-cover"
              />
              
              {vehicleImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white brand-transition"
                  >
                    <Icon name="ChevronLeft" size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white brand-transition"
                  >
                    <Icon name="ChevronRight" size={20} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {vehicleImages.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex space-x-2 p-4 overflow-x-auto">
              {vehicleImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 brand-transition ${
                    index === currentImageIndex ? 'border-cosmic-depth' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-border overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap brand-transition ${
                    activeTab === tab?.id
                      ? 'text-cosmic-depth border-b-2 border-cosmic-depth' :'text-text-refined hover:text-text-charcoal'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {vehicle?.passengers && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cosmic-silver rounded-lg flex items-center justify-center">
                          <Icon name="Users" size={20} className="text-cosmic-depth" />
                        </div>
                        <div>
                          <p className="text-sm text-text-refined">Passengers</p>
                          <p className="font-semibold text-text-charcoal">{vehicle.passengers}</p>
                        </div>
                      </div>
                    )}
                    {vehicle?.transmission && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cosmic-silver rounded-lg flex items-center justify-center">
                          <Icon name="Settings" size={20} className="text-cosmic-depth" />
                        </div>
                        <div>
                          <p className="text-sm text-text-refined">Transmission</p>
                          <p className="font-semibold text-text-charcoal">{vehicle.transmission}</p>
                        </div>
                      </div>
                    )}
                    {vehicle?.year && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cosmic-silver rounded-lg flex items-center justify-center">
                          <Icon name="Calendar" size={20} className="text-cosmic-depth" />
                        </div>
                        <div>
                          <p className="text-sm text-text-refined">Year</p>
                          <p className="font-semibold text-text-charcoal">{vehicle.year}</p>
                        </div>
                      </div>
                    )}
                    {vehicle?.type && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cosmic-silver rounded-lg flex items-center justify-center">
                          <Icon name="Tag" size={20} className="text-cosmic-depth" />
                        </div>
                        <div>
                          <p className="text-sm text-text-refined">Type</p>
                          <p className="font-semibold text-text-charcoal">{vehicle.type}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                                {/* Description */}
              {vehicle.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-text-refined leading-relaxed">{vehicle.description}</p>
                </div>
              )}

                  {/* Pricing */}
                  <div className="bg-cosmic-silver/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-refined">Daily Hire Rate</p>
                        <p className="text-2xl font-bold text-cosmic-depth">
                          KES {vehicle?.pricePerDay?.toLocaleString()} <span className="text-sm font-normal">per day</span>
                        </p>
                        <p className="text-xs text-text-refined mt-1">
                          For 24-hour vehicle hire
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-refined">Weekly Hire Rate</p>
                        <p className="text-lg font-semibold text-text-charcoal">
                          KES {(vehicle?.pricePerDay * 7)?.toLocaleString()} <span className="text-sm font-normal">per week</span>
                        </p>
                        <p className="text-xs text-text-refined mt-1">
                          For 7-day vehicle hire
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {vehicle?.make && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-text-refined">Make</span>
                        <span className="font-medium text-text-charcoal">{vehicle.make}</span>
                      </div>
                    )}
                    {vehicle?.model && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-text-refined">Model</span>
                        <span className="font-medium text-text-charcoal">{vehicle.model}</span>
                      </div>
                    )}
                    {vehicle?.year && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-text-refined">Year</span>
                        <span className="font-medium text-text-charcoal">{vehicle.year}</span>
                      </div>
                    )}
                    {vehicle?.transmission && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-text-refined">Transmission</span>
                        <span className="font-medium text-text-charcoal">{vehicle.transmission}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}


            </div>

            {/* Footer Actions */}
            <div className="border-t border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-cosmic-depth">
                    {vehicle?.price?.toLocaleString()} KES/day
                  </p>
                  <p className="text-sm text-text-refined">
                    {vehicle?.available ? 'Available now' : 'Currently unavailable'}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => onBookNow(vehicle)}
                    disabled={!vehicle?.available}
                    className="bg-adventure-orange hover:bg-adventure-orange/90 disabled:opacity-50"
                  >
                    {vehicle?.available ? 'Book Now' : 'Unavailable'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
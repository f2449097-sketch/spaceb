import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-cosmic-depth flex items-center justify-center">
      {/* Background Image - clear and visible */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/benz.jpg"
          alt="Premium mobility experience"
          className="w-full h-full object-cover rounded-3xl shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-transparent rounded-3xl" />
      </div>

      {/* Top Left Title & Description */}
      <div className="absolute top-8 left-8 z-20 max-w-md">
        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight drop-shadow-2xl mb-4">
          <span className="block">Premium Mobility</span>
          <span className="block text-stellar-gold bg-gradient-to-r from-stellar-gold to-yellow-400 bg-clip-text text-transparent">
            Experiences
          </span>
        </h1>
        <p className="text-white/80 text-sm sm:text-base lg:text-lg font-medium leading-relaxed drop-shadow-lg">
          Luxury rentals, curated road trips, and professional transport—making every journey extraordinary.
        </p>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 w-full max-w-6xl px-6 sm:px-8 py-20 sm:py-24 flex flex-col items-center justify-center min-h-screen">
        {/* Empty space for clean center area */}
      </div>

      {/* Bottom Buttons - Near Space Borne LTD */}
      <div className="absolute bottom-32 left-8 z-20">
        {/* Mobile: Stack all buttons, Desktop: 2+1 layout */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* First row - 2 buttons on desktop, stacked on mobile */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link to="/fleet-discovery" className="w-full sm:w-auto">
              <Button
                variant="premium"
                size="sm"
                iconName="Car"
                iconPosition="left"
                className="w-full sm:w-auto py-2 px-4 text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <Icon name="Car" size={16} />
                  Rent Vehicles
                </span>
              </Button>
            </Link>
            <Link to="/road-trip-adventures" className="w-full sm:w-auto">
              <Button
                variant="glass"
                size="sm"
                iconName="MapPin"
                iconPosition="left"
                className="w-full sm:w-auto py-2 px-4 text-sm font-bold bg-white/20 backdrop-blur-md text-white rounded-lg shadow hover:bg-white/30 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  Road Trips
                </span>
              </Button>
            </Link>
          </div>
          
          {/* Second row - Third button below on desktop */}
          <div className="flex justify-start">
            <Link to="/psv-professional-services" className="w-full sm:w-auto">
              <Button
                variant="glass"
                size="sm"
                iconName="Briefcase"
                iconPosition="left"
                className="w-full sm:w-auto py-2 px-4 text-sm font-bold bg-white/20 backdrop-blur-md text-white rounded-lg shadow hover:bg-white/30 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <Icon name="Briefcase" size={16} />
                  Chauffeured Services
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
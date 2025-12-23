import React from 'react';
import HeroActions from './HeroActions';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/benz.jpg" 
          alt="Luxury Car" 
          fetchpriority="high"
          loading="eager"
          className="w-full h-full object-contain md:object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Every Journey<br />
            Deserves to be<br />
            Extraordinary
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Premium mobility experiences that transcend traditional transportation with luxury, comfort, and style
          </p>
        </div>
      </div>

      {/* Action Buttons - flush with the lowest edge of the image */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-2xl px-0 pb-0 m-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button className="py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-medium rounded flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all">
            <Icon name="Car" size={24} />
            <span className="whitespace-nowrap">Rent Premium Vehicles</span>
          </button>
          <button className="py-3 bg-white/20 backdrop-blur-sm text-white text-lg font-medium rounded flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
            <Icon name="Map" size={24} />
            <span className="whitespace-nowrap">Join Road Trip Adventures</span>
          </button>
          <button className="py-3 bg-white/20 backdrop-blur-sm text-white text-lg font-medium rounded flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
            <Icon name="Users" size={24} />
            <span className="whitespace-nowrap">Book PSV Services</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
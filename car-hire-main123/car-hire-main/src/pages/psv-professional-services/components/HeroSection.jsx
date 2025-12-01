import React from 'react';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import WhatsAppButton from '../../../components/WhatsAppButton';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/benz.jpg"
          alt="Professional Mercedes Benz executive transportation"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log('Benz image failed to load, using fallback');
            e.target.src = '/assets/images/no_image.png';
          }}
        />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="text-white">
              {/* Enhanced Title with Animation */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block text-white drop-shadow-2xl">Executive Transport</span>
                <span className="block text-stellar-gold drop-shadow-2xl bg-gradient-to-r from-stellar-gold to-yellow-400 bg-clip-text text-transparent animate-pulse">
                  Redefined
                </span>
              </h1>
            </div>

            {/* Right Content - Empty for now */}
            <div className="lg:pl-12">
              {/* This space can be used for additional content or left empty */}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Button at Bottom */}
      <div className="absolute bottom-8 left-6 lg:left-8">
        <div className="group relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          <Button
            variant="default"
            size="lg"
            iconName="MessageCircle"
            iconPosition="left"
            className="relative bg-green-500 hover:bg-green-600 text-white border-0 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <WhatsAppButton phoneNumber="+254733590901">
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                </svg>
                Chat on WhatsApp
              </span>
            </WhatsAppButton>
          </Button>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 right-6 lg:right-8 text-white animate-bounce">
        <div className="flex flex-col items-center space-y-3">
          <span className="text-sm text-gray-300 font-medium tracking-wide">Explore Services</span>
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
            <div className="w-1 h-3 bg-stellar-gold rounded-full mt-2 animate-pulse shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="absolute top-1/4 right-10 w-2 h-2 bg-stellar-gold rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-1/3 right-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 left-10 w-1.5 h-1.5 bg-stellar-gold rounded-full animate-ping opacity-40"></div>
    </section>
  );
};

export default HeroSection;
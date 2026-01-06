import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ServiceCategories = () => {
  const services = [
    {
      id: 1,
      title: "Executive Transport",
      description: "",
      features: [],
      image: "/images/Executive Transport.png",
      icon: "Briefcase",
      capacity: "1-4 passengers"
    },
    {
      id: 2,
      title: "Group Events",
      description: "",
      features: [],
      image: "https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg",
      icon: "Users",
      capacity: "8-55 passengers"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-surface-premium via-white to-surface-premium/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-stellar-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-cosmic-depth rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stellar-gold/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cosmic-depth/10 to-stellar-gold/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-cosmic-depth/20">
            <span className="text-cosmic-depth font-semibold text-sm tracking-wide">PSV Services</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cosmic-depth mb-6 leading-tight">
            Comprehensive PSV Solutions
          </h2>
          
          <p className="text-lg lg:text-xl text-text-refined max-w-2xl mx-auto leading-relaxed">
            We handle all corporate transportation, from executive to large group events, with precision and reliability.
          </p>
        </div>

        {/* Services Grid - Fleet Style */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-16 max-w-2xl mx-auto">
          {services?.map((service) => (
            <div key={service?.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group">
              {/* Image */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={service?.image}
                  alt={service?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Service Icon */}
                <div className="absolute top-2 left-2">
                  <div className="w-8 h-8 bg-stellar-gold rounded flex items-center justify-center">
                    <Icon name={service?.icon} size={16} className="text-cosmic-depth" />
                  </div>
                </div>

                {/* Capacity Badge */}
                <div className="absolute bottom-2 left-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                    <div className="text-xs font-medium text-cosmic-depth">
                      Capacity
                    </div>
                    <div className="text-xs font-bold text-cosmic-depth">{service?.capacity}</div>
                  </div>
                </div>

                {/* Premium Badge */}
                <div className="absolute top-2 right-2">
                  <div className="bg-stellar-gold text-cosmic-depth px-2 py-1 rounded text-xs font-bold">
                    Premium
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-cosmic-depth mb-3 line-clamp-1">{service?.title}</h3>

                {/* Contact Section */}
                <p className="text-xs text-text-refined mb-2 text-center font-medium">Contact us for arrangement</p>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  {/* WhatsApp Button */}
                  <a 
                    href="https://wa.me/254733590901?text=Hi, I'm interested in your PSV services for arrangement."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 w-full text-xs py-2 flex items-center justify-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </Button>
                  </a>
                  
                  {/* Call Button */}
                  <a 
                    href="tel:+254724440293"
                    className="flex-1"
                  >
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Phone"
                      iconPosition="left"
                      className="bg-cosmic-depth hover:bg-cosmic-depth/90 w-full text-xs py-2"
                    >
                      Call
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServiceCategories;
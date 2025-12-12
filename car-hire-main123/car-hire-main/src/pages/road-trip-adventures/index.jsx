import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import Footer from '../../components/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { API_BASE_URL } from '../../config/api';

const RoadTripAdventures = () => {
  const navigate = useNavigate();
  const [adventures, setAdventures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdventures();
  }, []);

  const fetchAdventures = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/adventures`);
      if (response.ok) {
        const data = await response.json();
        console.log('=== API Response ===', data);
        const adventuresList = data?.adventures || data || [];
        console.log('=== Adventures List ===', adventuresList);
        adventuresList.forEach(adv => {
          console.log(`${adv.title}: maxParticipants=${adv.maxParticipants}, bookedSeats=${adv.bookedSeats}, availableSeats=${adv.availableSeats}`);
        });
        setAdventures(adventuresList);
      } else {
        console.error('Failed to fetch adventures from API');
        setAdventures([]);
      }
    } catch (error) {
      console.error('Error fetching adventures:', error);
      setAdventures([]);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReserveNow = (adventure) => {
    // Check if adventure is fully booked
    if (adventure.availableSeats === 0) {
      alert('Sorry, this adventure is fully booked. Please choose another adventure.');
      return;
    }
    
    navigate('/instant-booking-flow', {
      state: {
        selectedAdventure: {
          id: adventure._id,
          title: adventure.title,
          location: adventure.location,
          price: adventure.price,
          duration: adventure.duration,
          maxParticipants: adventure.maxParticipants,
          availableSeats: adventure.availableSeats,
          bookedSeats: adventure.bookedSeats,
          type: 'adventure'
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-surface-premium">
      <Header />
      <main>
        <HeroSection />
        
        {loading ? (
          <section className="py-20 bg-surface-premium">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center">
                <Icon name="Loader2" size={32} className="animate-spin text-cosmic-depth mr-3" />
                <span className="text-lg text-gray-600">Loading adventures...</span>
              </div>
            </div>
          </section>
        ) : adventures.length > 0 ? (
          <section id="available-adventures" className="py-20 bg-surface-premium">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-cosmic-depth mb-4">
                  Available Adventures
                </h2>
                <p className="text-xl text-text-refined max-w-2xl mx-auto">
                  Discover our curated adventure experiences across Kenya and East Africa
                </p>
              </div>

              {/* Fleet-style Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {adventures.map((adventure) => (
                  <div key={adventure.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group">
                    {/* Image */}
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={adventure.image || '/images/savannah.jpg'}
                        alt={adventure.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Difficulty Badge */}
                      <div className="absolute top-2 left-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(adventure.difficulty)}`}>
                          {adventure.difficulty}
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute top-2 right-2">
                        <div className="bg-stellar-gold text-cosmic-depth px-2 py-1 rounded text-xs font-bold">
                          {adventure.duration}
                        </div>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-2 left-2">
                        <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                          <div className="text-xs font-bold text-cosmic-depth">KSH {adventure.price?.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-cosmic-depth mb-2 line-clamp-1">{adventure.title}</h3>
                      <p className="text-xs text-text-refined mb-2 flex items-center line-clamp-1">
                        <Icon name="MapPin" size={12} className="mr-1" />
                        {adventure.location}
                      </p>

                      {/* Available Seats Display */}
                      <div className="text-xs mb-3">
                        {adventure.availableSeats !== undefined ? (
                          <div className={`flex items-center font-bold text-sm ${
                            adventure.availableSeats === 0 ? 'text-red-600' : 
                            adventure.availableSeats <= 3 ? 'text-orange-600' : 
                            'text-green-600'
                          }`}>
                            <Icon name="Users" size={14} className="mr-1" />
                            {adventure.availableSeats === 0 ? 'Fully Booked' : `${adventure.availableSeats} seats available`}
                          </div>
                        ) : (
                          <div className="flex items-center text-text-refined font-semibold">
                            <Icon name="Users" size={12} className="mr-1" />
                            {adventure.bookedSeats !== undefined 
                              ? `${adventure.maxParticipants - (adventure.bookedSeats || 0)} seats available`
                              : `${adventure.maxParticipants} max capacity`
                            }
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {adventure.availableSeats === 0 ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                          <p className="text-xs font-semibold text-red-700">Fully Booked</p>
                          <p className="text-xs text-red-600 mt-1">No seats available</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReserveNow(adventure)}
                            disabled={adventure.availableSeats === 0}
                            className="w-full text-xs py-2 border-2 border-cosmic-depth text-cosmic-depth hover:bg-cosmic-depth hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            <Icon name="Calendar" size={12} className="mr-1" />
                            Reserve Now
                          </Button>
                          {adventure.availableSeats <= 3 && adventure.availableSeats > 0 && (
                            <p className="text-xs text-orange-600 font-semibold text-center">
                              ⚡ Only {adventure.availableSeats} left!
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section id="available-adventures" className="py-20 bg-surface-premium">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <div className="bg-white rounded-2xl p-12 premium-shadow">
                <div className="w-20 h-20 bg-cosmic-silver/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="MapPin" size={40} className="text-cosmic-silver" />
                </div>
                <h2 className="text-3xl font-bold text-cosmic-depth mb-4">
                  Available Adventures
                </h2>
                <p className="text-xl text-text-refined mb-6 max-w-2xl mx-auto">
                  We're currently curating amazing adventure experiences for you. 
                  Check back soon for exciting road trip adventures across Kenya and East Africa.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/fleet-discovery" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-cosmic-depth text-white rounded-lg hover:bg-cosmic-depth/90 transition-colors"
                  >
                    <Icon name="Car" size={20} className="mr-2" />
                    Explore Our Fleet
                  </a>
                  <a 
                    href="/psv-professional-services" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-cosmic-depth text-cosmic-depth rounded-lg hover:bg-cosmic-depth hover:text-white transition-colors"
                  >
                    <Icon name="Briefcase" size={20} className="mr-2" />
                    Professional Services
                  </a>
            </div>
          </div>
        </div>
          </section>
        )}
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RoadTripAdventures;
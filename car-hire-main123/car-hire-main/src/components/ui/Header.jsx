import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Logo from '../Logo';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, loading, logout } = useAdminAuth();
  const [lastPath, setLastPath] = useState(location?.pathname);

  // Clear admin token when leaving admin area
  useEffect(() => {
    if (lastPath?.startsWith('/admin-command-center') && !location?.pathname?.startsWith('/admin-command-center')) {
      try { sessionStorage.removeItem('admin_token'); } catch (e) {}
      try { sessionStorage.removeItem('redirectAfterLogin'); } catch (e) {}
      logout();
    }
    setLastPath(location?.pathname);
  }, [location?.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { path: '/homepage', label: 'Home', icon: 'Home' },
    { path: '/fleet-discovery', label: 'Fleet', icon: 'Car' },
    { path: '/road-trip-adventures', label: 'Adventures', icon: 'MapPin' },
    { path: '/psv-professional-services', label: 'Professional', icon: 'Briefcase' },
    { path: '/instant-booking-flow', label: 'Book Now', icon: 'Calendar' }
  ];

  const isActivePath = (path) => location?.pathname === path;
  
  // Check if we're on an admin page
  const isAdminPage = location?.pathname?.startsWith('/admin-command-center') || location?.pathname?.startsWith('/admin-login');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 brand-transition header-mobile ${
        isScrolled 
          ? 'bg-white/98 backdrop-blur-xl shadow-lg border-b border-gray-200' 
          : 'bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-100'
      }`}
    >
      <div className="h-safe-area w-full bg-inherit" />
      <div className="w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link 
            to="/homepage" 
            className="flex items-center space-x-2 sm:space-x-3 group brand-transition hover:scale-105"
          >
            <div className="relative">
              <Logo className="group-hover:stellar-glow brand-transition rounded-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-cosmic-depth font-inter tracking-tight">
                SpaceBorne
              </span>
              <span className="text-xs text-text-refined font-medium -mt-1 hidden sm:block">
                Premium Mobility
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on admin pages */}
          {!isAdminPage && (
            <nav className="flex items-center gap-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-lg brand-transition font-medium text-sm 
                    ${item?.label === 'Book Now' 
                      ? 'bg-adventure-orange text-white shadow-xl shadow-adventure-orange/40 hover:bg-adventure-orange/90 hover:scale-105 hover:shadow-2xl'
                      : isActivePath(item?.path)
                        ? 'bg-gray-900 text-white font-semibold shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'
                    }`}
                  style={{ minHeight: '44px', minWidth: '44px' }} // Touch-friendly sizing
                  onClick={() => {
                    if (location?.pathname?.startsWith('/admin-command-center') && !item?.path?.startsWith('/admin-command-center')) {
                      try { sessionStorage.removeItem('admin_token'); } catch (e) {}
                      try { sessionStorage.removeItem('redirectAfterLogin'); } catch (e) {}
                      logout();
                    }
                  }}
                >
                  <Icon 
                    name={item?.icon} 
                    size={18} 
                    strokeWidth={2} 
                    className={item?.label === 'Book Now' ? 'text-white' : ''}
                  />
                  <span className={item?.label === 'Book Now' ? 'font-semibold' : ''}>{item?.label}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Admin Navigation - Only visible on admin pages */}
          {isAdminPage && (
            <nav className="flex items-center gap-4">
              <div className="flex items-center space-x-2 text-cosmic-depth">
                <Icon name="ShieldCheck" size={20} />
                <span className="font-medium text-sm">Admin Panel</span>
              </div>
              {admin && (
                <Button
                  onClick={() => {
                    logout();
                    navigate('/homepage');
                  }}
                  variant="outline"
                  size="sm"
                  iconName="LogOut"
                  iconPosition="left"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              )}
            </nav>
          )}

          {/* Mobile Quick Access Menu Button - Hidden since we show desktop nav */}
          <Button
            variant="ghost"
            size="sm"
            iconName={isMenuOpen ? "X" : "Menu"}
            className="hidden text-text-charcoal hover:text-cosmic-depth min-h-[44px] min-w-[44px]"
            onClick={toggleMenu}
          />
        </div>

        {/* Mobile Navigation - Hidden since we show desktop nav on all screens */}
        <div 
          className={`hidden fixed inset-0 bg-black/80 backdrop-blur-lg z-50 brand-transition ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl brand-transition transform ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
              <span className="text-xl font-semibold text-cosmic-depth">Menu</span>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                className="text-gray-500 hover:text-cosmic-depth w-10 h-10 flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              />
            </div>
            <nav className="px-4 py-6 space-y-3 overflow-y-auto max-h-[calc(100vh-4rem)]">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-5 py-4 rounded-xl brand-transition font-medium relative overflow-hidden min-h-[52px] ${item?.label === 'Book Now' 
                  ? 'bg-adventure-orange text-white shadow-lg shadow-adventure-orange/20' 
                  : isActivePath(item?.path)
                    ? 'bg-gray-100 text-cosmic-depth font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-cosmic-depth'
                }`}
              >
                <div className="relative z-10 flex items-center space-x-3">
                  <Icon name={item?.icon} size={20} strokeWidth={2} className="flex-shrink-0" />
                  <span className="text-base">{item?.label}</span>
                </div>
                {isActivePath(item?.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cosmic-silver/20 to-transparent opacity-50" />
                )}
              </Link>
            ))}
            
            <div className="pt-4">
              <Link to="/instant-booking-flow">
                <Button
                  variant="default"
                  fullWidth
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="bg-adventure-orange hover:bg-adventure-orange/90 text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </nav>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
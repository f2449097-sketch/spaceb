import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SwipeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // Navigation routes in order
  const routes = [
    { path: '/homepage', name: 'Home' },
    { path: '/fleet-discovery', name: 'Fleet' },
    { path: '/road-trip-adventures', name: 'Adventures' },
    { path: '/psv-professional-services', name: 'Professional' },
    { path: '/instant-booking-flow', name: 'Book Now' }
  ];

  const currentIndex = routes.findIndex(route => route.path === location.pathname);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < routes.length - 1) {
      // Swipe left - go to next page
      navigate(routes[currentIndex + 1].path);
      showSwipeNotification('Next: ' + routes[currentIndex + 1].name);
    }
    
    if (isRightSwipe && currentIndex > 0) {
      // Swipe right - go to previous page
      navigate(routes[currentIndex - 1].path);
      showSwipeNotification('Previous: ' + routes[currentIndex - 1].name);
    }
  };

  const showSwipeNotification = (message) => {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      pointer-events: none;
      animation: fadeInOut 1.5s ease-in-out;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 1500);
  };

  useEffect(() => {
    // Hide swipe hint after user swipes or after 8 seconds
    const timer = setTimeout(() => setShowSwipeHint(false), 8000);
    
    const handleFirstSwipe = () => {
      setShowSwipeHint(false);
      document.removeEventListener('touchend', handleFirstSwipe);
    };
    
    document.addEventListener('touchend', handleFirstSwipe);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchend', handleFirstSwipe);
    };
  }, []);

  // Only show on touch devices
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouch) return null;

  return (
    <>
      {/* Swipe detection area */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ 
          touchAction: 'pan-y', // Allow vertical scrolling
          pointerEvents: 'auto'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* Swipe hint */}
      {showSwipeHint && (
        <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-50">
          <div className="bg-black/70 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2 animate-pulse">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Swipe to navigate
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      )}

      {/* Page indicator dots */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex gap-2 bg-black/50 px-3 py-2 rounded-full">
          {routes.map((route, index) => (
            <div
              key={route.path}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-adventure-orange w-6' 
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `}</style>
    </>
  );
};

export default SwipeNavigation;

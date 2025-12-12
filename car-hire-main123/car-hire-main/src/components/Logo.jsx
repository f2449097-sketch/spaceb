import React from 'react';

const Logo = ({ className }) => {
  return (
    <img
      src="/images/space_logo.gpeg.jpg"
      alt="SpaceBorne Logo"
      className={`w-10 h-10 object-contain ${className || ''}`}
    />
  );
};

export default Logo;

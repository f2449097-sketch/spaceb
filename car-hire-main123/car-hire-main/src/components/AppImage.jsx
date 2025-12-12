import React from 'react';

import { UPLOADS_URL } from '../config/api';

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Process the source URL with better error handling
  const processImageUrl = (url) => {
    try {
      if (!url) return "/assets/images/no_image.png";
      
      // External URLs - use as is
      if (url.startsWith("http")) return url;
      
      // Public folder images - use as is
      if (url.startsWith("/images/") || url.startsWith("/assets/")) {
        return url;
      }
      
      // Backend uploads
      if (url.startsWith("/uploads/")) {
        return `${UPLOADS_URL}${url}`;
      }
      
      // Default case
      return url;
    } catch (error) {
      console.error("Error processing image URL:", error);
      return "/assets/images/no_image.png";
    }
  };

  const finalSrc = hasError ? "/assets/images/no_image.png" : processImageUrl(src);
  
  return (
    <div className={`relative ${className}`}>
      <img
        src={finalSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={(e) => {
          console.error('Image failed to load:', {
            originalSrc: src,
            processedSrc: finalSrc,
            error: e
          });
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => {
          console.log('Image loaded successfully:', finalSrc);
          setIsLoading(false);
        }}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
      )}
    </div>
  );
}

export default Image;

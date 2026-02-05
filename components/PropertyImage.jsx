"use client";

const PropertyImage = ({ 
  src, 
  alt, 
  fill, 
  className, 
  style, 
  priority = false,
  quality = 80,
  sizes,
  width,
  height,
  ...props 
}) => {
  const handleError = (e) => {
    e.target.src = '/img/heroImage.jpg';
  };

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
      onError={handleError}
      {...props}
    />
  );
};

export default PropertyImage;

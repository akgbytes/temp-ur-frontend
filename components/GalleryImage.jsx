"use client";
import PropertyImage from "./PropertyImage";

const GalleryImage = ({ src, alt, index, className = "", style = {} }) => {
  return (
    <div className={`position-relative rounded-3 overflow-hidden shadow-lg ${className}`} style={style}>
      <PropertyImage 
        src={src || '/img/heroImage.jpg'} 
        alt={alt}
        fill
        className="object-cover"
        quality={95}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
        style={{ 
          background: 'linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))', 
          opacity: 0, 
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '0';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <div className="text-center text-white">
          <i className="bi bi-zoom-in" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3 mb-0 fw-bold">Gallery {index + 1}</p>
        </div>
      </div>
    </div>
  );
};

export default GalleryImage;

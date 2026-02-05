'use client';

import Image from 'next/image';

const ImageGalleryRow = ({ images, propertyTitle }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="row g-3 mb-5">
      {images.map((image, index) => (
        <div key={index} className="col-md-3 col-6">
          <div 
            className="position-relative overflow-hidden rounded-3 shadow-sm"
            style={{ 
              height: '200px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onClick={() => {
              // Open image in lightbox or full view
              window.open(image, '_blank');
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Image
              src={image}
              alt={`${propertyTitle} - Image ${index + 2}`}
              width={300}
              height={200}
              className="img-fluid"
              style={{ 
                objectFit: 'cover', 
                width: '100%', 
                height: '100%' 
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGalleryRow;

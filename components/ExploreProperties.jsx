"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Services = () => {
  const services = [
    {
      id: 1,
      title: "COMMERCIAL",
      icon: "bi-building",
      backgroundImage: "/img/commercial.png", // Using existing hero image as fallback
      description: "Premium commercial properties for your business needs",
      link: "/properties?category=commercial"
    },
    {
      id: 2,
      title: "RESIDENTIAL",
      icon: "bi-house",
      backgroundImage: "/img/residential.png", // Using existing hero image as fallback
      description: "Luxury residential properties and apartments",
      link: "/properties?category=residential"
    },
    {
      id: 3,
      title: "RENTALS",
      icon: "bi-building-fill",
      backgroundImage: "/img/rentals.png", // Using existing hero image as fallback
      description: "Independent builder floors and villas",
      link: "/properties?category=rentals"
    },
    {
      id: 4,
      title: "INVESTMENTS",
      icon: "bi-cash",
      backgroundImage: "/img/investments.png", // Using existing hero image as fallback
      description: "Premium Investments properties and rentals",
      link: "/properties?category=investments"
    }
  ];

  return (
    <section className="py-5" style={{ backgroundColor: 'rgb(0, 30, 121)' }}>
      <div className="container">
        {/* Section Title */}
        {/* <div className="text-center mb-4 mb-md-5">
          <h2 className="display-6 display-md-5 fw-bold text-white mb-3 services-title">
            <span className="text-white">OUR</span> <span className="text-danger">SERVICES</span>
          </h2>
          <div className="mx-auto services-underline" style={{ width: '100px', height: '2px', backgroundColor: 'white' }}></div>
        </div> */}

        {/* Services Grid */}
        <div className="row g-3 g-md-4">
          {services.map((service) => (
            <div key={service.id} className="col-lg-3 col-md-6 col-6">
              <div 
                className="card h-100 border-0 shadow-lg position-relative overflow-hidden service-card"
                style={{ 
                  minHeight: '300px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                }}
              >
                {/* Background Image */}
                <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
                  <Image
                    src={service.backgroundImage}
                    alt={`${service.title} background`}
                    fill
                    className="object-cover"
                    priority={false}
                    quality={80}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {/* Overlay */}
                  <div 
                    className="position-absolute w-100 h-100"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4))',
                      zIndex: 2
                    }}
                  />
                </div>

                {/* Service Content */}
                <div className="card-body d-flex flex-column justify-content-between p-2 p-md-4 text-white position-relative" style={{ zIndex: 3 }}>
                  {/* Icon */}
                  <div className="text-center mb-2 mb-md-3">
                    <i className={`bi ${service.icon} text-white service-icon`}></i>
                  </div>
                  
                  {/* Service Title */}
                  <div className="text-center mb-2 mb-md-3">
                    <h4 className="fw-bold text-white mb-1 mb-md-2 service-title">{service.title}</h4>
                    <p className="text-white-50 small service-description">{service.description}</p>
                  </div>
                  
                  {/* View Details Button */}
                  <div className="text-center mt-auto">
                    <Link 
                      href={service.link}
                      className="btn btn-danger service-button fw-semibold"
                      style={{ 
                        borderRadius: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-4 mt-md-5">
          <p className="text-white-50 fs-5 mb-4 cta-text">
            Discover the perfect property for your needs
          </p>
          <Link 
            href="/properties" 
            className="btn btn-outline-light btn-lg px-5 py-3 cta-button"
            style={{ 
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}
          >
            Explore All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;

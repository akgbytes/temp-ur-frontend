"use client";
import React from 'react';
import Link from 'next/link';

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Real Estate Consulting",
      icon: "🛋️",
      iconBg: "linear-gradient(135deg, #B94545 0%, #C85555 100%)",
      description: "Get expert real estate consulting to find the right property, whether it's flats, apartments, or new residential projects.",
      buttonText: "Get Started",
      buttonStyle: "outline",
      link: "/contact-us"
    },
    {
      id: 2,
      title: "Legal Assistance",
      icon: "👨‍🎓",
      iconBg: "linear-gradient(135deg, #B94545 0%, #C85555 100%)",
      description: "Buying property needs trusted legal support. We guide you with property documents, agreements, and safe transactions.",
      buttonText: "Learn More",
      buttonStyle: "outline",
      link: "/contact-us"
    },
    {
      id: 3,
      title: "Interior Design",
      icon: "🏠",
      iconBg: "linear-gradient(135deg, #E85D75 0%, #E85D75 100%)",
      description: "Transform your house into a dream home with affordable interior design solutions for flats, villas, and apartments.",
      buttonText: "Learn More",
      buttonStyle: "solid",
      featured: true,
      link: "/contact-us"
    },
    {
      id: 4,
      title: "Property Loan",
      icon: "💳",
      iconBg: "linear-gradient(135deg, #B94545 0%, #C85555 100%)",
      description: "We help you choose the best home loan options and guide you through the process to buy your property with ease.",
      buttonText: "Learn More",
      buttonStyle: "outline",
      link: "/contact-us"
    },
    {
      id: 5,
      title: "Construction",
      icon: "🏗️",
      iconBg: "linear-gradient(135deg, #B94545 0%, #C85555 100%)",
      description: "End-to-end construction solutions with quality, timelines, and transparency.",
      buttonText: "Learn More",
      buttonStyle: "outline",
      link: "/contact-us"
    }
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="container">
        {/* Section Title */}
        <div className="text-center mb-5">
          <p className="text-uppercase text-danger fw-semibold mb-2" style={{ letterSpacing: '2px', fontSize: '0.9rem' }}>
            OUR SERVICES
          </p>
          <h2 className="display-5 fw-bold mb-3" style={{ color: '#2C3E50' }}>
            <span style={{ color: '#B94545' }}>Comprehensive</span> Real Estate <span style={{ color: '#B94545' }}>Solutions</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px', fontSize: '1.1rem', lineHeight: '1.8' }}>
            From consultation to construction, we provide end-to-end services to make your property dreams a reality
          </p>
        </div>

        {/* Services Grid */}
        <div className="row g-4">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`col-lg-4 col-md-6 ${index >= 3 ? 'col-lg-6' : ''}`}
            >
              <div 
                className={`card h-100 border-0 position-relative overflow-hidden service-card ${service.featured ? 'featured-service' : ''}`}
                style={{ 
                  borderRadius: '20px',
                  transition: 'all 0.3s ease',
                  boxShadow: service.featured 
                    ? '0 10px 40px rgba(232, 93, 117, 0.3)' 
                    : '0 5px 20px rgba(0,0,0,0.08)',
                  background: service.featured 
                    ? 'linear-gradient(135deg, rgba(232, 93, 117, 0.05) 0%, rgba(255,255,255,1) 100%)'
                    : 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = service.featured
                    ? '0 15px 50px rgba(232, 93, 117, 0.4)'
                    : '0 15px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = service.featured
                    ? '0 10px 40px rgba(232, 93, 117, 0.3)'
                    : '0 5px 20px rgba(0,0,0,0.08)';
                }}
              >
                {/* Decorative Corner Arrow */}
                <div 
                  className="position-absolute"
                  style={{
                    top: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    background: service.featured ? 'rgba(232, 93, 117, 0.1)' : 'rgba(185, 69, 69, 0.05)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: service.featured ? '#E85D75' : '#B94545'
                  }}
                >
                  →
                </div>

                {/* Service Content */}
                <div className="card-body d-flex flex-column p-4">
                  {/* Icon */}
                  <div className="mb-4">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: service.iconBg,
                        borderRadius: '20px',
                        fontSize: '2rem',
                        boxShadow: '0 8px 20px rgba(185, 69, 69, 0.2)'
                      }}
                    >
                      {service.icon}
                    </div>
                  </div>
                  
                  {/* Service Title */}
                  <h4 className="fw-bold mb-3" style={{ 
                    color: '#2C3E50',
                    fontSize: '1.5rem'
                  }}>
                    {service.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-muted mb-4 flex-grow-1" style={{ 
                    lineHeight: '1.8',
                    fontSize: '0.95rem'
                  }}>
                    {service.description}
                  </p>
                  
                  {/* Button */}
                  <div className="mt-auto">
                    <Link 
                      href={service.link}
                      className={`btn ${
                        service.buttonStyle === 'solid' 
                          ? 'btn-danger' 
                          : 'btn-outline-danger'
                      } d-inline-flex align-items-center gap-2`}
                      style={{ 
                        borderRadius: '10px',
                        padding: '12px 28px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        border: service.buttonStyle === 'outline' ? '2px solid #dc3545' : 'none'
                      }}
                    >
                      {service.buttonText}
                      <span style={{ fontSize: '1.2rem' }}>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA (Optional) */}
        <div className="text-center mt-5">
          <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
            Need help with your property journey?
          </p>
          <Link 
            href="/contact-us" 
            className="btn btn-danger btn-lg px-5 py-3"
            style={{ 
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 8px 25px rgba(220, 53, 69, 0.3)'
            }}
          >
            Contact Us Today
          </Link>
        </div>
      </div>

      <style jsx>{`
        .service-card {
          cursor: pointer;
        }
        
        .featured-service {
          position: relative;
        }
        
        .featured-service::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, transparent 0%, rgba(232, 93, 117, 0.03) 100%);
          pointer-events: none;
          border-radius: 20px;
        }

        @media (max-width: 768px) {
          .service-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Services;


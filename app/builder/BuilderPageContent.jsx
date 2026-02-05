'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { buildersAPI } from '@/lib/api';

export default function BuilderPageContent() {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        setLoading(true);
        
        const response = await buildersAPI.getAll();
        
        
        if (response.error) {
          console.error('Builders API error:', response.error);
          setBuilders([]);
        } else {
          // Builders API returns array directly from backend, wrapped in {data: [...]}
          const buildersData = Array.isArray(response.data) ? response.data : [];
          setBuilders(buildersData);
        }
      } catch (error) {
        console.error('Error fetching builders:', error);
        setBuilders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilders();
  }, []);

  return (
    <>
      <div>
        <Header/>
        <div className="buildersection mt-5 pt-5 fs-3 fw-bold text-center">

          <div className='container bg-custom-primary text-white p-5 rounded-4 d-flex justify-content-center align-items-center'>
              <div>
                  Explore Builders – one of the country's most dynamic communities.
              </div>
          </div>

          {/* Builder Cards with Responsive Grid Layout */}

          <div className="container mt-4 mt-md-5 px-0">
              <div className="row g-3 g-md-4 px-3 px-md-0">
                  {loading ? (
                      <div className="col-12 text-center">
                          <div className="spinner-border spinner-custom-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-2">Loading builders...</p>
                      </div>
                  ) : builders.length > 0 ? (
                      builders.map((builder) => (
                      <div key={builder._id || builder.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
                          <Link href={`/builder/${builder.slug}`} className="text-decoration-none">
                              <div className="card builder-card h-100 border-0 shadow-sm overflow-hidden">
                                  {/* Builder Background Image */}
                                  <div className="position-relative" style={{ height: "250px" }}>
                                      {builder.backgroundImage && (
                                          <Image 
                                              src={builder.backgroundImage} 
                                              alt={`${builder.name} background`}
                                              fill
                                              sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, (max-width: 1200px) 25vw, 20vw"
                                              style={{ objectFit: "cover" }}
                                              loading="lazy"
                                              quality={80}
                                              placeholder="blur"
                                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                          />
                                      )}
                                      
                                      {/* Overlay with Logo and Name */}
                                      <div className="position-absolute bottom-0 start-0 w-100 p-3" 
                                           style={{ 
                                               background: "linear-gradient(transparent, rgba(32, 24, 24, 0.7))",
                                               color: "white"
                                           }}>
                                          <div className="d-flex align-items-center">
                                              {/* Builder Logo */}
                                              <div style={{ 
                                                  width: "40px", 
                                                  height: "40px", 
                                                  backgroundColor: "white", 
                                                  borderRadius: "5px", 
                                                  marginRight: "10px",
                                                  padding: "3px"
                                              }}>
                                                  {builder.logo && (
                                                      <Image 
                                                          src={builder.logo} 
                                                          alt={`${builder.name} logo`}
                                                          width={34}
                                                          height={34}
                                                          style={{ objectFit: "contain" }}
                                                          loading="lazy"
                                                          quality={90}
                                                      />
                                                  )}
                                              </div>
                                              {/* Builder Name */}
                                              <h6 className="mb-0 fw-bold">{builder.name}</h6>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </Link>
                      </div>
                      ))
                  ) : (
                      <div className="col-12 text-center">
                          <p>No builders found.</p>
                      </div>
                  )}
              </div>
          </div>

        </div>
        <Footer/>
      </div>
    </>
  );
}

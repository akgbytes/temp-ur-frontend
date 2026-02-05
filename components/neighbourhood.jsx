"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { citiesAPI } from "@/lib/api";
import CitySkeleton from "./CitySkeleton";

export default function Neighbourhood() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const fetchCities = async () => {
      try {
        if (isMounted) setLoading(true);
        const response = await citiesAPI.getAll();
        
        // Only update state if component is still mounted
        if (isMounted) {
          // Handle both old and new response formats
          if (response.error) {
            console.error('Error fetching cities:', response.error);
            setCities([]);
          } else {
            setCities(response.data || response || []);
          }
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        // Fallback to empty array if API fails
        if (isMounted) {
          setCities([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCities();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <section className="p-4 py-md-5 bg-light rounded-5 my-5">
      <div className="container px-3 px-md-0">
    

        {/* City Cards - 4 in a row */}
        <div className="container px-0">
          <div className="row g-3 g-md-4">
            {loading ? (
              // Skeleton loading
              <>
                <CitySkeleton />
                <CitySkeleton />
                <CitySkeleton />
                <CitySkeleton />
              </>
            ) : cities.length > 0 ? (
              cities.map((city) => {
              // Generate slug from name if not available
              const slug = city.slug || city.name.toLowerCase().replace(/\s+/g, '-');
              return (
              <div key={city._id || city.id} className="col-lg-3 col-md-6 col-sm-6">
                <Link href={`/city/${slug}`} className="text-decoration-none">
                
                <div className="card city-card h-100 shadow-sm border-0 bg-white overflow-hidden">
                  {/* City Image */}
                  <div
                    className="position-relative city-card-image"
                  >
                    {city.backgroundImage && (
                      <Image
                        src={city.backgroundImage}
                        alt={city.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        className="card-img-top"
                        loading="lazy"
                        quality={80}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      />
                    )}

                    {/* Location Overlay */}
                    <div className="position-absolute bottom-0 start-0 w-100 p-3" 
                         style={{ 
                             background: "linear-gradient(transparent, rgba(0, 0, 0, 0.7))",
                             color: "white"
                         }}>
                      <p className="text-white mb-1 fw-bold">
                        {city.name}
                      </p>
                    </div>
                  </div>

                </div>
                </Link>
              </div>
            );
            })
            ) : (
              // Empty state
              <div className="col-12 text-center py-5">
                <p className="text-muted">No cities available at the moment.</p>
              </div>
            )}
          </div>
        </div>

      
      </div>
    </section>
  );
}

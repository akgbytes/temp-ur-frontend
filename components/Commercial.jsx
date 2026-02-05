"use client";
import React from "react";
import Link from "next/link";
import { useProperties } from "@/contexts/PropertiesContext";
import PropertyCard from "./PropertyCard";
import FeaturedSkeleton from "./FeaturedSkeleton";

export default function Commercial() {
  const { getCommercialProperties, loading, error } = useProperties();
  const properties = getCommercialProperties(15);

  return (
    <section className="p-md-4 p-2 py-md-5 my-5">
      <div className="container px-3 px-md-0">
        <div className="d-flex justify-content-between align-items-center mb-4 mb-md-5">
          <div>
            <h2 className="display-6 fw-bold text-dark mb-2">COMMERCIAL PROPERTIES</h2>
            <p className="text-muted mb-0">Find the perfect space for your business</p>
          </div>
          <Link 
            href="/properties?category=commercial" 
            className="btn btn-outline-primary"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <FeaturedSkeleton />
        ) : error ? (
          <div className="text-center py-5">
            <p className="text-danger">Failed to load properties. Please try again later.</p>
          </div>
        ) : properties.length > 0 ? (
          <>
            {/* Split properties into rows of 5 (max 3 rows = 15 properties) */}
            {Array.from({ length: Math.ceil(properties.length / 5) }, (_, rowIndex) => {
              const startIndex = rowIndex * 5;
              const endIndex = Math.min(startIndex + 5, properties.length);
              const rowProperties = properties.slice(startIndex, endIndex);
              
              return (
                <div key={`row-${rowIndex}`} className="mb-4">
                <div
                  className="d-flex hide-scrollbar"
                  style={{
                    gap: 16,
                    overflowX: "auto",
                    paddingBottom: 8,
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                    {rowProperties.map((property) => (
                      <div key={property._id || property.id} className="flex-shrink-0 featured-card-link">
                        <PropertyCard property={property} showBuilder={true} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No commercial properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}


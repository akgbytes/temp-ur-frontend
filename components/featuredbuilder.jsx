"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProperties } from "@/contexts/PropertiesContext";
import PropertyCard from "./PropertyCard";
import FeaturedSkeleton from "./FeaturedSkeleton";

export default function FeaturedListings() {
  const router = useRouter();
  const { getBuilderProperties, builders: allBuilders, loading, error } = useProperties();
  const projects = getBuilderProperties(100);
  
  // Sort builders by displayOrder (ascending order)
  const builders = [...allBuilders].sort((a, b) => {
    const orderA = a.displayOrder !== undefined ? a.displayOrder : 999;
    const orderB = b.displayOrder !== undefined ? b.displayOrder : 999;
    return orderA - orderB;
  });

  // Normalizer to avoid mismatches like extra spaces or different casing
  const normalize = (s) => (s || "").toString().trim().toLowerCase();

  // Group projects by normalized builder name for fast lookup
  const projectsByBuilder = new Map();
  if (Array.isArray(projects)) {
    for (const p of projects) {
      // Handle both object and string builder references
      const builderName = typeof p.builder === 'object' ? p.builder?.name : p.builder;
      const key = normalize(builderName || "");
      
      // Only add if builder name exists
      if (key) {
        if (!projectsByBuilder.has(key)) projectsByBuilder.set(key, []);
        projectsByBuilder.get(key).push(p);
      }
    }
  }

  // Map of known builders by normalized name
  const knownBuilders = new Map();
  if (Array.isArray(builders)) {
    for (const b of builders) {
      const normalizedName = normalize(b.name);
      knownBuilders.set(normalizedName, b);
    }
  }

  // Only show builders that have projects in projectsByBuilder
  // This ensures we only display builders with actual properties
  const keys = Array.from(projectsByBuilder.keys());

  // Build an array of builder objects to display (use the known data when available,
  // otherwise create a dynamic builder entry using the project's builder name)
  // Filter to only show builders with minimum 5 properties
  const mergedBuilders = keys
    .map((key, idx) => {
      const known = knownBuilders.get(key);
      const projectsForKey = projectsByBuilder.get(key) || [];
      
      // Only include builders with 5 or more properties
      if (projectsForKey.length < 5) return null;
      
      if (known) return known;

      // If not a known builder, create a lightweight object using the case-sensitive
      // builder name from the first project for nicer display
      const firstProject = projectsForKey[0];
      const displayName = firstProject ? 
        (typeof firstProject.builder === 'object' ? firstProject.builder?.name : firstProject.builder) : 
        key;
      // Generate a proper slug from the display name
      const generateSlug = (name) => {
        return name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      };
      
      return {
        id: `dyn-${idx}-${key}`,
        _id: `dyn-${idx}-${key}`,
        name: displayName,
        slug: generateSlug(displayName), // Generate proper slug for dynamic builders
        logo: null,
        background: null,
        displayOrder: 999, // Set high displayOrder for dynamic builders so they appear last
      };
    })
    .filter(Boolean) // Remove null entries (builders with < 5 properties)
    .sort((a, b) => {
      // Sort merged builders by displayOrder (ascending order)
      const orderA = a.displayOrder !== undefined ? a.displayOrder : 999;
      const orderB = b.displayOrder !== undefined ? b.displayOrder : 999;
      return orderA - orderB;
    });

  // Helper to get an image source string (handles imported modules or plain strings)
  const getImgSrc = (img) => {
    if (!img) return "/img/logo.jpg"; // fallback logo from public folder
    if (typeof img === "string") return img;
    // If img is an imported module (Next.js Image import), try to read .src
    if (img && img.src) return img.src;
    return "/img/logo.jpg"; // fallback logo from public folder
  };

  return (
    <section className="p-md-4 p-2 py-md-5 bg-light my-5">
      <div className="container px-3 px-md-0">
        <div className="text-center mb-4 mb-md-5">
          <h2 className="display-6 display-md-5 fw-bold text-dark mb-3">Trending Properties</h2>
          <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3 mb-4">
            <span className="badge bg-primary">Featured</span>
            <span className="badge bg-secondary">Premium</span>
            <span className="badge bg-success">Luxury</span>
          </div>
        </div>

        {/* For each builder render one horizontal row of cards */}
        {loading ? (
          // Skeleton loading
          <FeaturedSkeleton />
        ) : mergedBuilders.length > 0 ? (
          mergedBuilders.map((builder) => {
          const key = normalize(builder.name);
          const builderProjects = projectsByBuilder.get(key) || [];

          return (
            <div key={builder._id || builder.id || builder.name} className="mb-5">
              {/* Builder header */}
              <div className="d-flex align-items-center mb-3">
                

                <h4 className="mb-0 fw-bold text-dark">{builder.name}</h4>

                <div className="ms-auto">
                  {builder.slug ? (
                    <Link 
                      href={`/builder/${builder.slug}`} 
                      className="btn btn-sm btn-outline-primary"
                    >
                      View All
                    </Link>
                  ) : (
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      disabled
                    >
                      No Slug
                    </button>
                  )}
                </div>
              </div>

              {/* Horizontal scroll list of project cards for this builder */}
              {builderProjects.length > 0 ? (
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
                  {builderProjects.map((listing) => (
                    <div key={listing._id || listing.id} className="flex-shrink-0 featured-card-link">
                      <PropertyCard property={listing} showBuilder={false} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No listings for this builder yet.</p>
              )}
            </div>
          );
        })
        ) : (
          // Empty state
          <div className="text-center py-5">
            <p className="text-muted">No featured listings available at the moment.</p>
          </div>
        )}

        {/* Optional full listings button */}
        <div className="text-center mt-4 mt-md-5">
          <button 
            onClick={() => router.push('/properties')}
            className="btn btn-primary"
          >
            View All
          </button>
        </div>
      </div>
    </section>
  );
}
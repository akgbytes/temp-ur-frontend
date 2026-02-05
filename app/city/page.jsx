import React from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
// Removed incorrect importg
import Neighbourhood from "@/components/neighbourhood";

// Basic SEO metadata for city page
export const metadata = {
  title: "Cities & Neighborhoods | Urbanesta",
  description: "Explore the best cities and neighborhoods in India. Find properties in your preferred location with Urbanesta.",
};

export default function City() {
    return (
        <div>
            <Header/>
            {/* city hero section */}
               <div className="cityherosection d-flex flex-column flex-md-row mt-5 pt-5 overflow-hidden">
                             <p className="bg-custom-primary text-white m-2 p-3 fs-4 fs-md-3 fw-bold rounded-4 text-center d-flex align-items-center justify-content-center" style={{ minHeight: '80px', flexShrink: 0 }}>Explore the country's most dynamic communities</p>
                             <div className="position-relative w-100 overflow-hidden" style={{ 
                               aspectRatio: '16/9',
                               minHeight: '200px',
                               maxHeight: '300px'
                             }}>
                               <Image 
                                  src="/img/download.jpg" 
                                  alt="City Background" 
                                  fill
                                  className="w-100 h-100" 
                                  style={{objectFit: "cover"}} 
                                  loading="lazy"
                                  quality={85}
                                  sizes="100vw"
                                  placeholder="blur"
                                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                               />
                             </div>
                </div>

                    <Neighbourhood/>
            <Footer/>
        </div>
    )
}
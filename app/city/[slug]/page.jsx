import React, { Suspense } from "react";
import CityDetailContent from "./CityDetailContent";

// Basic SEO metadata for city detail page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${slug} - Properties | Urbanesta`,
    description: `Find properties in ${slug} on Urbanesta. Explore residential and commercial real estate options.`,
  };
}

export default function CityPage({ params }) {
  return (
    <Suspense fallback={
      <div className="text-center py-5">
        <div className="spinner-border text-custom-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading city details...</p>
      </div>
    }>
      <CityDetailContent params={params} />
    </Suspense>
  );
}
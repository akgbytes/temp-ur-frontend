import React, { Suspense } from "react";
import BuilderDetailContent from "./BuilderDetailContent";

// Basic SEO metadata for builder detail page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${slug} - Builder | Urbanesta`,
    description: `Explore properties by ${slug} builder on Urbanesta. Find premium residential and commercial projects.`,
  };
}

export default function Builder({ params }) {
  return (
    <Suspense fallback={
      <div className="text-center py-5">
        <div className="spinner-border text-custom-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading builder details...</p>
      </div>
    }>
      <BuilderDetailContent params={params} />
    </Suspense>
  );
}
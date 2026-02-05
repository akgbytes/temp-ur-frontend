import React, { Suspense } from "react";
import BuilderPageContent from "./BuilderPageContent";

// Basic SEO metadata for builders page
export const metadata = {
  title: "Top Builders in India | Urbanesta",
  description: "Explore the best builders and developers in India. Find premium residential and commercial projects from trusted builders.",
};

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-5">
        <div className="spinner-border text-custom-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading builders...</p>
      </div>
    }>
      <BuilderPageContent />
    </Suspense>
  );
}
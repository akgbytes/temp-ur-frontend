import Header from "@/components/header";
import Footer from "@/components/footer";
import React, { Suspense } from "react";
import PropertyPageContent from "./PropertyPageContent";

// Basic SEO metadata for properties page
export const metadata = {
  title: "Properties for Sale & Rent in India | Urbanesta",
  description: "Find your dream property in India. Browse thousands of residential and commercial properties for sale and rent across major cities.",
};

export default function PropertyPage() {
  return (
    <Suspense fallback={
      <div>
        <Header />
        <div className="text-center py-5">
          <div className="spinner-border text-custom-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading properties...</p>
        </div>
        <Footer />
      </div>
    }>
      <PropertyPageContent />
    </Suspense>
  );
}
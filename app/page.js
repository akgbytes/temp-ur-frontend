import Header from "@/components/header";
import Footer from "@/components/footer";
import Hero from "@/components/hero.jsx";
import FeaturedBuilder from "@/components/featuredbuilder";
import Topbuilder from "@/components/topbuilder";
import Services from "@/components/Services";
import Neighbourhood from "@/components/neighbourhood";
import Testimonial from "@/components/testmonial";
import ErrorBoundary from "@/components/ErrorBoundary";
import SeoFooter from "@/components/seofooter";
import LatestProperties from "@/components/LatestProperties";
import Residential from "@/components/Residential";
import ExploreProperties from "@/components/ExploreProperties";
import Commercial from "@/components/Commercial";
import BestBudget from "@/components/BestBudget";
import TopLuxury from "@/components/TopLuxury";
import Possession from "@/components/Possession";
import PropertyTypesInfo from "@/components/PropertyTypesInfo";
import Link from "next/link";
import Temporary from "@/components/Temporary";

// Basic SEO metadata for home page
export const metadata = {
  title: "Urbanesta - Find Your Dream Property in India",
  description:
    "Discover premium residential and commercial properties across India. Find apartments, villas, plots, and commercial spaces from top builders.",
};

export default async function Home() {
  return (
    <>
      <Header />

      {/* Hero Section with Search Bar */}
      <Hero />

      {/* Top Builder Section */}
      <ErrorBoundary>
        <Topbuilder />
      </ErrorBoundary>

      {/* View More Builders Button */}
      <div className="container text-center my-4">
        <Link href="/builder" className=" btn-lg btn btn-primary fw-semibold">
          View More Builders
        </Link>
      </div>

      {/* Specific Builder Showcase */}
      <ErrorBoundary>
        <Temporary />
      </ErrorBoundary>

      {/* Latest Properties Section - 50 Properties */}
      <ErrorBoundary>
        <LatestProperties />
      </ErrorBoundary>

      {/* Featured Builder Section */}
      <ErrorBoundary>
        <FeaturedBuilder />
      </ErrorBoundary>

      {/* Property Types Info Section */}
      <ErrorBoundary>
        <PropertyTypesInfo />
      </ErrorBoundary>

      {/* Residential Properties Section - 10 Properties */}
      <ErrorBoundary>
        <Residential />
      </ErrorBoundary>

      {/* Commercial Properties Section - 10 Properties */}
      <ErrorBoundary>
        <Commercial />
      </ErrorBoundary>
      {/* Best Budget Section - 1 Cr to 10 Cr */}
      <ErrorBoundary>
        <BestBudget />
      </ErrorBoundary>

      {/* Top Luxury Section - Above 10 Cr */}
      <ErrorBoundary>
        <TopLuxury />
      </ErrorBoundary>

      {/* Possession Section - Before SEO Footer */}
      <ErrorBoundary>
        <Possession />
      </ErrorBoundary>

      {/* Services Section */}
      <ErrorBoundary>
        <Services />
      </ErrorBoundary>

      {/* {explore propertes} */}
      <ErrorBoundary>
        <ExploreProperties />
      </ErrorBoundary>

      {/* Neighbourhood Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 display-md-5 fw-bold text-dark mb-3">
              Find the Neighborhood For You
            </h2>
            <p className="text-muted fs-5">
              The neighborhoods best suited to your lifestyle, and the agents
              who know them best.
            </p>
          </div>

          <ErrorBoundary>
            <Neighbourhood />
          </ErrorBoundary>

          {/* View All Neighbourhoods Button */}
          <div className="text-center mt-4">
            <Link href="/city" className="btn btn-primary btn-lg">
              View More Neighbourhoods
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <ErrorBoundary>
        <Testimonial />
      </ErrorBoundary>

      <ErrorBoundary>
        <SeoFooter />
      </ErrorBoundary>

      <Footer />
    </>
  );
}

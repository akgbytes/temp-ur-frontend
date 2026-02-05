'use client';
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';



export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="position-relative pt-5 pb-4 bg-light overflow-hidden mt-5">
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-opacity-5" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 text-center">
              <h1 className="display-3 display-md-1 fw-bold text-dark mb-4">
                About <span className="text-custom-primary">Urbanesta</span>
              </h1>
              <p className="lead text-muted">
                Transforming the real estate experience through innovation, transparency, and trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {/* Mission */}
            <div className="col-12 col-lg-6">
              <div className="text-center text-lg-start">
                <div className="d-inline-flex align-items-center justify-content-center bg-custom-primary bg-opacity-10 rounded-3 mb-4" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-lightning-charge-fill text-white fs-2"></i>
                </div>
                <h2 className="display-5 fw-bold text-dark mb-4">Our Mission</h2>
                <p className="fs-5 text-muted lh-base">
                  To revolutionize the real estate industry by providing transparent, reliable, and customer-centric 
                  solutions that make property transactions seamless and trustworthy for everyone.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="col-12 col-lg-6">
              <div className="text-center text-lg-start">
                <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-3 mb-4" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-eye-fill text-success fs-2"></i>
                </div>
                <h2 className="display-5 fw-bold text-dark mb-4">Our Vision</h2>
                <p className="fs-5 text-muted lh-base">
                  To become India&apos;s most trusted real estate platform, where finding your dream property is simple, 
                  safe, and transparent, creating lasting value for all stakeholders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Our Services Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center justify-content-center bg-custom-primary rounded-3 mb-4" style={{width: '80px', height: '80px'}}>
              <i className="bi bi-briefcase-fill text-white fs-3"></i>
            </div>
            <h2 className="display-3 fw-bold text-dark mb-4">
              Explore Our <span className="text-custom-primary">Services</span>
            </h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: '800px'}}>
              From property consulting to construction, we provide comprehensive real estate solutions 
              to make your property journey seamless and successful.
            </p>
          </div>

          <div className="row g-4">
            
            {/* Real Estate Consulting */}
            <div className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4">
                  <div className="position-relative mb-4">
                    <div className="bg-custom-primary bg-gradient rounded-2 d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-house-fill text-white fs-3"></i>
                    </div>
                  </div>
                  <h3 className="h3 fw-bold text-dark mb-3">Real Estate Consulting</h3>
                  <p className="text-muted mb-4">
                    Get expert real estate consulting to find the right property, whether it&apos;s flats, 
                    apartments, or new residential projects.
                  </p>
                  <div className="d-flex align-items-center text-custom-primary fw-semibold">
                    Learn More
                    <i className="bi bi-arrow-right-short ms-2"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Assistance */}
            <div className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4">
                  <div className="position-relative mb-4">
                    <div className="bg-success bg-gradient rounded-2 d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-shield-check-fill text-dark fs-3"></i>
                    </div>
                  </div>
                  <h3 className="h3 fw-bold text-dark mb-3">Legal Assistance</h3>
                  <p className="text-muted mb-4">
                    Buying property needs trusted legal support. We guide you with property documents, 
                    agreements, and safe transactions.
                  </p>
                  <div className="d-flex align-items-center text-success fw-semibold">
                    Learn More
                    <i className="bi bi-arrow-right-short ms-2"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Interior Design */}
            <div className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4">
                  <div className="position-relative mb-4">
                    <div className="bg-purple bg-gradient rounded-2 d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-palette-fill text-white fs-3"></i>
                    </div>
                  </div>
                  <h3 className="h3 fw-bold text-dark mb-3">Interior Design</h3>
                  <p className="text-muted mb-4">
                    Transform your house into a dream home with affordable interior design solutions 
                    for flats, villas, and apartments.
                  </p>
                  <div className="d-flex align-items-center text-purple fw-semibold">
                    Learn More
                    <i className="bi bi-arrow-right-short ms-2"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Loan */}
            <div className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4">
                  <div className="position-relative mb-4">
                    <div className="bg-warning bg-gradient rounded-2 d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-currency-dollar text-white fs-3"></i>
                    </div>
                  </div>
                  <h3 className="h3 fw-bold text-dark mb-3">Property Loan</h3>
                  <p className="text-muted mb-4">
                    We help you choose the best home loan options and guide you through the process 
                    to buy your property with ease.
                  </p>
                  <div className="d-flex align-items-center text-warning fw-semibold">
                    Learn More
                    <i className="bi bi-arrow-right-short ms-2"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Management */}
            <div className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4">
                  <div className="position-relative mb-4">
                    <div className="bg-info bg-gradient rounded-2 d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-building-gear text-white fs-3"></i>
                    </div>
                  </div>
                  <h3 className="h3 fw-bold text-dark mb-3">Property Management</h3>
                  <p className="text-muted mb-4">
                    Comprehensive property management services for landlords and investors, 
                    from tenant screening to maintenance coordination.
                  </p>
                  <div className="d-flex align-items-center text-info fw-semibold">
                    Learn More
                    <i className="bi bi-arrow-right-short ms-2"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Construction */}
            <div className="col-12 col-md-12 col-xl-4">
              <div className="card h-100 border-0 bg-custom-primary text-white">
                <div className="card-body p-4">
                  <div className="position-relative mb-4">
                    <div className="bg-white bg-opacity-20 rounded-2 d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-tools text-dark fs-3"></i>
                    </div>
                  </div>
                  <h3 className="h3 fw-bold mb-3">Construction Services</h3>
                  <p className="text-light mb-4">
                    End-to-end construction solutions with quality, timelines, and transparency. 
                    From residential buildings to commercial projects, we deliver excellence.
                  </p>
                  <div className="d-flex align-items-center fw-semibold">
                    Learn More
                    <i className="bi bi-arrow-right-short ms-2"></i>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Call to Action */}
          <div className="text-center mt-5">
            <div className="card border-0 shadow-sm mx-auto" style={{maxWidth: '800px'}}>
              <div className="card-body p-5">
                <h3 className="h2 fw-bold text-dark mb-3">Ready to Get Started?</h3>
                <p className="text-muted mb-4 mx-auto" style={{maxWidth: '600px'}}>
                  Contact us today to learn more about our comprehensive real estate services and 
                  how we can help you achieve your property goals.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Link
                    href="/contact"
                    className="btn btn-custom-primary btn-lg px-4 py-3 fw-semibold"
                  >
                    Get Started Today
                  </Link>
                  <Link
                    href="/help"
                    className="btn btn-outline-secondary btn-lg px-4 py-3 fw-semibold"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Urbanesta Section */}
      <section className="py-5 bg-white">
        <div className="container">
          
          {/* Section Header */}
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center justify-content-center bg-custom-primary bg-gradient rounded-3 mb-4" style={{width: '80px', height: '80px'}}>
              <i className="bi bi-heart-fill text-white fs-3"></i>
            </div>
            <h2 className="display-3 fw-bold text-dark mb-4">
              Why Choose <span className="text-custom-primary">Urbanesta</span>?
            </h2>
            <div className="mx-auto" style={{maxWidth: '900px'}}>
              <p className="lead text-muted mb-3">
                Urbanesta is transforming property buying, selling, and renting by offering verified property 
                listings for flats, villas, apartments, SCO plots, commercial spaces, and budget-friendly homes.
              </p>
              <p className="text-muted">
                With a huge database of residential and commercial real estate projects in India, the platform 
                ensures trusted builders, genuine deals, and expert guidance every step of the way.
              </p>
            </div>
          </div>

          {/* Founder Section */}
          <div className="mb-5">
            <div className="card bg-custom-primary bg-opacity-10 border-0">
              <div className="card-body p-4 p-md-5">
                <div className="row align-items-center g-4">
                  <div className="col-12 col-md-auto text-center">
                    <div className="bg-custom-primary rounded-3 d-flex align-items-center justify-content-center mx-auto" style={{width: '120px', height: '120px'}}>
                      <Image src="/img/anilmann.png" alt="Anil Mann" width={120} height={120} />
                      {/* <span className="display-4 fw-bold text-white">AM</span> */}
                    </div>
                  </div>
                  <div className="col-12 col-md text-center text-md-start">
                    <h3 className="h1 fw-bold text-white mb-1">Anil Mann</h3>
                    <p className="text-white fw-bold fs-5 mb-3">Founder & CEO</p>
                    <blockquote className="fs-5 text-white fst-italic">
                      &quot;Our mission is to revolutionize the real estate industry by providing transparent, 
                      reliable, and customer-centric solutions. We believe everyone deserves to find their 
                      perfect property with confidence and ease.&quot;
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="row g-3 mb-5">
            
            {/* Residential Projects */}
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card text-center border-0 shadow-sm h-100 bg-custom-primary bg-opacity-10">
                <div className="card-body p-3">
                  <div className="bg-custom-primary rounded-2 d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-house-fill text-white fs-4"></i>
                  </div>
                  <h3 className="h2 fw-bold text-white mb-2">1,600+</h3>
                  <p className="small fw-semibold text-white">Residential Projects</p>
                </div>
              </div>
            </div>

            {/* Commercial Projects */}
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card text-center border-0 shadow-sm h-100 bg-success bg-opacity-10">
                <div className="card-body p-3">
                  <div className="bg-success rounded-2 d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-building-fill text-white fs-4"></i>
                  </div>
                  <h3 className="h2 fw-bold text-success mb-2">900+</h3>
                  <p className="small fw-semibold text-muted">Commercial Projects</p>
                </div>
              </div>
            </div>

            {/* SCO Plots */}
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card text-center border-0 shadow-sm h-100 bg-purple bg-opacity-10">
                <div className="card-body p-3">
                  <div className="bg-purple rounded-2 d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-map-fill text-white fs-4"></i>
                  </div>
                  <h3 className="h2 fw-bold text-white mb-2">90+</h3>
                  <p className="small fw-semibold text-muted">SCO Plots</p>
                </div>
              </div>
            </div>

            {/* Plots & Floors */}
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card text-center border-0 shadow-sm h-100 bg-warning bg-opacity-10">
                <div className="card-body p-3">
                  <div className="bg-warning rounded-2 d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-grid-3x3-gap-fill text-white fs-4"></i>
                  </div>
                  <h3 className="h2 fw-bold text-warning mb-2">400+</h3>
                  <p className="small fw-semibold text-muted">Plots & Floors</p>
                </div>
              </div>
            </div>

            {/* Monthly Visitors */}
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card text-center border-0 shadow-sm h-100 bg-info bg-opacity-10">
                <div className="card-body p-3">
                  <div className="bg-info rounded-2 d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-people-fill text-white fs-4"></i>
                  </div>
                  <h3 className="h2 fw-bold text-info mb-2">2.45L+</h3>
                  <p className="small fw-semibold text-muted">Monthly Visitors</p>
                </div>
              </div>
            </div>

            {/* Awards */}
            <div className="col-6 col-md-4 col-lg-2">
              <div className="card text-center border-0 shadow-sm h-100 bg-warning bg-opacity-10">
                <div className="card-body p-3">
                  <div className="bg-warning rounded-2 d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-award-fill text-white fs-4"></i>
                  </div>
                  <h3 className="h2 fw-bold text-warning mb-2">100+</h3>
                  <p className="small fw-semibold text-muted">Awards</p>
                </div>
              </div>
            </div>

          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="card bg-custom-primary text-white border-0">
              <div className="card-body p-4 p-md-5">
                <div className="d-inline-flex align-items-center justify-content-center bg-white bg-opacity-20 rounded-2 mb-4" style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-heart-fill text-danger fs-4"></i>
                </div>
                <h3 className="h2 fw-bold mb-4">
                  Trusted by Thousands of Happy Customers
                </h3>
                <p className="lead text-light opacity-75 mx-auto" style={{maxWidth: '800px'}}>
                  Join the growing community of satisfied customers who found their dream properties with Urbanesta. 
                  Experience the difference of working with India&apos;s most trusted real estate platform.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Company Values Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="display-4 fw-bold text-dark mb-3">Our Core Values</h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: '600px'}}>
              The principles that guide every interaction and decision we make
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card text-center border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="bg-custom-primary bg-opacity-10 rounded-2 d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-check-circle-fill text-white fs-4"></i>
                  </div>
                  <h3 className="h4 fw-bold text-dark mb-3">Transparency</h3>
                  <p className="text-muted">Clear communication and honest dealings in every transaction</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card text-center border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="bg-success bg-opacity-10 rounded-2 d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-star-fill text-success fs-4"></i>
                  </div>
                  <h3 className="h4 fw-bold text-dark mb-3">Excellence</h3>
                  <p className="text-muted">Delivering exceptional service and exceeding expectations</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card text-center border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="bg-purple bg-opacity-10 rounded-2 d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-person-heart text-white fs-4"></i>
                  </div>
                  <h3 className="h4 fw-bold text-dark mb-3">Customer First</h3>
                  <p className="text-muted">Your success and satisfaction is our primary focus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
        }
        .bg-purple {
          background-color: #6f42c1 !important;
        }
        .text-purple {
          color: #6f42c1 !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
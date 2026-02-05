'use client';

import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Contact() {

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-5 pb-4 bg-custom-primary text-white mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-4 fw-bold mb-4">
                Contact Us
              </h1>
              <p className="lead text-light">
                We&apos;re here to help you with all your real estate needs. Get in touch with our expert team today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info & Map */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* Contact Information */}
            <div className="col-lg-6">
              <div className="ps-lg-4">
                <h2 className="h3 fw-bold text-dark mb-4">Get in Touch</h2>
                
                <div className="vstack gap-4">
                  {/* Office Address */}
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-light rounded-circle p-3 flex-shrink-0">
                      <i className="bi bi-geo-alt-fill text-custom-primary fs-5"></i>
                    </div>
                    <div>
                      <h3 className="h5 fw-semibold text-dark mb-2">Office Address</h3>
                      <p className="text-muted mb-0">
                        TOWER-B2, Spaze I-Tech Park<br />
                        1154, Gurugram, Haryana 122018<br />
                        India
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-light rounded-circle p-3 flex-shrink-0">
                      <i className="bi bi-telephone-fill text-custom-primary fs-5"></i>
                    </div>
                    <div>
                      <h3 className="h5 fw-semibold text-dark mb-2">Phone Number</h3>
                      <p className="text-muted mb-0">
                        <a href="tel:+918886589000" className="text-decoration-none">+91 88865 89000</a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-light rounded-circle p-3 flex-shrink-0">
                      <i className="bi bi-envelope-fill text-custom-primary fs-5"></i>
                    </div>
                    <div>
                      <h3 className="h5 fw-semibold text-dark mb-2">Email Addresses</h3>
                      <p className="text-muted mb-0">
                        Sales: <a href="mailto:sales@urbanesta.in" className="text-decoration-none">sales@urbanesta.in</a><br />
                        Support: <a href="mailto:support@urbanesta.in" className="text-decoration-none">support@urbanesta.in</a>
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-light rounded-circle p-3 flex-shrink-0">
                      <i className="bi bi-clock-fill text-custom-primary fs-5"></i>
                    </div>
                    <div>
                      <h3 className="h5 fw-semibold text-dark mb-2">Business Hours</h3>
                      <p className="text-muted mb-0">
                        Sunday: 10:00 AM - 9:00 PM<br />
                        Monday: 10:00 AM - 9:00 PM<br />
                        Tuesday: Closed<br />
                        Wednesday: 10:00 AM - 9:00 PM<br />
                        Thursday: 10:00 AM - 9:00 PM<br />
                        Friday: 10:00 AM - 9:00 PM<br />
                        Saturday: 10:00 AM - 9:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Section */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h2 className="h3 fw-bold text-dark mb-4">Find Us</h2>
                  <p className="text-muted mb-4">
                    Visit our office at Spaze I-Tech Park, Gurugram
                  </p>
                  <div className="ratio ratio-16x9 rounded">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.114891780405!2d77.0836683!3d28.415789899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d220d8b6cf2ff%3A0xd20e0a44f3917e36!2sUrbanesta%20Realtors!5e0!3m2!1sen!2sin!4v1759680890553!5m2!1sen!2sin" 
                      width="100%" 
                      height="100%" 
                      style={{border: 0}} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Urbanesta Realtors Location"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
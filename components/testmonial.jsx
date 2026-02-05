import React from "react";
import Link from "next/link";

export default function Testimonial() {
  const testimonials = [
    { name: "Rahul Sharma", username: "Rahul", review: "Great platform, found perfect home easily!", rating: 5, },
    { name: "Ananya Verma", username: "Ananya", review: "Transparent process, professional advice!", rating: 5, },
    { name: "Vikram Singh", username: "Vikram", review: "Smooth process, sold faster than expected!", rating: 5, },
    { name: "Priya Patel", username: "Priya", review: "Perfect commercial space, expert guidance!", rating: 5,  },
    { name: "Arjun Mehta", username: "Arjun", review: "Connected with genuine landlords easily!", rating: 5, }
  ];



  return (
    <section className="py-5 bg-light rounded-5 m-md-5 m-2">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">
            What Our <span className="text-danger">Clients Say</span>
          </h2>
          <p className="lead text-muted">
            Real experiences from buyers, sellers, and investors who trusted Urbanesta for their property journey.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className=" mb-5 d-flex gap-4 p-4" style={{overflowX: 'auto'}}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-12">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    {/* image here for testmonial user */}
                    <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                      <span className="text-white fw-bold fs-5">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>

                    <div>
                      <h6 className="mb-1 fw-bold">{testimonial.name}</h6>
                     
                    </div>
                  </div>
                  <div className="mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </div>
                  <p className="text-muted mb-0">"{testimonial.review}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="row">
          <div className="col-12">
            <div className="bg-danger text-white rounded-4 p-5 text-center">
              <h3 className="fw-bold mb-3">Ready to Share Your Success Story?</h3>
              <p className="lead mb-4">
                Join thousands of satisfied customers who found their perfect property with Urbanesta.
                Start your property journey today.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link href="/properties" className="btn btn-light btn-lg px-4 py-2 fw-semibold">
                  Browse Properties
                </Link>
                  <Link href="tel:+918886589000" className="btn btn-dark btn-lg text-decoration-none text-white px-4 py-2 fw-semibold">
            <i className=" bi bi-telephone-fill text-white me-2"></i> Contact Us
        </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

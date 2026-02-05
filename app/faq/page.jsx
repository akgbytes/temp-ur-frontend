'use client';
import React, { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';


export default function Faq() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      category: "General Questions",
      questions: [
        {
          question: "What services do Urbanesta Realtors offer?",
          answer: "Urbanesta Realtors offers a full range of real estate services including: Residential sales and rentals, Commercial property transactions, Property management, Real estate investment consultation, Property valuation and market analysis, and Relocation assistance."
        },
        {
          question: "What makes Urbanesta Realtors different from other real estate agencies?",
          answer: "Urbanesta Realtors stands out due to: Personalized Service - We tailor our services to meet each client's specific needs. Expert Knowledge - Our team consists of experienced professionals with extensive local market knowledge. Transparency - We believe in honest, open communication and work to make the process as smooth as possible. Innovative Tools - We offer advanced property search tools, virtual tours, and up-to-date market insights."
        },
        {
          question: "Do I need to be a local resident to work with Urbanesta Realtors?",
          answer: "No, we work with clients from all over the world. Whether you're a local resident or an international investor, we are equipped to handle all your real estate needs."
        }
      ]
    },
    {
      category: "Property Buying",
      questions: [
        {
          question: "How can I buy a property through Urbanesta Realtors?",
          answer: "Step 1: Contact us to discuss your needs (budget, location, type of property). Step 2: We will provide a curated list of available properties that meet your criteria. Step 3: Schedule property viewings and choose the one you love. Step 4: We assist with negotiations, paperwork, and legal formalities to close the deal. Step 5: Enjoy your new property!"
        },
        {
          question: "How do I know if a property is a good investment?",
          answer: "At Urbanesta Realtors, we provide comprehensive market analysis, including rental yield, price trends, and potential for future appreciation. Our experienced consultants can guide you through the decision-making process, ensuring your investment aligns with your long-term financial goals."
        },
        {
          question: "Are there any hidden fees when buying or renting a property?",
          answer: "No, we ensure full transparency when it comes to costs. All fees, including commission, taxes, registration costs, or maintenance charges, will be clearly communicated before you proceed with any transaction. We believe in upfront pricing to avoid any surprises."
        },
        {
          question: "Do I need a real estate agent to rent or buy a property?",
          answer: "While it's not mandatory, having a real estate agent can make the process much easier. We guide you through the market, offer expert advice, handle negotiations, and assist with paperwork, saving you time and stress."
        }
      ]
    },
    {
      category: "Property Selling",
      questions: [
        {
          question: "How do I list my property on Urbanesta?",
          answer: "Simply create an account, click 'List Property', fill in the property details, upload high-quality photos, and our team will verify and publish your listing. We also offer professional photography services for better visibility."
        },
        {
          question: "What are the charges for listing a property?",
          answer: "Basic listing is free with limited features. Premium listings with enhanced visibility, professional photography, and priority support start from ₹2,999. We also offer commission-based packages for faster sales."
        },
        {
          question: "How long does it take to sell a property?",
          answer: "The time varies based on location, price, market conditions, and property appeal. Well-priced properties in good locations typically sell within 2-6 months. Our marketing strategies and network help accelerate the process."
        }
      ]
    },
    {
      category: "Investment & Finance",
      questions: [
        {
          question: "Is real estate a good investment option?",
          answer: "Real estate offers stable returns, tax benefits, and acts as a hedge against inflation. However, it requires significant capital and has lower liquidity. Our investment advisory team can help you make informed decisions based on your financial goals."
        },
        {
          question: "What are the tax benefits of buying property?",
          answer: "Property buyers can avail tax benefits under Section 80C (up to ₹1.5 lakh), Section 24 (home loan interest deduction up to ₹2 lakh), and Section 80EEA (additional deduction for first-time homebuyers). Our tax experts can guide you through these benefits."
        },
        {
          question: "How do I get a home loan?",
          answer: "We have partnerships with leading banks and NBFCs offering competitive home loan rates. Our financial advisors help you compare options, understand eligibility criteria, and complete the loan application process with minimal documentation."
        }
      ]
    },
    {
      category: "Legal & Documentation",
      questions: [
        {
          question: "What legal checks should I perform before buying?",
          answer: "Essential legal checks include: Title verification, encumbrance certificate, property tax receipts, building plan approval, NOC from society/association, and RERA registration. Our legal team conducts comprehensive due diligence."
        },
        {
          question: "What is the difference between freehold and leasehold property?",
          answer: "Freehold property gives you complete ownership rights in perpetuity, while leasehold property is owned for a specific period (usually 99 years). Freehold properties generally have higher value and fewer restrictions."
        },
        {
          question: "Do I need a lawyer for property transactions?",
          answer: "While not mandatory, having a lawyer is highly recommended for property transactions. They help verify documents, draft agreements, ensure legal compliance, and protect your interests. We provide legal assistance as part of our services."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "How do I contact Urbanesta support?",
          answer: "You can reach us through multiple channels: Phone (toll-free), email, live chat on our website, or visit our office. Our customer support team is available 9 AM to 7 PM, Monday to Saturday."
        },
        {
          question: "What if I face issues with the website?",
          answer: "If you encounter any technical issues, please contact our technical support team immediately. We also have a comprehensive help center with troubleshooting guides and video tutorials for common problems."
        },
        {
          question: "How do I update my profile information?",
          answer: "Log into your account, go to 'My Profile', click 'Edit Profile', make the necessary changes, and save. For sensitive information like contact details, you may need to verify the changes through OTP."
        }
      ]
    }
  ];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="bg-custom-primary text-white py-5 mt-5 pt-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">Frequently Asked Questions</h1>
              <p className="lead mb-0">
                Find answers to common questions about buying, selling, and investing in real estate with Urbanesta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              
              {/* Search Box */}
              <div className="mb-5">
                <div className="input-group input-group-lg">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search FAQs..."
                    id="faqSearch"
                  />
                </div>
              </div>

              {/* FAQ Categories */}
              {faqData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-5">
                  <h2 className="h3 text-custom-primary mb-4 border-bottom pb-2">
                    {category.category}
                  </h2>
                  
                  <div className="accordion" id={`accordion-${categoryIndex}`}>
                    {category.questions.map((item, itemIndex) => {
                      const fullIndex = `${categoryIndex}-${itemIndex}`;
                      const isOpen = openItems[fullIndex];
                      
                      return (
                        <div key={itemIndex} className="accordion-item mb-3 border rounded">
                          <h3 className="accordion-header">
                            <button
                              className={`accordion-button ${!isOpen ? 'collapsed' : ''}`}
                              type="button"
                              onClick={() => toggleItem(fullIndex)}
                              aria-expanded={isOpen}
                            >
                              <i className="bi bi-question-circle text-custom-primary me-3"></i>
                              {item.question}
                            </button>
                          </h3>
                          <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                            <div className="accordion-body">
                              <div className="d-flex align-items-start">
                                <i className="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                                <div>
                                  {item.answer}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Contact Section */}
              <div className="row mt-5">
                <div className="col-12">
                  <div className="card bg-light border-0">
                    <div className="card-body text-center p-5">
                      <h3 className="card-title mb-4">Still Have Questions?</h3>
                      <p className="card-text text-muted mb-4">
                        Can't find the answer you're looking for? Our expert team is here to help you with all your real estate needs.
                      </p>
                      <div className="d-flex flex-wrap justify-content-center gap-3">
                        <a href="/contact-us" className="btn btn-custom-primary btn-lg">
                          <i className="bi bi-telephone me-2"></i>
                          Contact Us
                        </a>
                        <a href="tel:+918886589000" className="btn btn-outline-custom-primary btn-lg">
                          <i className="bi bi-phone me-2"></i>
                          Call Now
                        </a>
                        <a href="mailto:sales@urbanesta.in" className="btn btn-outline-secondary btn-lg">
                          <i className="bi bi-envelope me-2"></i>
                          Email Us
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
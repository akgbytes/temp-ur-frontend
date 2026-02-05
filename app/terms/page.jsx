import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';

// Basic SEO metadata for terms page
export const metadata = {
  title: "Terms and Conditions | Urbanesta",
  description: "Read Urbanesta's terms and conditions for using our real estate platform and services.",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
        
        {/* Hero Section */}
        <section className="position-relative pt-5 pb-4 mt-5" style={{background: 'linear-gradient(to right, #0d6efd, #0a58ca)'}}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center text-white">
                <h1 className="display-4 fw-bold mb-4">
                  Terms and Conditions
                </h1>
                <p className="lead mb-3" style={{color: '#b6d4fe'}}>
                  Please read these terms carefully before using our services
                </p>
                <p className="small" style={{color: '#9ec5fe'}}>
                  Last updated: January 2024
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                
                {/* Introduction */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">1. Introduction</h2>
                  <p className="text-muted mb-3 lh-lg">
                    Welcome to Urbanesta (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms and Conditions (&quot;Terms&quot;) govern your use of our website, mobile application, and services (collectively, the &quot;Service&quot;) operated by Urbanesta Private Limited.
                  </p>
                  <p className="text-muted lh-lg">
                    By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
                  </p>
                </div>

                {/* Acceptance of Terms */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">2. Acceptance of Terms</h2>
                  <p className="text-muted mb-3 lh-lg">
                    By creating an account, accessing, or using Urbanesta&apos;s services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                  </p>
                  <p className="text-muted lh-lg">
                    We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through our platform. Continued use of our services after such modifications constitutes acceptance of the updated Terms.
                  </p>
                </div>

                {/* User Accounts */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">3. User Accounts</h2>
                  <div className="text-muted">
                    <p className="mb-2"><strong>3.1 Registration:</strong> To access certain features, you must create an account with accurate and complete information.</p>
                    <p className="mb-2"><strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                    <p className="mb-2"><strong>3.3 Eligibility:</strong> You must be at least 18 years old and legally capable of entering into contracts to use our services.</p>
                    <p className="mb-0"><strong>3.4 Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.</p>
                  </div>
                </div>

                {/* Property Listings */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">4. Property Listings and Services</h2>
                  <div className="text-muted">
                    <p className="mb-2"><strong>4.1 Listing Accuracy:</strong> Property listings must contain accurate, current, and complete information. False or misleading information is strictly prohibited.</p>
                    <p className="mb-2"><strong>4.2 Content Ownership:</strong> You retain ownership of content you submit but grant Urbanesta a license to use, display, and distribute such content on our platform.</p>
                    <p className="mb-2"><strong>4.3 Verification:</strong> While we strive to verify listings, we do not guarantee the accuracy of all information provided by third parties.</p>
                    <p className="mb-0"><strong>4.4 Fees:</strong> Certain services may require payment of fees. All applicable fees will be clearly disclosed before you incur any charges.</p>
                  </div>
                </div>

                {/* User Conduct */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">5. User Conduct</h2>
                  <p className="text-muted mb-3">You agree not to:</p>
                  <ul className="text-muted ps-4">
                    <li className="mb-1">Use the Service for any illegal or unauthorized purpose</li>
                    <li className="mb-1">Post false, misleading, or fraudulent information</li>
                    <li className="mb-1">Harass, abuse, or harm other users</li>
                    <li className="mb-1">Attempt to gain unauthorized access to our systems</li>
                    <li className="mb-1">Use automated tools to scrape or collect data from our platform</li>
                    <li className="mb-1">Interfere with or disrupt the Service or servers</li>
                    <li>Violate any applicable local, state, national, or international law</li>
                  </ul>
                </div>

                {/* Privacy and Data Protection */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">6. Privacy and Data Protection</h2>
                  <p className="text-muted mb-3 lh-lg">
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
                  </p>
                  <p className="text-muted lh-lg">
                    We implement appropriate security measures to protect your personal information and comply with applicable data protection laws, including GDPR where applicable.
                  </p>
                </div>

                {/* Intellectual Property */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">7. Intellectual Property Rights</h2>
                  <div className="text-muted">
                    <p className="mb-2"><strong>7.1 Our IP:</strong> The Service and its original content, features, and functionality are owned by Urbanesta and are protected by international copyright, trademark, and other intellectual property laws.</p>
                    <p className="mb-2"><strong>7.2 User Content:</strong> You retain rights to content you submit but grant us a non-exclusive, worldwide license to use such content in connection with our Service.</p>
                    <p className="mb-0"><strong>7.3 Restrictions:</strong> You may not reproduce, distribute, modify, or create derivative works of our content without explicit permission.</p>
                  </div>
                </div>

                {/* Disclaimers */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">8. Disclaimers</h2>
                  <div className="text-muted">
                    <p className="mb-2"><strong>8.1 Service Availability:</strong> We strive to maintain Service availability but do not guarantee uninterrupted access.</p>
                    <p className="mb-2"><strong>8.2 Third-Party Content:</strong> We are not responsible for the accuracy, completeness, or legality of user-generated content or third-party listings.</p>
                    <p className="mb-2"><strong>8.3 Investment Advice:</strong> Our Service provides information only and does not constitute financial, legal, or investment advice.</p>
                    <p className="mb-0"><strong>8.4 Market Conditions:</strong> Real estate markets fluctuate, and past performance does not guarantee future results.</p>
                  </div>
                </div>

                {/* Limitation of Liability */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">9. Limitation of Liability</h2>
                  <p className="text-muted mb-3 lh-lg">
                    To the maximum extent permitted by law, Urbanesta shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                  </p>
                  <p className="text-muted lh-lg">
                    Our total liability for any claims arising from or relating to these Terms shall not exceed the amount you paid to us in the twelve months preceding the claim.
                  </p>
                </div>

                {/* Indemnification */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">10. Indemnification</h2>
                  <p className="text-muted lh-lg">
                    You agree to defend, indemnify, and hold harmless Urbanesta and its officers, directors, employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these Terms.
                  </p>
                </div>

                {/* Termination */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">11. Termination</h2>
                  <div className="text-muted">
                    <p className="mb-2"><strong>11.1 By You:</strong> You may terminate your account at any time by contacting our support team.</p>
                    <p className="mb-2"><strong>11.2 By Us:</strong> We may terminate or suspend your account immediately for violations of these Terms or for any other reason at our discretion.</p>
                    <p className="mb-0"><strong>11.3 Effect:</strong> Upon termination, your right to use the Service ceases immediately, and we may delete your account and data.</p>
                  </div>
                </div>

                {/* Governing Law */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">12. Governing Law and Jurisdiction</h2>
                  <p className="text-muted lh-lg">
                    These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="mb-5">
                  <h2 className="h3 fw-bold text-dark mb-3">13. Contact Information</h2>
                  <p className="text-muted mb-3 lh-lg">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="bg-light p-4 rounded">
                    <p className="fw-bold mb-1">Urbanesta Private Limited</p>
                    <p className="mb-1">
                      Email: <a href="mailto:sales@urbanesta.in" className="text-decoration-none">sales@urbanesta.in</a> or <a href="mailto:support@urbanesta.in" className="text-decoration-none">support@urbanesta.in</a>
                    </p>
                    <p className="mb-1">Phone: <a href="tel:+918886589000" className="text-decoration-none">+91 88865 89000</a></p>
                    <p className="mb-0">Address: TOWER-B2, Spaze I-Tech Park, 1154, Gurugram, Haryana 122018, India</p>
                  </div>
                </div>

                {/* Updates Notice */}
                <div className="bg-info bg-opacity-10 p-4 rounded border border-info border-opacity-25">
                  <h3 className="h5 fw-semibold text-info mb-2">Important Notice</h3>
                  <p className="text-info mb-0 small">
                    These Terms and Conditions are effective as of January 2024. We recommend reviewing these terms periodically as they may be updated. Your continued use of our services constitutes acceptance of any changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
    </div>
  );
}
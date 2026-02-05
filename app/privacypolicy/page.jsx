import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';

// Basic SEO metadata for privacy policy page
export const metadata = {
  title: "Privacy Policy | Urbanesta",
  description: "Learn how Urbanesta protects and uses your personal information. Read our comprehensive privacy policy.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-5 pb-4 mt-5" style={{background: 'linear-gradient(to right, #2563eb, #1e40af)'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 text-center text-white">
              <h1 className="display-4 fw-bold mb-4">
                Privacy Policy
              </h1>
              <p className="lead text-light mb-3">
                Your privacy matters to us. Learn how we protect and use your information.
              </p>
              <p className="text-light opacity-75">
                Last updated: January 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              
              {/* Introduction */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">1. Introduction</h2>
                <p className="text-muted mb-3">
                  At Urbanesta Private Limited (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or engage with our services.
                </p>
                <p className="text-muted">
                  By using our services, you consent to the data practices described in this Privacy Policy. If you do not agree with the practices described here, please do not use our services.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">2. Information We Collect</h2>
                
                <h3 className="h4 fw-semibold text-dark mb-2">2.1 Personal Information</h3>
                <p className="text-muted mb-2">We may collect the following personal information:</p>
                <ul className="list-unstyled ms-4 mb-4">
                  <li className="text-muted mb-1">• Name, email address, and phone number</li>
                  <li className="text-muted mb-1">• Physical address and location data</li>
                  <li className="text-muted mb-1">• Date of birth and government-issued ID information</li>
                  <li className="text-muted mb-1">• Financial information (for loan processing and transactions)</li>
                  <li className="text-muted mb-1">• Property preferences and search history</li>
                  <li className="text-muted">• Communication records and support interactions</li>
                </ul>

                <h3 className="h4 fw-semibold text-dark mb-2">2.2 Technical Information</h3>
                <ul className="list-unstyled ms-4 mb-4">
                  <li className="text-muted mb-1">• IP address, browser type, and operating system</li>
                  <li className="text-muted mb-1">• Device identifiers and mobile network information</li>
                  <li className="text-muted mb-1">• Usage data, including pages visited and features used</li>
                  <li className="text-muted mb-1">• Cookies and similar tracking technologies</li>
                  <li className="text-muted">• Location data (with your permission)</li>
                </ul>

                <h3 className="h4 fw-semibold text-dark mb-2">2.3 Third-Party Information</h3>
                <p className="text-muted">
                  We may receive information about you from third parties such as social media platforms, payment processors, identity verification services, and our business partners.
                </p>
              </div>

              {/* How We Use Your Information */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">3. How We Use Your Information</h2>
                <p className="text-muted mb-2">We use your information for the following purposes:</p>
                
                <h3 className="h4 fw-semibold text-dark mb-2">3.1 Service Provision</h3>
                <ul className="list-unstyled ms-4 mb-4">
                  <li className="text-muted mb-1">• Create and manage your account</li>
                  <li className="text-muted mb-1">• Process property listings and transactions</li>
                  <li className="text-muted mb-1">• Facilitate communication between buyers, sellers, and agents</li>
                  <li className="text-muted mb-1">• Provide customer support and respond to inquiries</li>
                  <li className="text-muted">• Process payments and prevent fraud</li>
                </ul>

                <h3 className="h4 fw-semibold text-dark mb-2">3.2 Personalization and Improvement</h3>
                <ul className="list-unstyled ms-4 mb-4">
                  <li className="text-muted mb-1">• Personalize your experience and property recommendations</li>
                  <li className="text-muted mb-1">• Analyze usage patterns to improve our services</li>
                  <li className="text-muted mb-1">• Conduct research and development</li>
                  <li className="text-muted">• Perform analytics and generate insights</li>
                </ul>

                <h3 className="h4 fw-semibold text-dark mb-2">3.3 Communication and Marketing</h3>
                <ul className="list-unstyled ms-4">
                  <li className="text-muted mb-1">• Send you property alerts and notifications</li>
                  <li className="text-muted mb-1">• Provide promotional materials and marketing communications</li>
                  <li className="text-muted mb-1">• Send administrative and service-related messages</li>
                  <li className="text-muted">• Conduct surveys and collect feedback</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">4. Information Sharing and Disclosure</h2>
                
                <h3 className="h4 fw-semibold text-dark mb-2">4.1 With Your Consent</h3>
                <p className="text-muted mb-3">
                  We may share your information with third parties when you have given us explicit consent to do so.
                </p>

                <h3 className="h4 fw-semibold text-dark mb-2">4.2 Service Providers</h3>
                <p className="text-muted mb-3">
                  We work with trusted third-party service providers who assist us in operating our platform, processing payments, conducting business, or serving our users. These parties have access to personal information only as needed to perform their functions and are obligated to maintain confidentiality.
                </p>

                <h3 className="h4 fw-semibold text-dark mb-2">4.3 Legal Requirements</h3>
                <p className="text-muted mb-3">
                  We may disclose your information when required by law, court order, or government regulation, or when we believe disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.
                </p>

                <h3 className="h4 fw-semibold text-dark mb-2">4.4 Business Transfers</h3>
                <p className="text-muted">
                  If we are involved in a merger, acquisition, or asset sale, your personal information may be transferred. We will provide notice before your personal information is transferred and becomes subject to a different Privacy Policy.
                </p>
              </div>

              {/* Data Security */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">5. Data Security</h2>
                <p className="text-muted mb-3">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-unstyled ms-4 mb-3">
                  <li className="text-muted mb-1">• Encryption of data in transit and at rest</li>
                  <li className="text-muted mb-1">• Regular security assessments and penetration testing</li>
                  <li className="text-muted mb-1">• Access controls and authentication mechanisms</li>
                  <li className="text-muted mb-1">• Employee training on data protection and security</li>
                  <li className="text-muted">• Incident response and breach notification procedures</li>
                </ul>
                <p className="text-muted">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
                </p>
              </div>

              {/* Your Rights */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">6. Your Privacy Rights</h2>
                <p className="text-muted mb-3">You have the following rights regarding your personal information:</p>
                
                <div className="text-muted">
                  <p className="mb-2"><strong>6.1 Access:</strong> You can request access to the personal information we hold about you.</p>
                  <p className="mb-2"><strong>6.2 Correction:</strong> You can request that we correct any inaccurate or incomplete information.</p>
                  <p className="mb-2"><strong>6.3 Deletion:</strong> You can request that we delete your personal information, subject to certain exceptions.</p>
                  <p className="mb-2"><strong>6.4 Portability:</strong> You can request a copy of your personal information in a structured, machine-readable format.</p>
                  <p className="mb-2"><strong>6.5 Opt-Out:</strong> You can opt out of marketing communications at any time.</p>
                  <p className="mb-3"><strong>6.6 Objection:</strong> You can object to certain types of processing of your personal information.</p>
                </div>
                
                <p className="text-muted">
                  To exercise any of these rights, please contact us using the information provided at the end of this policy.
                </p>
              </div>

              {/* Cookies and Tracking */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">7. Cookies and Tracking Technologies</h2>
                <p className="text-muted mb-3">
                  We use cookies, web beacons, and similar tracking technologies to enhance your experience on our platform. These technologies help us:
                </p>
                <ul className="list-unstyled ms-4 mb-3">
                  <li className="text-muted mb-1">• Remember your preferences and settings</li>
                  <li className="text-muted mb-1">• Analyze how you use our services</li>
                  <li className="text-muted mb-1">• Provide personalized content and advertisements</li>
                  <li className="text-muted">• Improve our services and user experience</li>
                </ul>
                <p className="text-muted">
                  You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our services.
                </p>
              </div>

              {/* Third-Party Links */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">8. Third-Party Links and Services</h2>
                <p className="text-muted">
                  Our services may contain links to third-party websites, applications, or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to read the privacy policies of any third-party services you visit or use.
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">9. Children's Privacy</h2>
                <p className="text-muted">
                  Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.
                </p>
              </div>

              {/* Data Retention */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">10. Data Retention</h2>
                <p className="text-muted">
                  We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your personal information, we will securely delete or anonymize it.
                </p>
              </div>

              {/* International Transfers */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">11. International Data Transfers</h2>
                <p className="text-muted">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place to protect your information.
                </p>
              </div>

              {/* Changes to Privacy Policy */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">12. Changes to This Privacy Policy</h2>
                <p className="text-muted">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the &quot;Last Updated&quot; date. We encourage you to review this Privacy Policy periodically.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-3">13. Contact Information</h2>
                <p className="text-muted mb-3">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-light p-4 rounded">
                  <p className="text-dark mb-1"><strong>Urbanesta Private Limited</strong></p>
                  <p className="text-muted mb-1"><strong>Data Protection Officer</strong></p>
                  <p className="text-muted mb-1">
                    Email: <a href="mailto:sales@urbanesta.in" className="text-decoration-none">sales@urbanesta.in</a> or <a href="mailto:support@urbanesta.in" className="text-decoration-none">support@urbanesta.in</a>
                  </p>
                  <p className="text-muted mb-1">Phone: <a href="tel:+918886589000" className="text-decoration-none">+91 88865 89000</a></p>
                  <p className="text-muted">Address: TOWER-B2, Spaze I-Tech Park, 1154, Gurugram, Haryana 122018, India</p>
                </div>
              </div>

              {/* Effective Date Notice */}
              <div className="bg-info bg-opacity-10 p-4 rounded">
                <h3 className="h5 fw-semibold text-info mb-2">Effective Date</h3>
                <p className="text-info mb-0">
                  This Privacy Policy is effective as of January 2024. By continuing to use our services after any changes to this Privacy Policy, you acknowledge that you have read and agree to the updated terms.
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
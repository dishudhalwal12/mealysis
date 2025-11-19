// PrivacyPolicyPage.js
import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Privacy Policy</h1>
      <div className="privacy-content">
        <p className="effective-date">Effective Date: January 1, 2025</p>

        <section className="privacy-section">
          <h2>1. Introduction</h2>
          <p>
            Quick Compare ("we", "our", or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you use our website quickcompare.in and our services.
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. Information We Collect</h2>
          <div className="info-types">
            <h3>Personal Information</h3>
            <ul>
              <li>Device location data (with your consent)</li>
              <li>Device information and identifiers</li>
              <li>Usage data and analytics</li>
            </ul>
            
            <h3>Non-Personal Information</h3>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address (anonymized)</li>
              <li>Pages visited and time spent</li>
            </ul>
          </div>
        </section>

        <section className="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain our comparison services</li>
            <li>To personalize your experience and show relevant products</li>
            <li>To improve our platform and user experience</li>
            <li>To provide customer support and respond to inquiries</li>
            <li>To send important updates about our services</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>4. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. 
            We may share information in the following circumstances:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>To comply with legal requirements</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With service providers who assist in our operations</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect 
            your personal information against unauthorized access, alteration, disclosure, or 
            destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="privacy-section">
          <h2>6. Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the 
            purposes outlined in this policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section className="privacy-section">
          <h2>7. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for data processing</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>8. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage, 
            and provide personalized content. You can control cookie settings through your browser.
          </p>
        </section>

        <section className="privacy-section">
          <h2>9. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites. We are not responsible for 
            the privacy practices of these external sites. Please review their privacy policies.
          </p>
        </section>

        <section className="privacy-section">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any 
            material changes by posting the new policy on our website and updating the effective date.
          </p>
        </section>

        <section className="privacy-section">
          <h2>11. Contact Information</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
            <br />
            Email: connect@quickcompare.in
            <br />
            <a href='https://quickcompare.in'>Website: https://quickcompare.in</a>
          </p>
        </section>
      </div>
    </div>
  );
};

// Styles
const styles = `
.privacy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.privacy-title {
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.privacy-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.effective-date {
  color: #666;
  font-style: italic;
  margin-bottom: 2rem;
}

.privacy-section {
  margin-bottom: 2rem;
}

.privacy-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
}

.privacy-section h3 {
  color: #34495e;
  margin: 1rem 0;
}

.privacy-section ul {
  padding-left: 1.5rem;
}

.privacy-section li {
  margin-bottom: 0.5rem;
}

.info-types {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .privacy-container {
    padding: 1rem;
  }
  
  .privacy-title {
    font-size: 2rem;
  }
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default PrivacyPolicyPage;

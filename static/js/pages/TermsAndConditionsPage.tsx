import React from 'react';

const TermsAndConditionsPage = () => {
  return (
    <div className="terms-container">
      <h1 className="terms-title">Terms and Conditions</h1>
      <div className="terms-content">
        <p className="effective-date">Effective Date: January 1, 2025</p>

        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Quick Compare ("we", "our", or "us") services, including our website 
            quickcompare.in, you agree to be bound by these Terms and Conditions. If you do not agree 
            to these terms, please do not use our services.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Service Description</h2>
          <p>
            Quick Compare provides a platform for comparing products and services across different 
            marketplaces. Our service aggregates information from various sources to help users make 
            informed purchasing decisions.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. User Responsibilities</h2>
          <ul>
            <li>You must provide accurate and complete information when using our services</li>
            <li>You are responsible for maintaining the confidentiality of your account information</li>
            <li>You agree not to use our services for any unlawful purpose</li>
            <li>You must not attempt to gain unauthorized access to our systems</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. Intellectual Property</h2>
          <p>
            All content, features, and functionality on our website, including but not limited to text, 
            graphics, logos, and software, are owned by Quick Compare and are protected by copyright, 
            trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            Quick Compare shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages arising out of or relating to your use of our services. Our total 
            liability shall not exceed the amount paid by you, if any, for accessing our services.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Disclaimers</h2>
          <p>
            Our services are provided "as is" without warranties of any kind. We do not guarantee 
            the accuracy, completeness, or reliability of any information provided through our platform.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective 
            immediately upon posting on our website. Your continued use of our services constitutes 
            acceptance of the modified terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. 
            Any disputes arising from these terms shall be subject to the exclusive jurisdiction 
            of the courts in India.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
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
.terms-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.terms-title {
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.terms-content {
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

.terms-section {
  margin-bottom: 2rem;
}

.terms-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
}

.terms-section ul {
  padding-left: 1.5rem;
}

.terms-section li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .terms-container {
    padding: 1rem;
  }
  
  .terms-title {
    font-size: 2rem;
  }
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default TermsAndConditionsPage; 
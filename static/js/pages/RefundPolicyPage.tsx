import React from 'react';

const RefundPolicyPage = () => {
  return (
    <div className="refund-container">
      <h1 className="refund-title">Refund Policy</h1>
      <div className="refund-content">
        <p className="effective-date">Effective Date: January 1, 2025</p>

        <section className="refund-section">
          <h2>1. Overview</h2>
          <p>
            Quick Compare ("we", "our", or "us") is committed to providing excellent service to our users. 
            This Refund Policy outlines the terms and conditions for refunds related to our services.
          </p>
        </section>

        <section className="refund-section">
          <h2>2. Service Nature</h2>
          <p>
            Quick Compare provides a free comparison platform that aggregates product and service 
            information from various marketplaces. Our core services are provided at no cost to users.
          </p>
        </section>

        <section className="refund-section">
          <h2>3. Refund Eligibility</h2>
          <div className="refund-types">
            <h3>Free Services</h3>
            <p>
              Since our primary services are free, no refunds are applicable for basic platform usage.
            </p>
            
            <h3>Premium Services (if applicable)</h3>
            <p>
              For any premium or paid services that may be introduced in the future:
            </p>
            <ul>
              <li>Refund requests must be submitted within 30 days of purchase</li>
              <li>Valid reasons for refund include service unavailability or technical issues</li>
              <li>Refunds will be processed within 5-7 business days</li>
            </ul>
          </div>
        </section>

        <section className="refund-section">
          <h2>4. Third-Party Purchases</h2>
          <p>
            Quick Compare acts as a comparison platform and does not process payments or handle 
            refunds for purchases made on third-party marketplaces. For refunds related to products 
            or services purchased through external platforms, please contact the respective marketplace 
            directly.
          </p>
        </section>

        <section className="refund-section">
          <h2>5. Refund Process</h2>
          <p>
            To request a refund for any applicable paid services:
          </p>
          <ol>
            <li>Contact our support team at connect@quickcompare.in</li>
            <li>Provide your account details and reason for refund</li>
            <li>Include any relevant transaction information</li>
            <li>Our team will review your request within 3-5 business days</li>
          </ol>
        </section>

        <section className="refund-section">
          <h2>6. Refund Methods</h2>
          <p>
            Approved refunds will be processed using the original payment method. Processing times 
            may vary depending on your payment provider:
          </p>
          <ul>
            <li>Credit/Debit Cards: 5-10 business days</li>
            <li>Digital Wallets: 3-5 business days</li>
            <li>Bank Transfers: 7-14 business days</li>
          </ul>
        </section>

        <section className="refund-section">
          <h2>7. Exceptions</h2>
          <p>
            Refunds may be denied in the following circumstances:
          </p>
          <ul>
            <li>Fraudulent activity or abuse of our services</li>
            <li>Violation of our Terms and Conditions</li>
            <li>Requests made after the 30-day refund period</li>
            <li>Services that have been fully utilized or consumed</li>
          </ul>
        </section>

        <section className="refund-section">
          <h2>8. Contact Information</h2>
          <p>
            For questions about our refund policy or to request a refund, please contact us at:
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
.refund-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.refund-title {
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.refund-content {
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

.refund-section {
  margin-bottom: 2rem;
}

.refund-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
}

.refund-section h3 {
  color: #34495e;
  margin: 1rem 0;
}

.refund-section ul, .refund-section ol {
  padding-left: 1.5rem;
}

.refund-section li {
  margin-bottom: 0.5rem;
}

.refund-types {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .refund-container {
    padding: 1rem;
  }
  
  .refund-title {
    font-size: 2rem;
  }
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default RefundPolicyPage; 
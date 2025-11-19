import React from 'react';

const styles = {
  contactContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center',
  },
  contactInfo: {
    backgroundColor: '#f8f9fa',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  contactDetails: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  link: {
    color: '#0066cc',
    textDecoration: 'none',
    fontSize: '1.1rem',
  },
  icon: {
    color: '#0066cc',
    fontSize: '1.5rem',
  },
  text: {
    color: '#444',
    fontSize: '1.1rem',
  }
};

const SupportPage = () => {
  return (
    <div style={styles.contactContainer}>
      <h1>Contact Us</h1>
      
      <div style={styles.contactInfo}>
        <h2>Get in Touch</h2>
        <p>We'd love to hear from you. Please reach out to us at:</p>
        
        <div style={styles.contactDetails}>
          <div style={styles.contactItem}>
            <i className="fas fa-envelope" style={styles.icon}></i>
            <a href="mailto:connect@quickcompare.in" style={styles.link}>
            connect@quickcompare.in
            </a>
          </div>          
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

// Crea src/components/FloatingButtons.jsx
import React from 'react';

const FloatingButtons = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
      <a 
        href="/landings/leads-premium.html" 
        style={{
          background: '#25D366',
          color: 'white',
          padding: '12px 15px',
          borderRadius: '30px',
          textDecoration: 'none',
          boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        💰 LEADS
      </a>
      <a 
        href="/landings/oportunidad-negocio.html" 
        style={{
          background: '#4361ee',
          color: 'white',
          padding: '12px 15px',
          borderRadius: '30px',
          textDecoration: 'none',
          boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
        }}
      >
        💼 OPORTUNIDAD
      </a>
    </div>
  );
};

export default FloatingButtons;
href="https://andalusiasuperpatch.github.io/lead-flow-bot/landings/leads-premium.html"

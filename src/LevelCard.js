import React from 'react';


const LevelCard = ({ level }) => {
  return (
    <div className="chunk-card" style={{
      background: 'white',
      padding: '15px',
      borderRadius: '20px',
      marginBottom: '10px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      borderLeft: '5px solid #6c5ce7',
      transition: 'transform 0.2s'
    }}>
      <div style={{ fontSize: '2.5rem' }}>{level.icon}</div>
      <div style={{ textAlign: 'left', flex: 1 }}>
        <h3 style={{ margin: '0 0 5px 0', color: '#2d3436' }}>{level.title}</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#636e72' }}>
          Target: <strong style={{ color: '#6c5ce7' }}>{level.target}</strong>
        </p>
        <div style={{
          marginTop: '5px',
          fontSize: '0.8rem',
          background: '#dfe6e9',
          color: '#2d3436',
          padding: '4px 8px',
          borderRadius: '8px',
          display: 'inline-block'
        }}>
          Hint: {level.hint}
        </div>
      </div>
    </div>
  );
};

export default LevelCard;

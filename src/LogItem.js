import React from 'react';

// CONCEPT: Stateless Component / Function Component
// This component only receives props and returns JSX. It has no internal state.
const LogItem = ({ log }) => {
    return (
        <div className="log-item" style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '8px',
            color: '#fff',
            textAlign: 'left'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {log.gesture} <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>({log.timestamp})</span>
            </div>
            <div>Rating: {'⭐'.repeat(log.rating)}</div>
            <div style={{ fontStyle: 'italic', marginTop: '5px' }}>"{log.notes}"</div>
        </div>
    );
};

export default LogItem;

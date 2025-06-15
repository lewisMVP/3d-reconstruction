import React, { useState, useEffect } from 'react';

const ServerStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000
        });
        
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error('Health check failed:', error);
        setStatus({ 
          status: 'offline', 
          error: error.message || 'Cannot connect',
          midas_loaded: false,
          clip_loaded: false
        });
      } finally {
        setLoading(false);
      }
    };

    // Check immediately
    checkStatus();
    
    // Check every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        fontSize: '0.875rem',
        color: '#f59e0b'
      }}>
        <div style={{
          width: '1rem',
          height: '1rem',
          border: '2px solid #fef3c7',
          borderTop: '2px solid #f59e0b',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        Checking server...
      </div>
    );
  }

  if (!status || status.status === 'offline') {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        fontSize: '0.875rem',
        color: '#dc2626'
      }}>
        <div style={{
          width: '0.5rem',
          height: '0.5rem',
          backgroundColor: '#dc2626',
          borderRadius: '50%'
        }}></div>
        Server Offline - Start backend on port 5000
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem',
      fontSize: '0.875rem'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        color: '#059669'
      }}>
        <div style={{
          width: '0.5rem',
          height: '0.5rem',
          backgroundColor: '#10b981',
          borderRadius: '50%'
        }}></div>
        Server Status: Online
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        color: '#6b7280'
      }}>
        Models: 
        <span style={{ 
          color: status.midas_loaded ? '#059669' : '#dc2626',
          fontWeight: '500'
        }}>
          {status.midas_loaded ? '✅' : '❌'} nerf
        </span>
        <span style={{ 
          color: status.clip_loaded ? '#059669' : '#dc2626',
          fontWeight: '500'
        }}>
          {status.clip_loaded ? '✅' : '❌'} gaussian_splatting
        </span>
      </div>
    </div>
  );
};

export default ServerStatus;
import React, { useState } from 'react';
import ReconstructionViewer from './components/ReconstructionViewer';
import ServerStatus from './components/ServerStatus';
import PerformanceMetrics from './components/PerformanceMetrics';
import axios from 'axios';
import './index.css';

function App() {
  const [selectedModel, setSelectedModel] = useState('both');
  const [images, setImages] = useState([]);
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
    setError('');
    console.log(`📸 Selected ${files.length} images`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      setImages(files);
      setError('');
      console.log(`📸 Dropped ${files.length} images`);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleReconstruct = async () => {
    if (images.length === 0) {
      setError('Please select at least 1 image!');
      return;
    }

    setLoading(true);
    setError('');
    setModelData(null);

    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    formData.append('model_type', selectedModel);

    try {
      console.log('🚀 Starting reconstruction...');
      
      const response = await axios.post('http://localhost:5000/reconstruct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      if (response.data.success) {
        setModelData(response.data.data);
        console.log('🎯 Point cloud data set!');
      } else {
        setError(response.data.error || 'Reconstruction failed!');
      }
    } catch (err) {
      console.error('❌ Request failed:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout - Server took too long!');
      } else if (err.response) {
        setError(`Server error: ${err.response.data?.error || err.response.statusText}`);
      } else {
        setError('Cannot connect to server! Check backend is running on port 5000');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearImages = () => {
    setImages([]);
    setError('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 0'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#1a202c',
              margin: 0
            }}>
              3D Reconstruction Studio
            </h1>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#718096',
              margin: '0.25rem 0 0 0'
            }}>
              Transform your images into stunning 3D models
            </p>
          </div>
          
          <ServerStatus />
        </div>
      </div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '2rem',
        minHeight: 'calc(100vh - 120px)'
      }}>
        {/* Left Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Model Selection */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#2d3748'
            }}>
              Model Selection
            </h3>
            
            <div style={{ 
              backgroundColor: '#e6fffa', 
              border: '1px solid #81e6d9',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#2c7a7b'
            }}>
              Available models: nerf, gaussian_splatting
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.75rem',
                border: '2px solid',
                borderColor: selectedModel === 'both' ? '#3182ce' : '#e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedModel === 'both' ? '#ebf8ff' : 'white'
              }}>
                <input
                  type="radio"
                  name="model"
                  value="both"
                  checked={selectedModel === 'both'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  style={{ marginRight: '0.75rem' }}
                />
                <div>
                  <div style={{ fontWeight: '600', color: '#2d3748' }}>🔥 Both Models (Compare)</div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                    Run both NeRF and Gaussian Splatting
                  </div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.75rem',
                border: '2px solid',
                borderColor: selectedModel === 'nerf' ? '#3182ce' : '#e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedModel === 'nerf' ? '#ebf8ff' : 'white'
              }}>
                <input
                  type="radio"
                  name="model"
                  value="nerf"
                  checked={selectedModel === 'nerf'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  style={{ marginRight: '0.75rem' }}
                />
                <div>
                  <div style={{ fontWeight: '600', color: '#2d3748' }}>🧠 NeRF Only</div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                    Neural Radiance Fields
                  </div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.75rem',
                border: '2px solid',
                borderColor: selectedModel === 'gaussian_splatting' ? '#3182ce' : '#e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedModel === 'gaussian_splatting' ? '#ebf8ff' : 'white'
              }}>
                <input
                  type="radio"
                  name="model"
                  value="gaussian_splatting"
                  checked={selectedModel === 'gaussian_splatting'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  style={{ marginRight: '0.75rem' }}
                />
                <div>
                  <div style={{ fontWeight: '600', color: '#2d3748' }}>✨ Gaussian Splatting Only</div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                    3D Gaussian Splatting
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Upload Images */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#2d3748'
            }}>
              Upload Images
            </h3>

            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                border: '2px dashed',
                borderColor: dragOver ? '#3182ce' : '#cbd5e0',
                borderRadius: '8px',
                padding: '3rem 1rem',
                textAlign: 'center',
                backgroundColor: dragOver ? '#ebf8ff' : '#f7fafc',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '1rem'
              }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⬆️</div>
              <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                Drop images here or click to browse
              </div>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                Support for JPG, PNG, HEIC
              </div>
            </div>

            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />

            {/* Selected Images */}
            {images.length > 0 && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#2d3748' }}>
                    {images.length} images selected
                  </span>
                  <button
                    onClick={clearImages}
                    style={{
                      fontSize: '0.875rem',
                      color: '#e53e3e',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Clear
                  </button>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  gap: '0.5rem',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {images.slice(0, 12).map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  ))}
                  {images.length > 12 && (
                    <div style={{
                      width: '100%',
                      height: '60px',
                      backgroundColor: '#f7fafc',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      color: '#718096'
                    }}>
                      +{images.length - 12} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reconstruct Button */}
            <button
              onClick={handleReconstruct}
              disabled={loading || images.length === 0}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: loading || images.length === 0 ? '#a0aec0' : '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading || images.length === 0 ? 'not-allowed' : 'pointer',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Reconstructing...
                </>
              ) : (
                <>🚀 Start Reconstruction</>
              )}
            </button>

            {error && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fed7d7',
                border: '1px solid #feb2b2',
                borderRadius: '6px',
                color: '#c53030',
                fontSize: '0.875rem'
              }}>
                ❌ {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - 3D Viewer */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            padding: '1.5rem 1.5rem 0 1.5rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              margin: 0,
              color: '#2d3748'
            }}>
              3D Reconstruction
            </h3>
          </div>

          <div style={{ flex: 1, minHeight: '500px' }}>
            <ReconstructionViewer pointCloud={modelData} />
          </div>
        </div>
      </div>

      {/* Performance Metrics - KHÔNG BỊ CHE */}
      {modelData && (
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 2rem 2rem 2rem'
        }}>
          <PerformanceMetrics results={modelData} />
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '400px',
            margin: '1rem'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #3182ce',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Rendering 3D Model...</h4>
            <p style={{ color: '#718096', fontSize: '0.875rem' }}>
              Processing {images.length} images with {selectedModel === 'both' ? 'both models' : selectedModel}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
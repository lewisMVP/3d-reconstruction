import { useState, useEffect } from 'react';
import ReconstructionViewer from './components/ReconstructionViewer';
import ServerStatus from './components/ServerStatus';
import ModelSelector from './components/ModelSelector';
import PerformanceMetrics from './components/PerformanceMetrics';
import axios from 'axios';
import './index.css';

function App() {
  const [modelData, setModelData] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedModelType, setSelectedModelType] = useState('both');
  const [serverStatus, setServerStatus] = useState(null);

  // Check server status on mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/health');
      setServerStatus(response.data);
    } catch (error) {
      console.error('Server not available:', error);
      setServerStatus({ status: 'offline' });
    }
  };

  const handleFileUpload = async (event) => {
    setLoading(true);
    const files = Array.from(event.target.files);
    
    if (files.length === 0) {
      setLoading(false);
      return;
    }

    // Create image previews
    const imagePreviews = files.map(file => URL.createObjectURL(file));
    setUploadedImages(imagePreviews);

    // Prepare form data
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('model_type', selectedModelType);

    try {
      console.log(`Uploading ${files.length} images with model type: ${selectedModelType}`);
      
      const response = await axios.post('http://localhost:5000/reconstruct', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60 second timeout
      });

      console.log('Response received:', response.data);

      if (response.data.success) {
        setModelData(response.data.data);
        setMetrics(response.data.metrics || {});
        console.log('Model data set:', response.data.data);
        console.log('Metrics set:', response.data.metrics);
      } else {
        console.error('Server error:', response.data.error);
        alert('Error: ' + (response.data.error || 'Unknown error'));
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setModelData(null);
    setMetrics({});
    setUploadedImages([]);
    // Clear preview URLs to prevent memory leaks
    uploadedImages.forEach(url => URL.revokeObjectURL(url));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">3D Reconstruction Studio</h1>
              <p className="text-sm text-gray-600 mt-1">Transform your images into stunning 3D models</p>
            </div>
            <ServerStatus status={serverStatus} onRefresh={checkServerStatus} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Model Selection */}
            <ModelSelector 
              selectedType={selectedModelType}
              onTypeChange={setSelectedModelType}
              availableModels={serverStatus?.available_models || []}
            />

            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Images</h2>
              
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={loading}
                />
                <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  loading 
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/50'
                }`}>
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 font-medium">
                    {loading ? 'Processing...' : 'Drop images here or click to browse'}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">Support for JPG, PNG, HEIC</p>
                </div>
              </label>

              {/* Image previews */}
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">{uploadedImages.length} images selected</p>
                    <button
                      onClick={clearData}
                      className="text-sm text-red-600 hover:text-red-700"
                      disabled={loading}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedImages.slice(0, 8).map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt={`Preview ${idx + 1}`} 
                        className="w-full h-20 object-cover rounded-lg border border-gray-200" 
                      />
                    ))}
                    {uploadedImages.length > 8 && (
                      <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm border border-gray-200">
                        +{uploadedImages.length - 8} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <PerformanceMetrics metrics={metrics} />

          </div>

          {/* Right Panel - 3D Viewer */}
          <div className="lg:col-span-3 h-[600px]">
            <ReconstructionViewer pointCloud={modelData} />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-900 font-medium text-lg text-center">Processing images...</p>
            <p className="text-gray-500 text-sm mt-2 text-center">This may take a few moments</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
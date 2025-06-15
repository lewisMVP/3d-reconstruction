import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function ReconstructionViewer({ pointCloud }) {
  const pointsRef = useRef();
  const [selectedModel, setSelectedModel] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [pointSize, setPointSize] = useState(0.03);
  const [renderStats, setRenderStats] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update available models when pointCloud changes
  useEffect(() => {
    if (pointCloud) {
      const models = Object.keys(pointCloud);
      setAvailableModels(models);
      
      // Auto-select first available model
      if (models.length > 0) {
        if (models.includes('gaussian_splatting')) {
          setSelectedModel('gaussian_splatting');
        } else if (models.includes('nerf')) {
          setSelectedModel('nerf');
        } else {
          setSelectedModel(models[0]);
        }
      }
    } else {
      setAvailableModels([]);
      setSelectedModel(null);
      setRenderStats(null);
    }
  }, [pointCloud]);

  // Update 3D geometry when model selection changes - OPTIMIZED
  useEffect(() => {
    if (!pointCloud || !selectedModel || !pointCloud[selectedModel] || !pointsRef.current) {
      return;
    }

    setLoading(true);
    
    // Use setTimeout to prevent blocking UI
    setTimeout(() => {
      try {
        const modelData = pointCloud[selectedModel];
        
        // Quick validation
        if (!modelData.pointCloud || modelData.pointCloud.length === 0) {
          setRenderStats({ error: 'No point cloud data' });
          setLoading(false);
          return;
        }

        if (modelData.pointCloud.length % 3 !== 0) {
          setRenderStats({ error: `Invalid data length: ${modelData.pointCloud.length}` });
          setLoading(false);
          return;
        }

        const numPoints = modelData.pointCloud.length / 3;
        
        // Create geometry efficiently
        const positions = new Float32Array(modelData.pointCloud);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Simple color handling
        let colors;
        if (modelData.colors && modelData.colors.length === numPoints * 3) {
          colors = new Float32Array(modelData.colors);
        } else {
          // Simple default colors - blue gradient
          colors = new Float32Array(numPoints * 3);
          for (let i = 0; i < numPoints; i++) {
            const intensity = 0.5 + 0.5 * (i / numPoints);
            const idx = i * 3;
            colors[idx] = 0.2 * intensity;     // R
            colors[idx + 1] = 0.5 * intensity; // G
            colors[idx + 2] = intensity;       // B
          }
        }
        
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Simple centering without complex calculations
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);

        // Update mesh
        if (pointsRef.current.geometry) {
          pointsRef.current.geometry.dispose();
        }
        pointsRef.current.geometry = geometry;

        // Set point size based on count
        const adaptiveSize = numPoints > 3000 ? 0.02 : numPoints > 1000 ? 0.03 : 0.05;
        setPointSize(adaptiveSize);
        
        setRenderStats({ 
          points: numPoints, 
          colors: colors.length / 3
        });

        setLoading(false);

      } catch (error) {
        console.error('Error rendering point cloud:', error);
        setRenderStats({ error: error.message });
        setLoading(false);
      }
    }, 100); // Small delay to prevent blocking

  }, [pointCloud, selectedModel]);

  const PointCloudMesh = () => (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={pointSize}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={false}
        opacity={1.0}
      />
    </points>
  );

  return (
    <div className="relative w-full h-full bg-gray-800 rounded-3xl overflow-hidden">
      
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-white text-lg font-medium">3D Reconstruction</h3>
        <p className="text-gray-300 text-sm mt-1">
          {renderStats ? (
            renderStats.error ? (
              <span className="text-red-400">❌ {renderStats.error}</span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                {renderStats.points.toLocaleString()} points
              </span>
            )
          ) : (
            pointCloud ? (
              loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                  Rendering...
                </span>
              ) : (
                'Processing...'
              )
            ) : (
              'Upload images to start'
            )
          )}
        </p>
        
        {/* Model Badge */}
        {selectedModel && (
          <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-black/40 rounded-lg text-xs">
            <span className={`w-2 h-2 rounded-full ${
              selectedModel === 'gaussian_splatting' ? 'bg-blue-400' : 'bg-green-400'
            }`}></span>
            <span className="text-white">
              {selectedModel === 'gaussian_splatting' ? 'Gaussian Splatting' : selectedModel.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Simple Controls */}
      {pointCloud && renderStats && !renderStats.error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 flex items-center gap-4">
            
            {/* Model Selector */}
            {availableModels.length > 1 && (
              <div className="flex gap-2">
                {availableModels.map((model) => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      selectedModel === model
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                  >
                    {model === 'gaussian_splatting' ? 'GS' : model.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            
            {/* Point Size */}
            <div className="flex items-center gap-2 text-white text-sm">
              <span>Size:</span>
              <input
                type="range"
                min="0.01"
                max="0.1"
                step="0.01"
                value={pointSize}
                onChange={(e) => setPointSize(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gray-600 rounded"
              />
            </div>

            {/* Auto Rotate */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                autoRotate 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              {autoRotate ? '⏸' : '▶'}
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas - Simplified */}
      <Canvas 
        camera={{ 
          position: [3, 3, 3], 
          fov: 60
        }}
        style={{ background: 'transparent' }}
      >
        {/* Simple lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        
        {/* Point Cloud */}
        {pointCloud && selectedModel && renderStats && !renderStats.error && !loading && (
          <PointCloudMesh />
        )}
        
        {/* OrbitControls - Simplified */}
        <OrbitControls 
          enableDamping
          dampingFactor={0.1}
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
          minDistance={1}
          maxDistance={20}
        />
      </Canvas>

      {/* Empty State */}
      {!pointCloud && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400 max-w-sm mx-auto p-6">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">Ready for 3D Reconstruction</h3>
            <p className="text-gray-500">
              Upload your images to create 3D models
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(loading || (pointCloud && !renderStats)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Rendering 3D Model...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReconstructionViewer;
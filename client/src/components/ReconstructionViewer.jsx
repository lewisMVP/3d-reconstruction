import React, { useRef, useEffect, useState } from 'react';

const ReconstructionViewer = ({ pointCloud }) => {
  const canvasRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState('nerf');
  const [camera, setCamera] = useState({
    rotationX: 0,
    rotationY: 0,
    zoom: 80,
    panX: 0,
    panY: 0
  });
  
  const mouseRef = useRef({
    isDown: false,
    button: 0,
    lastX: 0,
    lastY: 0
  });
  
  const animationRef = useRef(null);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    mouseRef.current.isDown = true;
    mouseRef.current.button = e.button;
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
    e.target.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!mouseRef.current.isDown) return;

    const deltaX = e.clientX - mouseRef.current.lastX;
    const deltaY = e.clientY - mouseRef.current.lastY;

    if (mouseRef.current.button === 0) {
      // Left mouse - rotate
      setCamera(prev => ({
        ...prev,
        rotationY: prev.rotationY + deltaX * 0.01,
        rotationX: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.rotationX + deltaY * 0.01))
      }));
    } else if (mouseRef.current.button === 2) {
      // Right mouse - pan
      setCamera(prev => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY
      }));
    }

    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
  };

  const handleMouseUp = (e) => {
    mouseRef.current.isDown = false;
    e.target.style.cursor = 'grab';
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(10, Math.min(200, prev.zoom * zoomFactor))
    }));
  };

  // Render loop
  useEffect(() => {
    if (!pointCloud || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2 + camera.panX;
      const centerY = canvas.height / 2 + camera.panY;

      // Draw selected model
      const modelData = pointCloud[selectedModel];
      if (modelData && modelData.pointCloud && modelData.pointCloud.length > 0) {
        drawPointCloud(ctx, modelData, centerX, centerY, camera.zoom, camera.rotationX, camera.rotationY);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pointCloud, selectedModel, camera]);

  const drawPointCloud = (ctx, modelData, centerX, centerY, scale, rotX, rotY) => {
    const points = modelData.pointCloud;
    const colors = modelData.colors;
    
    // Create point array with depth for z-sorting
    const transformedPoints = [];
    
    for (let i = 0; i < points.length; i += 30) { // Skip points for performance
      const x = points[i];
      const y = points[i + 1];
      const z = points[i + 2];

      // 3D transformations
      // Rotate around Y axis
      let rotatedX = x * Math.cos(rotY) - z * Math.sin(rotY);
      let rotatedZ = x * Math.sin(rotY) + z * Math.cos(rotY);
      
      // Rotate around X axis
      const rotatedY = y * Math.cos(rotX) - rotatedZ * Math.sin(rotX);
      rotatedZ = y * Math.sin(rotX) + rotatedZ * Math.cos(rotX);

      // Project to 2D
      const screenX = centerX + rotatedX * scale;
      const screenY = centerY - rotatedY * scale;

      // Skip if out of bounds
      if (screenX < -50 || screenX > canvasRef.current.width + 50 || 
          screenY < -50 || screenY > canvasRef.current.height + 50) continue;

      // Get color
      let color = selectedModel === 'nerf' ? '#4F46E5' : '#10B981';
      
      if (colors && colors.length > i + 2) {
        const r = Math.floor(Math.max(0, Math.min(1, colors[i])) * 255);
        const g = Math.floor(Math.max(0, Math.min(1, colors[i + 1])) * 255);
        const b = Math.floor(Math.max(0, Math.min(1, colors[i + 2])) * 255);
        color = `rgb(${r}, ${g}, ${b})`;
      }

      transformedPoints.push({
        x: screenX,
        y: screenY,
        z: rotatedZ,
        color: color
      });
    }

    // Sort by depth (z) for correct rendering
    transformedPoints.sort((a, b) => b.z - a.z);

    // Draw points
    transformedPoints.forEach(point => {
      // Point size based on depth
      const pointSize = Math.max(1, 3 - point.z * 0.3);
      
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  if (!pointCloud) {
    return (
      <div style={{ 
        width: '100%', 
        height: '600px', 
        backgroundColor: '#1a1a1a', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
          <p>Upload images để xem 3D reconstruction</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
            Left drag: Rotate | Right drag: Pan | Scroll: Zoom
          </p>
        </div>
      </div>
    );
  }

  const availableModels = Object.keys(pointCloud);
  const currentModel = pointCloud[selectedModel];

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      {/* Canvas with mouse controls */}
      <canvas
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          cursor: 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()} // Disable right-click menu
      />

      {/* Model Selector */}
      {availableModels.length > 1 && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Model:</div>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              width: '100%',
              padding: '0.25rem',
              backgroundColor: '#333',
              color: 'white',
              border: '1px solid #555',
              borderRadius: '4px'
            }}
          >
            {availableModels.map(model => (
              <option key={model} value={model}>
                {model === 'nerf' ? '🧠 NeRF (MiDaS)' : 
                 model === 'gaussian_splatting' ? '✨ Gaussian Splatting' : 
                 model}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stats */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '0.75rem',
        borderRadius: '8px',
        fontSize: '0.875rem'
      }}>
        {currentModel ? (
          <div>
            <div>📊 {currentModel.numPoints?.toLocaleString()} points</div>
            <div>🎨 {Math.floor(currentModel.colors?.length / 3)?.toLocaleString()} colors</div>
            <div>🤖 {selectedModel}</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.7 }}>
              Zoom: {camera.zoom.toFixed(0)}x
            </div>
          </div>
        ) : (
          <div>No data</div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '0.75rem',
        borderRadius: '8px',
        fontSize: '0.75rem'
      }}>
        <div>🖱️ Left: Rotate 360°</div>
        <div>🖱️ Right: Pan</div>
        <div>🖱️ Scroll: Zoom</div>
      </div>

      {/* Reset Camera Button */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '0.5rem',
        borderRadius: '8px'
      }}>
        <button
          onClick={() => setCamera({
            rotationX: 0,
            rotationY: 0,
            zoom: 80,
            panX: 0,
            panY: 0
          })}
          style={{
            backgroundColor: '#4F46E5',
            color: 'white',
            border: 'none',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          🎯 Reset View
        </button>
      </div>
    </div>
  );
};

export default ReconstructionViewer;
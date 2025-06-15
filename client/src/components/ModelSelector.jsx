// filepath: d:\python project\project-root-final\client\src\components\ModelSelector.jsx
import React from 'react';

const ModelSelector = ({ selectedModel, onModelChange, availableModels = [] }) => {
  const models = [
    {
      id: 'nerf',
      name: 'NeRF (MiDaS)',
      description: 'Neural Radiance Fields với Intel MiDaS depth estimation',
      icon: '🧠'
    },
    {
      id: 'gaussian_splatting',
      name: 'Gaussian Splatting',
      description: '3D Gaussian Splatting cho chất lượng cao',
      icon: '✨'
    },
    {
      id: 'both',
      name: 'Cả hai models',
      description: 'Chạy cả NeRF và Gaussian Splatting để so sánh',
      icon: '🔥'
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">🤖 Select Model</h3>
      
      {availableModels.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            Available models: {availableModels.join(', ')}
          </p>
        </div>
      )}
      
      <div className="grid gap-3">
        {models.map(model => (
          <label key={model.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="model"
              value={model.id}
              checked={selectedModel === model.id}
              onChange={(e) => onModelChange(e.target.value)}
              className="mr-3"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{model.icon}</span>
                <span className="font-semibold">{model.name}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {model.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
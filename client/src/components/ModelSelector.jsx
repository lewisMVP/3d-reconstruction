// filepath: d:\python project\project-root-final\client\src\components\ModelSelector.jsx
function ModelSelector({ selectedType, onTypeChange, availableModels = [] }) {
  const modelOptions = [
    { value: 'both', label: 'Both Models (Compare)', description: 'Run both NeRF and Gaussian Splatting' },
    { value: 'nerf', label: 'NeRF Only', description: 'Neural Radiance Fields' },
    { value: 'gaussian_splatting', label: 'Gaussian Splatting Only', description: '3D Gaussian Splatting' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Model Selection</h2>
      
      {availableModels.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            Available models: {availableModels.join(', ')}
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        {modelOptions.map((option) => (
          <label key={option.value} className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="modelType"
              value={option.value}
              checked={selectedType === option.value}
              onChange={(e) => onTypeChange(e.target.value)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-500">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default ModelSelector;
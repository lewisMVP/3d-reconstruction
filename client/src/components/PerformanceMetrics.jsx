function PerformanceMetrics({ metrics }) {
  if (!metrics || Object.keys(metrics).length === 0) {
    return null;
  }

  const formatModelName = (name) => {
    switch (name) {
      case 'gaussian_splatting':
        return 'Gaussian Splatting';
      case 'nerf':
        return 'NeRF';
      default:
        return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getMetricIcon = (metricName) => {
    switch (metricName) {
      case 'points':
      case 'num_points':
        return '●';
      case 'density':
        return '⚫';
      case 'volume':
        return '📦';
      case 'quality':
      case 'quality_score':
      case 'coverage':
        return '⭐';
      default:
        return '📊';
    }
  };

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
      
      <div className="space-y-4">
        {Object.entries(metrics).map(([modelName, modelMetrics]) => (
          <div key={modelName} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                modelName === 'gaussian_splatting' ? 'bg-blue-500' : 
                modelName === 'nerf' ? 'bg-green-500' : 'bg-purple-500'
              }`}></span>
              {formatModelName(modelName)}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(modelMetrics).map(([metricName, metricValue]) => (
                <div key={metricName} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 text-sm">{getMetricIcon(metricName)}</span>
                    <p className="text-gray-500 text-sm font-medium capitalize">
                      {metricName.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">
                    {formatValue(metricValue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {Object.keys(metrics).length > 1 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Comparison Summary</h4>
          <div className="text-sm text-blue-700 space-y-1">
            {Object.entries(metrics).map(([modelName, modelMetrics]) => {
              const points = modelMetrics.points || modelMetrics.num_points || 0;
              const quality = modelMetrics.quality || modelMetrics.quality_score || modelMetrics.coverage || 'N/A';
              return (
                <p key={modelName}>
                  <strong>{formatModelName(modelName)}:</strong> {points} points, Quality: {quality}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceMetrics;
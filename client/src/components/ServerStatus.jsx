import { useState } from 'react';

function ServerStatus({ status, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  if (!status) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-gray-500">Checking server...</span>
      </div>
    );
  }

  const isOnline = status.status === 'healthy';

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={isOnline ? 'text-green-700' : 'text-red-700'}>
          Server Status: {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      
      {isOnline && status.available_models && (
        <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
          Models: {status.available_models.join(', ')}
        </div>
      )}
      
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="p-1 text-gray-400 hover:text-gray-600 disabled:animate-spin transition-colors"
        title="Refresh status"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}

export default ServerStatus;
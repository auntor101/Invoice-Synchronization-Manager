import React, { useState } from 'react';
import { WifiOff, X, RefreshCw } from 'lucide-react';

export default function OfflineBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      if (navigator.onLine) {
        setIsDismissed(true);
      }
    }, 2000);
  };

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto bg-yellow-100 border border-yellow-300 rounded-lg p-4 shadow-lg animate-slide-up">
      <div className="flex items-start gap-3">
        <WifiOff className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-yellow-800">Working Offline</p>
          <p className="text-sm text-yellow-700 mt-1">
            You can continue scanning invoices. Changes will sync when connection is restored.
          </p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center gap-2 text-sm font-medium text-yellow-700 hover:text-yellow-900 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Checking...' : 'Retry Connection'}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-sm font-medium text-yellow-700 hover:text-yellow-900"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-yellow-700 hover:text-yellow-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

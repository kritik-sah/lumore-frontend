"use client";
import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Optional icon

const OfflinePage = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ui-background p-4 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-4 max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-ui-primary" />
          <h1 className="text-2xl font-semibold text-gray-800">You're Offline</h1>
          <p className="text-gray-600">
            It seems you've lost your internet connection. Please check your connection and try again.
          </p>
          <button
            onClick={handleRetry}
            className="mt-4 bg-ui-primary text-ui-shade w-full px-5 py-2 rounded-lg hover:bg-ui-primary/90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;

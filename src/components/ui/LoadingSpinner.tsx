import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = '' }) => {
  return (
    <div
      className="flex min-h-[200px] flex-col items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div className="absolute h-12 w-12 rounded-full border-4 border-solid border-gray-200"></div>
        <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
      </div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

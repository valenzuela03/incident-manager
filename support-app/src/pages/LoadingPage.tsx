import React from 'react';
import LoadingComponent from '@/utils/LoadingComponent';

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <LoadingComponent />
    </div>
  );
}

export default LoadingPage;

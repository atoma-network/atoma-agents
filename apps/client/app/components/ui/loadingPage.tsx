import React from 'react';
import PulseLoader from './pulseLoader';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-lg text-gray-600">AtomaSage</p>
      </div>
    </div>
  );
}

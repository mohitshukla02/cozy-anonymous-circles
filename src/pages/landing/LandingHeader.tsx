
import React from 'react';
import { Link } from 'react-router-dom';

const LandingHeader: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/lovable-uploads/ef93a52d-7a19-46ab-9703-c60bf1cfdcd7.png" alt="Circles Logo" className="w-8 h-8" />
          </div>
          <span className="font-medium text-xl text-gray-800">Circles</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/auth"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Join now
          </Link>
        </div>
      </div>
    </div>
  </header>
);

export default LandingHeader;

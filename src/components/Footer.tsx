
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="font-semibold text-gray-800">Cozy Circles</span>
            </div>
            <p className="text-sm text-gray-600">
              Building authentic connections through anonymous interaction.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">About</Link></li>
              <li><Link to="/guidelines" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">Community Guidelines</Link></li>
              <li><Link to="/help" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-amber-800 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Cozy Circles. Made with care for authentic connections.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-5 h-5 flex items-center justify-center">
                <img src="/lovable-uploads/ef93a52d-7a19-46ab-9703-c60bf1cfdcd7.png" alt="Convene Logo" className="w-5 h-5" />
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-200">Convene</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Building authentic connections through anonymous interaction.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-800 dark:hover:text-amber-400 transition-colors">About</Link></li>
              <li><Link to="/guidelines" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-800 dark:hover:text-amber-400 transition-colors">Community Guidelines</Link></li>
              <li><Link to="/help" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-800 dark:hover:text-amber-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-800 dark:hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-800 dark:hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-800 dark:hover:text-amber-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Convene. Made with care for authentic connections.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

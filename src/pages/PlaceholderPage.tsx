
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PlaceholderPage = ({ title, description, icon }: PlaceholderPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="bg-white rounded-3xl shadow-lg p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              {icon}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {description}
            </p>

            <div className="bg-amber-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 text-amber-800 mb-3">
                <Construction size={20} />
                <span className="font-semibold">Coming Soon</span>
              </div>
              <p className="text-amber-700 text-sm">
                We're working hard to bring you this feature. In the meantime, explore 
                other parts of Cozy Circles and start building meaningful connections!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all font-semibold"
              >
                Go to Dashboard
              </Link>
              <Link 
                to="/profile" 
                className="border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-full hover:bg-amber-600 hover:text-white transition-all font-semibold"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FinalCtaSection: React.FC = () => (
  <section className="py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 border border-gray-200">
        <h3 className="text-3xl font-semibold text-gray-900 mb-4">
          Stop Collecting Followers. Start Making Friends.
        </h3>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join a community that demands you show up—in person, heart first. Your next best friend awaits.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/auth"
            className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <span>Find Your People Today</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default FinalCtaSection;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
const HeroSection: React.FC = () => <section className="min-h-screen flex flex-col justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
    <div className="max-w-6xl mx-auto text-center flex flex-col flex-1 justify-center">
      <h1 className="text-5xl text-gray-900 mb-6 leading-tight md:text-7xl font-semibold mx-0">
        Real Connections.<br />
        <span className="text-gray-600">Real Places.</span>
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
        Join small, interest‑driven groups that live and breathe offline. Organize a meetup in 28 days—or the group quietly vanishes. No scrolling, no likes—just face‑to‑face friendship.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <Link to="/auth" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
          <span>Join a Group Near You</span>
          <ArrowRight size={20} />
        </Link>
        <Link to="/auth" className="bg-white text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2">
          <span>Start Your Own Meetup</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-semibold text-gray-900 mb-2">28 Days</div>
          <div className="text-gray-600">To Meet or Fade Away</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-semibold text-gray-900 mb-2">Real Friends</div>
          <div className="text-gray-600">Not Digital Noise</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-semibold text-gray-900 mb-2">Face-to-Face</div>
          <div className="text-gray-600">Where Friendship Lives</div>
        </div>
      </div>
    </div>
  </section>;
export default HeroSection;
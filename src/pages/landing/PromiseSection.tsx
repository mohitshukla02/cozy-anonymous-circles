
import React from 'react';
import { Link } from 'react-router-dom';

const PromiseSection: React.FC = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          More Than an App—it's a Movement
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're done watching good conversations die online. Here, your time turns into memories. Your group isn't just another forum—it's a living community that thrives on real‑world connection.
        </p>
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Clock's Ticking—But You're in Control
        </h3>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          You have four weeks to make it count. That's plenty of time to turn "hello" into "see you Saturday." And once you do, you're not starting over—you're one meetup stronger.
        </p>
        <Link
          to="/auth"
          className="bg-white text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 inline-flex items-center space-x-2"
        >
          <span>See Groups Ending Soon</span>
        </Link>
      </div>
    </div>
  </section>
);

export default PromiseSection;

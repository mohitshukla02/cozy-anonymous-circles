import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
const HowItWorksSection: React.FC = () => <section className="py-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Three Steps to Your Next Friend
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">1</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Find Your Tribe</h4>
              <p className="text-gray-600">
                Explore local groups around your passions—photography, cooking, board games, you name it.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">2</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Plan Together</h4>
              <p className="text-gray-600">Chat anonymously, then schedule a public meetup with ease.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">3</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Meet IRL or Move On</h4>
              <p className="text-gray-600">
                When three people check in at your meetup, the clock resets. Skip it, and the group fades away.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-white" size={40} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Ready to Connect?</h4>
            <p className="text-gray-600 mb-6">Your next friendship is just three steps away.</p>
            <Link to="/auth" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>;
export default HowItWorksSection;
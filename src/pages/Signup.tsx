
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shuffle, ArrowRight, ArrowLeft } from 'lucide-react';
import { generateRandomUsername } from '../utils/usernameGenerator';
import { useUser } from '../contexts/UserContext';

const Signup = () => {
  const [username, setUsername] = useState(generateRandomUsername());
  const [step, setStep] = useState(1);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleGenerateNew = () => {
    setUsername(generateRandomUsername());
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete signup and redirect to tag onboarding
      const newUser = {
        username,
        joinDate: new Date().toISOString(),
        selectedTags: [],
        hasCompletedOnboarding: false,
        preferences: { theme: 'light' as const }
      };
      login(newUser);
      navigate('/tag-onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-amber-800 hover:text-amber-900 transition-colors mb-4">
            <ArrowLeft size={20} />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-heading font-bold text-2xl text-gray-800">Cozy Circles</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                step >= stepNumber 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  step > stepNumber ? 'bg-amber-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-8">
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Welcome to Anonymous Connection</h2>
              <p className="text-gray-600 mb-8 text-sm">
                Your journey starts with a randomly generated username. No email, no personal info—just authentic you.
              </p>
              
              <div className="bg-amber-50 rounded-2xl p-6 mb-6">
                <p className="text-xs text-amber-800 mb-3">Your anonymous identity:</p>
                <div className="text-xl font-heading font-bold text-amber-900 mb-4">{username}</div>
                <button
                  onClick={handleGenerateNew}
                  className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors text-sm"
                >
                  <Shuffle size={16} />
                  <span>Generate New Username</span>
                </button>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-amber-600 text-white py-3 rounded-full hover:bg-amber-700 transition-all font-semibold flex items-center justify-center space-x-2 text-sm"
              >
                <span>I like this username</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">How Cozy Circles Works</h2>
              <div className="space-y-6 mb-8">
                <div className="text-left">
                  <h3 className="font-semibold text-amber-800 mb-2 text-sm">🎭 Stay Anonymous</h3>
                  <p className="text-gray-600 text-xs">Your username is your only identity. No photos, real names, or personal data required.</p>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-amber-800 mb-2 text-sm">🎯 Connect by Interest</h3>
                  <p className="text-gray-600 text-xs">Join groups based on your hobbies, passions, and interests to find like-minded people.</p>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-amber-800 mb-2 text-sm">💬 Quality Conversations</h3>
                  <p className="text-gray-600 text-xs">Focus on meaningful dialogue without the distractions of likes, followers, or status.</p>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-amber-600 text-white py-3 rounded-full hover:bg-amber-700 transition-all font-semibold flex items-center justify-center space-x-2 text-sm"
              >
                <span>Sounds Perfect</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Ready to Connect?</h2>
              <p className="text-gray-600 mb-8 text-sm">
                You're all set! Your anonymous journey as <span className="font-semibold text-amber-800">{username}</span> begins now.
              </p>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-amber-800 mb-3 text-sm">What's Next?</h3>
                <ul className="text-xs text-gray-700 space-y-2 text-left">
                  <li>• Choose your interests and passions</li>
                  <li>• Explore interest-based groups</li>
                  <li>• Start meaningful conversations</li>
                  <li>• Build authentic connections</li>
                </ul>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-amber-600 text-white py-3 rounded-full hover:bg-amber-700 transition-all font-semibold flex items-center justify-center space-x-2 text-sm"
              >
                <span>Choose My Interests</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;

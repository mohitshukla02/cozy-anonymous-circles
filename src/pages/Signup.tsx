
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
      // Complete signup
      const newUser = {
        username,
        joinDate: new Date().toISOString(),
        preferences: { theme: 'light' as const }
      };
      login(newUser);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-amber-800 hover:text-amber-900 transition-colors mb-4">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-2xl text-gray-800">Cozy Circles</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
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

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Anonymous Connection</h2>
              <p className="text-gray-600 mb-8">
                Your journey starts with a randomly generated username. No email, no personal info—just authentic you.
              </p>
              
              <div className="bg-amber-50 rounded-2xl p-6 mb-6">
                <p className="text-sm text-amber-800 mb-3">Your anonymous identity:</p>
                <div className="text-2xl font-bold text-amber-900 mb-4">{username}</div>
                <button
                  onClick={handleGenerateNew}
                  className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <Shuffle size={16} />
                  <span>Generate New Username</span>
                </button>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all font-semibold flex items-center justify-center space-x-2"
              >
                <span>I like this username</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How Cozy Circles Works</h2>
              <div className="space-y-6 mb-8">
                <div className="text-left">
                  <h3 className="font-semibold text-amber-800 mb-2">🎭 Stay Anonymous</h3>
                  <p className="text-gray-600 text-sm">Your username is your only identity. No photos, real names, or personal data required.</p>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-amber-800 mb-2">🎯 Connect by Interest</h3>
                  <p className="text-gray-600 text-sm">Join groups based on your hobbies, passions, and interests to find like-minded people.</p>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-amber-800 mb-2">💬 Quality Conversations</h3>
                  <p className="text-gray-600 text-sm">Focus on meaningful dialogue without the distractions of likes, followers, or status.</p>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all font-semibold flex items-center justify-center space-x-2"
              >
                <span>Sounds Perfect</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Connect?</h2>
              <p className="text-gray-600 mb-8">
                You're all set! Your anonymous journey as <span className="font-semibold text-amber-800">{username}</span> begins now.
              </p>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-amber-800 mb-3">What's Next?</h3>
                <ul className="text-sm text-gray-700 space-y-2 text-left">
                  <li>• Explore interest-based groups</li>
                  <li>• Start meaningful conversations</li>
                  <li>• Build authentic connections</li>
                  <li>• Keep your anonymity secure</li>
                </ul>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all font-semibold flex items-center justify-center space-x-2"
              >
                <span>Enter Cozy Circles</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
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


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Shield, MessageCircle } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Anonymous by Design",
      description: "Connect authentically without revealing your identity until you choose to."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Interest-Based Groups",
      description: "Find your community through shared interests and meaningful conversations."
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
      title: "Trust-Based Messaging",
      description: "Unlock direct messaging by building genuine connections through group interactions."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Authentic Connections",
      description: "Focus on what matters most - shared interests and genuine conversations."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <img src="/lovable-uploads/ef93a52d-7a19-46ab-9703-c60bf1cfdcd7.png" alt="Convene Logo" className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Convene</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We believe that the most meaningful connections happen when people can be their authentic selves. 
              Convene creates a space where you can connect with others based on shared interests and genuine 
              conversations, without the pressure of social expectations or identity-based judgments.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
            To foster authentic human connections by removing barriers and biases, allowing people to 
            connect based on their thoughts, interests, and personalities rather than their appearance, 
            social status, or preconceived notions.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Convene Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Ready to experience authentic connections? Join thousands of others who are building 
            meaningful relationships based on shared interests and genuine conversations.
          </p>
          <Link 
            to="/groups" 
            className="inline-flex items-center bg-white text-amber-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Explore Groups
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

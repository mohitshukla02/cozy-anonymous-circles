
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Shield, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Anonymous by Design",
      description: "Connect authentically without revealing your identity until you choose to."
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Interest-Based Groups",
      description: "Find your community through shared interests and meaningful conversations."
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
      title: "Trust-Based Messaging",
      description: "Unlock direct messaging by building genuine connections through group interactions."
    },
    {
      icon: <Heart className="w-6 h-6 text-red-600" />,
      title: "Authentic Connections",
      description: "Focus on what matters most - shared interests and genuine conversations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-8 shadow-lg">
            <img src="/lovable-uploads/ef93a52d-7a19-46ab-9703-c60bf1cfdcd7.png" alt="Convene Logo" className="w-12 h-12" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Convene</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We believe that the most meaningful connections happen when people can be their authentic selves. 
            Convene creates a space where you can connect with others based on shared interests and genuine 
            conversations, without the pressure of social expectations or identity-based judgments.
          </p>
        </div>

        <Card className="mb-16 border-0 shadow-soft-md bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
              To foster authentic human connections by removing barriers and biases, allowing people to 
              connect based on their thoughts, interests, and personalities rather than their appearance, 
              social status, or preconceived notions.
            </p>
          </CardContent>
        </Card>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How Convene Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-soft-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mr-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-soft-md bg-gradient-to-r from-amber-500 to-amber-600 text-white overflow-hidden">
          <CardContent className="p-12 text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
              <p className="text-amber-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Ready to experience authentic connections? Join thousands of others who are building 
                meaningful relationships based on shared interests and genuine conversations.
              </p>
              <Link 
                to="/groups" 
                className="inline-flex items-center bg-white text-amber-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Groups
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Heart, Users, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CommunityGuidelines = () => {
  const guidelines = [
    {
      icon: <Heart className="w-6 h-6 text-red-600" />,
      title: "Be Respectful & Kind",
      description: "Treat everyone with respect, kindness, and empathy. Remember there's a real person behind every anonymous profile.",
      dos: [
        "Listen to understand, not to judge",
        "Use inclusive language",
        "Be patient with different perspectives",
        "Show appreciation for thoughtful contributions"
      ],
      donts: [
        "Use hate speech or discriminatory language",
        "Attack someone personally",
        "Dismiss others' experiences",
        "Engage in bullying or harassment"
      ]
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Foster Genuine Connections",
      description: "Focus on building authentic relationships through meaningful conversations and shared interests.",
      dos: [
        "Share genuine thoughts and experiences",
        "Ask thoughtful questions",
        "Support community members",
        "Engage meaningfully in group discussions"
      ],
      donts: [
        "Create fake personas or multiple accounts",
        "Spam or post irrelevant content",
        "Try to guess others' identities",
        "Share others' personal information"
      ]
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Protect Privacy & Safety",
      description: "Respect the anonymous nature of our platform and keep everyone safe.",
      dos: [
        "Keep personal information private",
        "Respect others' boundaries",
        "Report inappropriate behavior",
        "Use the platform as intended"
      ],
      donts: [
        "Try to reveal someone's identity",
        "Share personal contact information",
        "Screenshot or share private messages",
        "Engage in activities that compromise safety"
      ]
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
      title: "Communicate Thoughtfully",
      description: "Make every interaction count by communicating with intention and care.",
      dos: [
        "Think before you post or message",
        "Stay on topic in group discussions",
        "Give constructive feedback",
        "Express disagreement respectfully"
      ],
      donts: [
        "Post inflammatory or provocative content",
        "Derail conversations",
        "Use excessive profanity",
        "Share misinformation"
      ]
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
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Community Guidelines</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            These guidelines help us maintain a safe, respectful, and welcoming community for everyone. 
            By using Convene, you agree to follow these principles.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {guidelines.map((guideline, index) => (
            <Card key={index} className="border-0 shadow-soft hover:shadow-soft-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mr-4">
                    {guideline.icon}
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{guideline.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-700 text-lg leading-relaxed">
                  {guideline.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-green-800">Do</h3>
                    </div>
                    <ul className="space-y-3">
                      {guideline.dos.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                      <h3 className="text-lg font-semibold text-red-800">Don't</h3>
                    </div>
                    <ul className="space-y-3">
                      {guideline.donts.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-soft-md bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-amber-900">Reporting & Enforcement</h2>
            </div>
            <div className="text-amber-800 space-y-6 text-lg leading-relaxed">
              <p>
                If you encounter behavior that violates these guidelines, please report it immediately. 
                We take all reports seriously and will investigate promptly.
              </p>
              <p>
                Violations may result in warnings, temporary suspensions, or permanent removal from the platform, 
                depending on the severity and frequency of the behavior.
              </p>
              <div className="mt-8">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Report an Issue
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityGuidelines;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Shield, HelpCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactOptions = [
    {
      icon: <HelpCircle className="w-6 h-6 text-blue-600" />,
      title: "General Support",
      description: "Questions about using Convene or need help getting started",
      category: "general"
    },
    {
      icon: <Shield className="w-6 h-6 text-red-600" />,
      title: "Report Issue",
      description: "Report inappropriate behavior or safety concerns",
      category: "report"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      title: "Feature Request",
      description: "Suggest new features or improvements",
      category: "feature"
    },
    {
      icon: <Mail className="w-6 h-6 text-purple-600" />,
      title: "Business Inquiry",
      description: "Partnerships, press, or business-related questions",
      category: "business"
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
            <Mail className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help! Get in touch with us and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {contactOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => setFormData({ ...formData, category: option.category })}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 text-left transition-all hover:shadow-md ${
                formData.category === option.category
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-3">
                {option.icon}
                <h3 className="text-lg font-semibold text-gray-900 ml-3">{option.title}</h3>
              </div>
              <p className="text-gray-600">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full"
                placeholder="What's this about?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full"
                placeholder="Tell us more about your question or concern..."
              />
            </div>
            
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
            <p className="text-gray-600">
              We typically respond to all inquiries within 24 hours. For urgent safety concerns, 
              we aim to respond within 2 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

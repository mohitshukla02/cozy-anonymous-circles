
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapboxTokenFormProps {
  userLocationCity: string;
  onTokenSubmit: (token: string) => void;
}

const MapboxTokenForm = ({ userLocationCity, onTokenSubmit }: MapboxTokenFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('token') as string;
    if (token) {
      onTokenSubmit(token);
    }
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-8">
      <div className="text-center max-w-md mx-auto">
        <MapPin className="mx-auto text-neutral-400 dark:text-neutral-500 mb-4" size={32} />
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Explore meetups in {userLocationCity}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Enter your Mapbox token to see upcoming events on the map
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="token"
            placeholder="Mapbox public token"
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            required
          />
          <button 
            type="submit" 
            className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-3 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Load map
          </button>
        </form>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">
          Get your token at{' '}
          <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-neutral-900 dark:text-neutral-100 hover:underline">
            mapbox.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default MapboxTokenForm;

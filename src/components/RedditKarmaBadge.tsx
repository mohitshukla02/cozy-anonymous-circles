
import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';

interface RedditKarmaBadgeProps {
  karma: number;
  className?: string;
}

const RedditKarmaBadge = ({ karma, className = "" }: RedditKarmaBadgeProps) => {
  const getKarmaLevel = (karma: number) => {
    if (karma >= 10000) return { level: "Elite", color: "text-purple-600 bg-purple-100", icon: Trophy };
    if (karma >= 5000) return { level: "Expert", color: "text-blue-600 bg-blue-100", icon: TrendingUp };
    if (karma >= 1000) return { level: "Veteran", color: "text-green-600 bg-green-100", icon: TrendingUp };
    if (karma >= 100) return { level: "Active", color: "text-orange-600 bg-orange-100", icon: TrendingUp };
    return { level: "New", color: "text-gray-600 bg-gray-100", icon: TrendingUp };
  };

  const { level, color, icon: Icon } = getKarmaLevel(karma);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${color} ${className}`}>
      <Icon size={12} />
      <span>{karma.toLocaleString()} karma</span>
      <span className="text-xs opacity-75">({level})</span>
    </div>
  );
};

export default RedditKarmaBadge;

import React from 'react';
import { TrendingUp, TrendingDown, Users, Database, FileText, AlertCircle } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Total This Month',
      value: stats.totalThisMonth,
      change: stats.monthlyChange,
      icon: FileText,
      positive: true,
      color: 'emerald'
    },
    {
      title: 'Pending Review',
      value: stats.pendingReview,
      subtitle: 'Requires attention',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      title: 'Avg Confidence',
      value: `${stats.avgConfidence}%`,
      subtitle: `${stats.avgConfidence >= 85 ? 'Above' : 'Below'} target (85%)`,
      icon: TrendingUp,
      positive: stats.avgConfidence >= 85,
      color: 'green'
    },
    {
      title: 'Budget Remaining',
      value: `$${stats.budgetRemaining}`,
      subtitle: `$${stats.budgetUsed} used of $15/month`,
      icon: Database,
      color: 'emerald'
    }
  ];

  const getColorClasses = (color, isBackground = false) => {
    const colors = {
      emerald: isBackground ? 'bg-emerald-100' : 'text-emerald-600',
      orange: isBackground ? 'bg-orange-100' : 'text-orange-600',
      green: isBackground ? 'bg-green-100' : 'text-green-600',
      purple: isBackground ? 'bg-purple-100' : 'text-purple-600',
      red: isBackground ? 'bg-red-100' : 'text-red-600'
    };
    return colors[color] || (isBackground ? 'bg-gray-100' : 'text-gray-600');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg ${getColorClasses(card.color, true)}`}>
                <Icon className={`w-5 h-5 ${getColorClasses(card.color)}`} />
              </div>
              {card.change && (
                <div className={`flex items-center gap-1 text-xs ${card.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {card.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{Math.abs(card.change)}%</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-1">{card.title}</p>
            <p className={`text-2xl font-bold ${getColorClasses(card.color)}`}>{card.value}</p>
            {card.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            )}
            {card.change && (
              <p className="text-xs text-gray-500 mt-1">
                {card.positive ? '↑' : '↓'} {Math.abs(card.change)}% from last month
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

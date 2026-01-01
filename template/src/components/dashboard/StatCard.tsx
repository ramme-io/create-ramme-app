import React from 'react';
import { Card } from '@ramme-io/ui';
import { ArrowUpRight, ArrowDownRight, Activity, Users, DollarSign, CreditCard } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  status?: 'positive' | 'negative' | 'neutral' | 'offline';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  trend, 
  status = 'neutral' 
}) => {
  const statusColors = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-blue-600 bg-blue-100',
    offline: 'text-gray-400 bg-gray-100',
  };

  const getIcon = () => {
    switch(title?.toLowerCase()) {
      case 'active users': return <Users size={20} />;
      case 'revenue': return <DollarSign size={20} />;
      case 'sales': return <CreditCard size={20} />;
      default: return <Activity size={20} />;
    }
  };

  return (
    <Card className="p-6 flex flex-col justify-between h-full border-border/60 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1 tracking-tight">{value || '--'}</h3>
        </div>
        <div className={`p-2 rounded-lg ${statusColors[status] || statusColors.neutral}`}>
          {getIcon()}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 text-xs font-medium">
          {trend.startsWith('+') ? (
            <ArrowUpRight size={14} className="text-green-600" />
          ) : (
            <ArrowDownRight size={14} className="text-red-600" />
          )}
          <span className={trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
            {trend}
          </span>
          <span className="text-muted-foreground ml-1">from last month</span>
        </div>
      )}
    </Card>
  );
};
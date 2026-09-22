import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: 'saffron' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'positive',
  color = 'saffron',
  onClick,
}) => {
  const colorMap = {
    saffron: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300',
    blue: 'bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-300',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300',
  };

  const iconBgMap = {
    saffron: 'bg-amber-100 text-amber-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-800',
    blue: 'bg-sky-100 text-sky-700',
    purple: 'bg-purple-100 text-purple-700',
    rose: 'bg-rose-100 text-rose-700',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 border bg-white shadow-sm transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{title}</p>
          <h3 className="text-2xl font-extrabold text-gray-900 mt-1 font-serif">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3.5 rounded-xl ${iconBgMap[color]}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className={trendType === 'positive' ? 'text-emerald-600 font-semibold' : trendType === 'negative' ? 'text-rose-600 font-semibold' : 'text-gray-500'}>
            {trend}
          </span>
          <span className="text-gray-400">Live DB Metrics</span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { getStatusBadgeClass } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const badgeClass = getStatusBadgeClass(status);
  const formattedText = status?.replace(/_/g, ' ') || 'UNKNOWN';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {formattedText}
    </span>
  );
};

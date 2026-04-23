// RedCalc Pro - Animated Status Indicator
// Muestra estado con animación de pulso

import { ReactNode } from 'react';

interface StatusIndicatorProps {
  status: 'healthy' | 'warning' | 'critical' | 'info';
  label: string;
  value?: string | number;
  icon?: ReactNode;
  animated?: boolean;
}

const statusConfig = {
  healthy: {
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  warning: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  critical: {
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  info: {
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
};

export function StatusIndicator({
  status,
  label,
  value,
  icon,
  animated = true,
}: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className={`rc-card p-4 border ${config.borderColor} ${config.bgColor} ${animated ? 'animate-scale-in' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${config.color} ${animated ? 'animate-pulse-glow' : ''}`} />
          </div>
          <div>
            <div className={`text-sm font-semibold ${config.textColor}`}>{label}</div>
            {value && <div className="text-xs text-muted-foreground mt-0.5">{value}</div>}
          </div>
        </div>
        {icon && <div className={config.textColor}>{icon}</div>}
      </div>
    </div>
  );
}

// RedCalc Pro - Animated Progress Bar Component
// Barra de progreso con animaciones fluidas

import { useEffect, useState } from 'react';

interface AnimatedProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  animated?: boolean;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { height: 'h-1.5', textSize: 'text-xs' },
  md: { height: 'h-2.5', textSize: 'text-sm' },
  lg: { height: 'h-4', textSize: 'text-base' },
};

export function AnimatedProgressBar({
  value,
  max = 100,
  label,
  color = 'bg-blue-500',
  animated = true,
  showPercent = true,
  size = 'md',
}: AnimatedProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percent = Math.min((value / max) * 100, 100);
  const sizeClass = sizeConfig[size];

  useEffect(() => {
    if (!animated) {
      setDisplayValue(percent);
      return;
    }

    const startTime = Date.now();
    const duration = 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplayValue(percent * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percent, animated]);

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className={`font-medium ${sizeClass.textSize}`}>{label}</span>}
          {showPercent && (
            <span className={`font-semibold ${sizeClass.textSize} text-muted-foreground`}>
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${sizeClass.height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${sizeClass.height} ${color} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
}

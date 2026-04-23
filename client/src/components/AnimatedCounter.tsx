// RedCalc Pro - Animated Counter Component
// Animates numbers from 0 to target value

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (val: number) => string;
  className?: string;
}

export function AnimatedCounter({ value, duration = 1000, format, className = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const countRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = countRef.current;
    const difference = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutQuad)
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      const current = Math.floor(startValue + difference * easeProgress);

      setDisplayValue(current);
      countRef.current = current;

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {format ? format(displayValue) : displayValue.toLocaleString('es-ES')}
    </span>
  );
}

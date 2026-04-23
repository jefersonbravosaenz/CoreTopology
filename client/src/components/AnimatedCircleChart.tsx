// RedCalc Pro - Animated Circle Chart Component
// Gráfico circular con animación de entrada

import { useEffect, useRef, useState } from 'react';

interface CircleChartProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  size?: number;
  animated?: boolean;
  showPercent?: boolean;
}

export function AnimatedCircleChart({
  value,
  max,
  label,
  color = '#3b82f6',
  size = 120,
  animated = true,
  showPercent = true,
}: CircleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!animated) {
      setProgress(1);
      return;
    }

    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [animated]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 8;
    const percent = (value / max) * progress;

    // Clear canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, size, size);

    // Background circle
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Progress circle
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * percent);
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#1f2937';
    ctx.font = `bold ${size * 0.25}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(percent * 100)}%`, centerX, centerY - 4);

    // Label
    ctx.fillStyle = '#6b7280';
    ctx.font = `12px system-ui`;
    ctx.fillText(label, centerX, centerY + 12);
  }, [value, max, label, color, size, progress]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="block"
      style={{ filter: animated ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : undefined }}
    />
  );
}

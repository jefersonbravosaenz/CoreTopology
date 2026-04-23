// RedCalc Pro - Animated Bar Chart Component
// Barras que se animan al cargar

import { useEffect, useRef, useState } from 'react';

interface BarData {
  label: string;
  value: number;
  color: string;
  maxValue?: number;
}

interface AnimatedBarChartProps {
  data: BarData[];
  width?: number;
  height?: number;
  animated?: boolean;
  showValues?: boolean;
}

export function AnimatedBarChart({
  data,
  width = 600,
  height = 300,
  animated = true,
  showValues = true,
}: AnimatedBarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animated) {
      setProgress(1);
      return;
    }

    const startTime = Date.now();
    const duration = 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animated]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (height * 0.8) - (height * 0.8 * i) / 5;
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    const barWidth = (width - 80) / data.length;
    const maxValue = Math.max(...data.map(d => d.maxValue || d.value));
    const chartHeight = height * 0.8;

    data.forEach((item, idx) => {
      const x = 60 + idx * barWidth + barWidth * 0.1;
      const barHeight = (item.value / maxValue) * chartHeight * progress;
      const y = height - 40 - barHeight;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(x, y, x, height - 40);
      gradient.addColorStop(0, item.color);
      gradient.addColorStop(1, item.color + '80');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);

      // Draw bar border
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth * 0.8, barHeight);

      // Draw label
      ctx.fillStyle = '#4b5563';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(item.label, x + barWidth * 0.4, height - 30);

      // Draw value
      if (showValues) {
        ctx.fillStyle = item.color;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(Math.round(item.value * progress).toString(), x + barWidth * 0.4, y - 5);
      }
    });

    // Draw axes
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(60, 20);
    ctx.lineTo(60, height - 40);
    ctx.stroke();
  }, [data, width, height, progress, showValues]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-border rounded-lg"
      style={{ display: 'block' }}
    />
  );
}

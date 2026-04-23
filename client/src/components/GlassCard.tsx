// RedCalc Pro - Glass Morphism Card Component
// Tarjeta con efecto glassmorphism y animaciones

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = '',
  animated = true,
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={`
        relative rounded-xl p-5
        bg-white/40 backdrop-blur-md
        border border-white/30
        shadow-lg shadow-black/5
        ${hover ? 'hover:bg-white/50 hover:border-white/40 transition-all duration-300' : ''}
        ${animated ? 'animate-scale-in' : ''}
        ${className}
      `}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-5 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-white to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

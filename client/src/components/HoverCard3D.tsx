// RedCalc Pro - 3D Hover Card Component
// Tarjeta con efecto 3D al pasar el mouse

import { ReactNode, useRef, useState } from 'react';

interface HoverCard3DProps {
  children: ReactNode;
  className?: string;
}

export function HoverCard3D({ children, className = '' }: HoverCard3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * 10;
    const rotY = ((centerX - x) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        rc-card p-5
        transition-transform duration-200
        ${className}
      `}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}

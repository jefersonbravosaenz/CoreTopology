// RedCalc Pro - Animated Network Graph Component
// Visualiza la topología de red con animaciones de entrada

import { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  size?: number;
}

interface Link {
  from: string;
  to: string;
  color?: string;
  animated?: boolean;
}

interface NetworkGraphProps {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export function NetworkGraph({
  nodes,
  links,
  width = 800,
  height = 600,
  animated = true,
}: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      timeRef.current += 0.016; // ~60fps

      // Clear canvas
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw links with animation
      links.forEach((link, idx) => {
        const fromNode = nodes.find(n => n.id === link.from);
        const toNode = nodes.find(n => n.id === link.to);
        if (!fromNode || !toNode) return;

        ctx.strokeStyle = link.color || '#3b82f6';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        // Animated dots on links
        if (link.animated && animated) {
          const progress = (timeRef.current * 0.5 + idx * 0.1) % 1;
          const dotX = fromNode.x + (toNode.x - fromNode.x) * progress;
          const dotY = fromNode.y + (toNode.y - fromNode.y) * progress;

          ctx.fillStyle = link.color || '#3b82f6';
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      });

      // Draw nodes
      nodes.forEach((node, idx) => {
        const size = node.size || 20;
        const isHovered = hoveredNode === node.id;

        // Node glow effect
        if (isHovered || animated) {
          const glowSize = size + 10 + Math.sin(timeRef.current * 2 + idx) * 3;
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
          gradient.addColorStop(0, node.color + '40');
          gradient.addColorStop(1, node.color + '00');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = isHovered ? '#000' : '#fff';
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 12px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, links, width, height, hoveredNode, animated]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let hovered: string | null = null;
    for (const node of nodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist < (node.size || 20) + 10) {
        hovered = node.id;
        break;
      }
    }
    setHoveredNode(hovered);
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredNode(null)}
      className="border border-border rounded-lg cursor-pointer"
      style={{ display: 'block' }}
    />
  );
}

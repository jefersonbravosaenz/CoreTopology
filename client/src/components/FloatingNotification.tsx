// RedCalc Pro - Floating Notification Component
// Notificación con animación de entrada y salida

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface FloatingNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const typeConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: '✓',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: '✕',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: '⚠',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'ℹ',
  },
};

export function FloatingNotification({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}: FloatingNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = typeConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        max-w-sm
        ${isVisible ? 'animate-slide-in-right' : 'animate-fade-up'}
      `}
    >
      <div
        className={`
          ${config.bg} ${config.border} ${config.text}
          border rounded-lg p-4
          flex items-start gap-3
          shadow-lg
          backdrop-blur-sm
        `}
      >
        <span className="text-lg font-bold flex-shrink-0">{config.icon}</span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

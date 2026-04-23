// RedCalc Pro - Animated Timeline Component
// Línea de tiempo con animaciones de entrada escalonadas

import { ReactNode } from 'react';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  color?: string;
  completed?: boolean;
}

interface AnimatedTimelineProps {
  items: TimelineItem[];
  vertical?: boolean;
  animated?: boolean;
}

export function AnimatedTimeline({
  items,
  vertical = true,
  animated = true,
}: AnimatedTimelineProps) {
  return (
    <div className={vertical ? 'space-y-4' : 'flex items-center gap-4'}>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={`
            flex items-start gap-4
            ${animated ? 'animate-slide-in-right' : ''}
          `}
          style={animated ? { animationDelay: `${idx * 100}ms` } : undefined}
        >
          {/* Timeline dot */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                border-2 transition-all duration-300
                ${item.completed
                  ? 'bg-green-500 border-green-600'
                  : `bg-${item.color || 'blue'}-100 border-${item.color || 'blue'}-300`
                }
              `}
            >
              {item.icon ? (
                <div className={item.completed ? 'text-white' : 'text-gray-600'}>
                  {item.icon}
                </div>
              ) : (
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.completed ? 'bg-white' : 'bg-gray-400'
                  }`}
                />
              )}
            </div>
            {idx < items.length - 1 && (
              <div
                className={`w-0.5 h-12 ${
                  item.completed ? 'bg-green-500' : 'bg-gray-300'
                } mt-1`}
              />
            )}
          </div>

          {/* Content */}
          <div className="pt-1">
            <div className="font-semibold text-sm">{item.title}</div>
            {item.description && (
              <div className="text-xs text-muted-foreground mt-1">
                {item.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

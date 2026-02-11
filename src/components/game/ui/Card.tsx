import React, { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  glass?: boolean;
}

const paddingStyles: Record<string, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  padding = 'md',
  glass = false,
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        ${glass
          ? 'bg-white/10 backdrop-blur-xl border border-white/20'
          : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50'}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const iconMap = { success: '✅', error: '❌', info: 'ℹ️' };
const bgMap = {
  success: 'bg-emerald-600/90',
  error: 'bg-red-600/90',
  info: 'bg-indigo-600/90',
};

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]
        px-5 py-3 rounded-xl backdrop-blur-md
        text-white text-sm font-medium shadow-2xl
        flex items-center gap-2
        transition-all duration-300
        ${bgMap[type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <span>{iconMap[type]}</span>
      <span>{message}</span>
    </div>
  );
}

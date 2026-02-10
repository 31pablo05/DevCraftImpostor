interface ProgressBarProps {
  progress: number; // 0-100
  color?: 'indigo' | 'green' | 'red' | 'amber' | 'white';
  height?: 'sm' | 'md';
}

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-500',
  green: 'bg-emerald-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  white: 'bg-white',
};

export default function ProgressBar({
  progress,
  color = 'white',
  height = 'md',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={`w-full bg-white/20 rounded-full overflow-hidden ${height === 'sm' ? 'h-1.5' : 'h-3'}`}
    >
      <div
        className={`${colorMap[color]} h-full rounded-full transition-all duration-300 ease-linear`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

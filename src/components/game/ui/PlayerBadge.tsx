interface PlayerBadgeProps {
  name: string;
  selected?: boolean;
  eliminated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const colors = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
  'bg-cyan-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500',
  'bg-orange-500', 'bg-lime-500',
];

function getColor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const sizeMap = {
  sm: { circle: 'w-8 h-8 text-sm', text: 'text-xs' },
  md: { circle: 'w-10 h-10 text-base', text: 'text-sm' },
  lg: { circle: 'w-14 h-14 text-xl', text: 'text-base' },
};

export default function PlayerBadge({
  name,
  selected = false,
  eliminated = false,
  size = 'md',
}: PlayerBadgeProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const s = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`
          ${s.circle} rounded-full flex items-center justify-center font-bold text-white
          ${eliminated ? 'bg-gray-600 opacity-50' : getColor(name)}
          ${selected ? 'ring-3 ring-red-400 ring-offset-2 ring-offset-gray-900' : ''}
          transition-all duration-150
        `}
      >
        {initials}
      </div>
      <span
        className={`${s.text} text-gray-300 truncate max-w-[80px] text-center ${eliminated ? 'line-through opacity-50' : ''}`}
      >
        {name}
      </span>
    </div>
  );
}

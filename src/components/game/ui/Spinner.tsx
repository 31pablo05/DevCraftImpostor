export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeMap[size]} border-3 border-white/20 border-t-white rounded-full animate-spin`}
      />
    </div>
  );
}

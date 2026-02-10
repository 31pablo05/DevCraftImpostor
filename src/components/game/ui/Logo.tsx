interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withText?: boolean;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32',
};

/**
 * Logo del juego El Impostor.
 * Usa la imagen SVG de /logo/impostorlogo2.svg
 */
export default function Logo({
  size = 'md',
  className = '',
  withText = false,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logo/impostorlogo2.svg"
        alt="El Impostor"
        className={`${sizeMap[size]} rounded-xl object-contain drop-shadow-lg`}
        draggable={false}
      />
      {withText && (
        <span className="font-black text-white tracking-tight text-lg">
          El Impostor
        </span>
      )}
    </div>
  );
}

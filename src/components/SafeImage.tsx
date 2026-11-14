import { useEffect, useState } from 'react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

export function SafeImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  decoding = 'async',
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[var(--color-cream)] text-[var(--color-green-ink)]/70 ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16" />
          <path d="M14 14l1.586-1.586a2 2 0 0 1 2.828 0L20 14" />
          <rect x="3" y="4" width="18" height="16" rx="2" />
        </svg>
        <span className="mt-2 text-xs font-medium text-[var(--color-muted)] px-3 text-center truncate max-w-full">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

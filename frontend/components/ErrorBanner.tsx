interface BannerProps {
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  onDismiss?: () => void;
}

const styles: Record<BannerProps['type'], { bg: string; border: string; color: string; icon: string }> = {
  error: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: '⚠' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', icon: '✓' },
  warning: { bg: '#fffbeb', border: '#fde68a', color: '#d97706', icon: '!' },
  info: { bg: '#fdf6ec', border: '#fde68a', color: '#c9a97a', icon: 'ℹ' },
};

export function Banner({ message, type, onDismiss }: BannerProps) {
  const s = styles[type];

  return (
    <div
      className="mb-4 flex items-start gap-2.5 rounded-[10px] border px-4 py-3"
      style={{ background: s.bg, borderColor: s.border }}
    >
      <span className="mt-px shrink-0 text-sm font-bold" style={{ color: s.color }}>
        {s.icon}
      </span>
      <p className="flex-1 text-[13px] leading-relaxed" style={{ color: s.color }}>
        {message}
      </p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-base leading-none opacity-60 hover:opacity-100"
          style={{ color: s.color }}
          aria-label="Dismiss"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  animated = true,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-code text-green-600">{label}</span>
          {showPercentage && (
            <span className="text-xs font-cyber text-green-400">{clampedProgress}%</span>
          )}
        </div>
      )}

      <div className="relative w-full h-2 bg-black/80 border border-green-500/20 rounded-full overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-green-400/10 rounded-full" />

        {/* Progress bar */}
        <div
          className={`h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-300 ${
            animated ? "shadow-lg shadow-green-400/50" : ""
          }`}
          style={{
            width: `${clampedProgress}%`,
          }}
        >
          {/* Animated shimmer effect */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}

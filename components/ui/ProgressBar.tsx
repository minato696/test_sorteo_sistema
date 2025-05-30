interface ProgressBarProps {
  value: number
  className?: string
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
        style={{ width: `${clampedValue}%` }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      </div>
    </div>
  )
}

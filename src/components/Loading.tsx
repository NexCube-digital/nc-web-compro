import React from 'react'

interface LoadingProps {
  fullScreen?: boolean
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Loading Component
 * Displays a loading spinner with optional message
 */
export const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  message = 'Memuat...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-slate-200`} />
        
        {/* Spinning gradient ring */}
        <div
          className={`${sizeClasses[size]} absolute top-0 left-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-purple-600 animate-spin`}
          style={{ animationDuration: '0.8s' }}
        />

        {/* Center dot with pulse */}
        <div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </div>

      {message && (
        <p className="text-sm font-medium text-slate-700 animate-pulse">
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinnerElement}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinnerElement}
    </div>
  )
}

/**
 * Skeleton Loader Component
 * Displays a skeleton loading placeholder
 */
interface SkeletonProps {
  width?: string | number
  height?: string | number
  circle?: boolean
  count?: number
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height = '1rem',
  circle = false,
  count = 1,
  className = '',
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  const skeletonClass = `bg-slate-200 shimmer ${circle ? 'rounded-full' : 'rounded'} ${className}`

  if (count === 1) {
    return <div className={skeletonClass} style={style} />
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={skeletonClass} style={style} />
      ))}
    </div>
  )
}

/**
 * Progress Bar Component
 * Displays a progress bar with percentage
 */
interface ProgressBarProps {
  progress: number // 0-100
  showPercentage?: boolean
  color?: 'blue' | 'green' | 'red' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = true,
  color = 'blue',
  size = 'md',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-600 to-purple-600',
    green: 'bg-gradient-to-r from-green-600 to-emerald-600',
    red: 'bg-gradient-to-r from-red-600 to-rose-600',
    yellow: 'bg-gradient-to-r from-yellow-600 to-orange-600',
  }

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-slate-600 mt-1 text-right font-semibold">
          {clampedProgress.toFixed(0)}%
        </p>
      )}
    </div>
  )
}

/**
 * Spinner Component (Inline)
 * Small inline spinner for buttons or small spaces
 */
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]}`}
      style={{ color }}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * Dots Loader Component
 * Animated dots loader
 */
export const DotsLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  )
}

export default Loading

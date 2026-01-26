import React from 'react'

export const LoadingSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 3, 
  className = "w-full h-12 rounded-xl" 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${className} shimmer bg-slate-200`}
        />
      ))}
    </>
  )
}

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="flex-1 h-12 shimmer bg-slate-200 rounded-lg"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 bg-white rounded-xl border border-slate-200">
          <div className="h-8 w-3/4 shimmer bg-slate-200 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full shimmer bg-slate-200 rounded" />
            <div className="h-4 w-5/6 shimmer bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export const AvatarSkeleton: React.FC = () => {
  return (
    <div className="w-10 h-10 rounded-full shimmer bg-slate-200" />
  )
}

export const EmptyState: React.FC<{ 
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}> = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="mb-4 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-600 text-center mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  )
}

export const Badge: React.FC<{
  label: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
}> = ({ label, variant = 'primary', size = 'md' }) => {
  const baseClasses = 'font-semibold rounded-full inline-block transition-smooth'
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-cyan-100 text-cyan-700'
  }

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {label}
    </span>
  )
}

export const Alert: React.FC<{
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose?: () => void
}> = ({ title, message, type = 'info', onClose }) => {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const iconClasses = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }

  return (
    <div className={`p-4 rounded-lg border ${typeClasses[type]} animate-fadeInUp`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconClasses[type]}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-sm mt-1 opacity-75">{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg opacity-50 hover:opacity-75 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

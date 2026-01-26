import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hover = false
}) => {
  const baseClasses = 'rounded-xl p-6'
  const hoverClass = hover ? 'transition-smooth hover:shadow-xl hover:-translate-y-1' : ''

  const variantClasses = {
    default: 'bg-white border border-slate-200 shadow-sm',
    elevated: 'bg-white shadow-lg border border-slate-100',
    outlined: 'bg-white border-2 border-slate-300',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClass} ${className}`}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="mb-6 pb-4 border-b border-slate-200 flex items-start justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}

interface CardBodyProps {
  children: ReactNode
  className?: string
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={`mt-6 pt-4 border-t border-slate-200 flex justify-between items-center ${className}`}>
      {children}
    </div>
  )
}

interface StatsCardProps {
  icon: ReactNode
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  color?: 'blue' | 'green' | 'red' | 'yellow'
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  change,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  }

  return (
    <Card variant="elevated" hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {change && (
            <p className={`text-xs mt-2 font-semibold ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}% dari bulan lalu
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

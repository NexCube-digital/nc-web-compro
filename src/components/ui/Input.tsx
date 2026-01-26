import React, { ReactNode } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  ...props
}) => {
  const fullWidthClass = fullWidth ? 'w-full' : ''

  return (
    <div className={fullWidthClass}>
      {label && (
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-4 transition-smooth ${
            iconPosition === 'left' ? 'pl-10' : ''
          } ${
            iconPosition === 'right' ? 'pr-10' : ''
          } ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-300'
          } ${className}`}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586 5.313 11.899a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {helper && !error && (
        <p className="mt-2 text-xs text-slate-600">{helper}</p>
      )}
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  fullWidth?: boolean
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helper,
  fullWidth = false,
  className,
  ...props
}) => {
  const fullWidthClass = fullWidth ? 'w-full' : ''

  return (
    <div className={fullWidthClass}>
      {label && (
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-4 transition-smooth resize-none ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-300'
        } ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {helper && !error && (
        <p className="mt-2 text-xs text-slate-600">{helper}</p>
      )}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helper?: string
  options: Array<{ value: string | number; label: string }>
  fullWidth?: boolean
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helper,
  options,
  fullWidth = false,
  className,
  ...props
}) => {
  const fullWidthClass = fullWidth ? 'w-full' : ''

  return (
    <div className={fullWidthClass}>
      {label && (
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-4 transition-smooth appearance-none bg-white cursor-pointer ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-300'
          } ${className}`}
          {...props}
        >
          <option value="">-- Pilih --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {helper && !error && (
        <p className="mt-2 text-xs text-slate-600">{helper}</p>
      )}
    </div>
  )
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className, ...props }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        className="w-5 h-5 rounded border-2 border-slate-300 cursor-pointer accent-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-smooth"
        {...props}
      />
      {label && (
        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
          {label}
        </span>
      )}
    </label>
  )
}

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Radio: React.FC<RadioProps> = ({ label, className, ...props }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="radio"
        className="w-5 h-5 border-2 border-slate-300 cursor-pointer accent-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-smooth"
        {...props}
      />
      {label && (
        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
          {label}
        </span>
      )}
    </label>
  )
}

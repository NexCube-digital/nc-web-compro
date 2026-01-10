import React from 'react'

interface Props {
  message?: string
  small?: boolean
}

const FeatureLoadingOverlay: React.FC<Props> = ({ message = 'Menyegarkan...', small = false }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className={`absolute inset-0 bg-white/60 backdrop-blur-sm ${small ? 'opacity-80' : 'opacity-95'} transition-opacity`} />
      <div className="relative z-50 flex items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
        <div className="text-slate-800 font-medium">{message}</div>
      </div>
    </div>
  )
}

export default FeatureLoadingOverlay

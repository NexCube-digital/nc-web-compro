import React from 'react'

interface Props {
  message?: string
  onRefresh: () => void
  onDismiss?: () => void
}

const NewDataBanner: React.FC<Props> = ({ message = 'Data terbaru tersedia', onRefresh, onDismiss }) => {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-4 py-2 flex items-center gap-4">
        <div className="text-sm font-medium text-slate-900">{message}</div>
        <div className="flex gap-2">
          <button onClick={onRefresh} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Refresh</button>
          <button onClick={onDismiss} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-sm">Tutup</button>
        </div>
      </div>
    </div>
  )
}

export default NewDataBanner

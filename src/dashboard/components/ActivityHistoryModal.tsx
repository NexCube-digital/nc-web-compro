import React, { useState, useEffect } from 'react'
import apiClient from '../../services/api'

interface Activity {
  id: number
  action: string
  description: string
  timestamp: string
  icon: 'create' | 'edit' | 'delete' | 'view' | 'export' | 'login' | 'logout'
  type: 'info' | 'success' | 'warning' | 'error'
}

interface ActivityHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onOpen?: () => void
}

export const ActivityHistoryModal = ({ isOpen, onClose, onOpen }: ActivityHistoryModalProps) => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchActivities()
      if (onOpen) onOpen()
    }
  }, [isOpen, onOpen])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getActivities(20)
      if (response && response.data && (response.data as any).items && Array.isArray((response.data as any).items)) {
        const items = (response.data as any).items;
        const mappedHelper = (item: any): Activity => ({
          id: item.id,
          action: item.action,
          description: item.description,
          timestamp: item.createdAt,
          icon: item.icon as any,
          type: item.type as any
        })
        setActivities(items.map(mappedHelper))
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case 'create':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )
      case 'edit':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'delete':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )
      case 'view':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      case 'export':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
          </svg>
        )
      case 'login':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100'
      case 'error':
        return 'bg-red-100'
      case 'warning':
        return 'bg-yellow-100'
      case 'info':
        return 'bg-blue-100'
      default:
        return 'bg-slate-100'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'baru saja'
    if (diffMins < 60) return `${diffMins}m yang lalu`
    if (diffHours < 24) return `${diffHours}h yang lalu`
    if (diffDays < 7) return `${diffDays}d yang lalu`
    return date.toLocaleDateString('id-ID')
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
      />

      <div className="fixed top-20 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-96">
        <div className="bg-white rounded-lg shadow-lg max-h-[60vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-800">Riwayat Kegiatan</h2>
          </div>

          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : activities.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBgColor(activity.type)}`}>
                        <div
                          className={
                            activity.type === 'success'
                              ? 'text-green-600'
                              : activity.type === 'error'
                                ? 'text-red-600'
                                : activity.type === 'warning'
                                  ? 'text-yellow-600'
                                  : 'text-blue-600'
                          }
                        >
                          {getActivityIcon(activity.icon)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-gray-900 text-xs">{activity.action}</h3>
                            <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2">
                              {activity.description}
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {formatTime(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-xs text-gray-400 italic">Belum ada riwayat kegiatan</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-center text-[11px] text-gray-500">
            {activities.length} kegiatan
          </div>
        </div>
      </div>
    </>
  )
}

export default ActivityHistoryModal

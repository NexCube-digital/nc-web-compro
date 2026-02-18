import React, { useState, useEffect, useCallback } from 'react'
import apiClient from '../../services/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: number
  action: string
  description: string
  createdAt: string
  icon: string
  type: 'info' | 'success' | 'warning' | 'error'
}

interface ActivityHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onOpen?: () => void
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

/** Returns an SVG icon based on the notification action keyword */
const getNotificationIcon = (icon: string, action: string): React.ReactNode => {
  // Detect by action text for business-specific icons
  const a = action.toLowerCase()

  if (a.includes('pesanan') || a.includes('kontak')) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  }
  if (a.includes('pembayaran') || a.includes('lunas') || a.includes('pemasukan')) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
  if (a.includes('invoice') || a.includes('faktur')) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
  if (a.includes('jatuh tempo') || a.includes('overdue')) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  }
  if (a.includes('pengeluaran')) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }

  // Fallback by icon field
  if (icon === 'create') {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    )
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

const getTypeBg = (type: string): string => {
  switch (type) {
    case 'success': return 'bg-emerald-100'
    case 'error': return 'bg-red-100'
    case 'warning': return 'bg-amber-100'
    default: return 'bg-blue-100'
  }
}

const getTypeText = (type: string): string => {
  switch (type) {
    case 'success': return 'text-emerald-600'
    case 'error': return 'text-red-600'
    case 'warning': return 'text-amber-600'
    default: return 'text-blue-600'
  }
}

const getTypeBadge = (type: string): string => {
  switch (type) {
    case 'success': return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    case 'error': return 'bg-red-50 text-red-700 border border-red-200'
    case 'warning': return 'bg-amber-50 text-amber-700 border border-amber-200'
    default: return 'bg-blue-50 text-blue-700 border border-blue-200'
  }
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'baru saja'
  if (diffMins < 60) return `${diffMins}m lalu`
  if (diffHours < 24) return `${diffHours}j lalu`
  if (diffDays < 7) return `${diffDays}h lalu`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ActivityHistoryModal = ({ isOpen, onClose, onOpen }: ActivityHistoryModalProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.getActivities(20)
      const items = (response?.data as any)?.items
      if (Array.isArray(items)) {
        setNotifications(
          items.map((item: any): Notification => ({
            id: item.id,
            action: item.action,
            description: item.description,
            createdAt: item.createdAt,
            icon: item.icon ?? 'info',
            type: item.type ?? 'info',
          }))
        )
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
      onOpen?.()
    }
  }, [isOpen, fetchNotifications, onOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop — click to close */}
      <div className="fixed inset-0 z-30" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-20 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-96">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-h-[70vh] overflow-hidden flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-sm font-semibold text-gray-800">Notifikasi</h2>
            </div>
            {notifications.length > 0 && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                {notifications.length} baru
              </span>
            )}
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center p-10">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif: Notification) => (
                  <div
                    key={notif.id}
                    className="p-3.5 hover:bg-gray-50 transition-colors cursor-default"
                  >
                    <div className="flex gap-3">
                      {/* Icon bubble */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeBg(notif.type)}`}>
                        <div className={getTypeText(notif.type)}>
                          {getNotificationIcon(notif.icon, notif.action)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="font-semibold text-gray-900 text-xs">{notif.action}</h3>
                              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${getTypeBadge(notif.type)}`}>
                                {notif.type === 'success' ? 'Berhasil' : notif.type === 'warning' ? 'Perhatian' : notif.type === 'error' ? 'Error' : 'Info'}
                              </span>
                            </div>
                            <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                              {notif.description}
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                            {formatTime(notif.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Tidak ada notifikasi</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Pesanan, invoice, dan pembayaran baru akan muncul di sini</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => {
                localStorage.setItem('lastSeenActivity', new Date().toISOString());
                onClose();
                window.dispatchEvent(new CustomEvent('activityRead'));
              }}
              className="text-[11px] text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tandai semua dibaca
            </button>
            <button
              onClick={fetchNotifications}
              className="text-[11px] text-blue-500 hover:text-blue-700 font-medium transition-colors flex items-center gap-1.5"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ActivityHistoryModal

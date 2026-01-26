/**
 * Utility Helper Functions
 * Common helper functions used throughout the application
 */

import { CURRENCY, DATE_FORMATS, VALIDATION } from './constants'

/**
 * Format number to Indonesian Rupiah currency
 * @param value - Number to format
 * @param withSymbol - Whether to include Rp symbol
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, withSymbol: boolean = true): string => {
  const formatted = new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'decimal',
    minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
  }).format(value || 0)

  return withSymbol ? `${CURRENCY.SYMBOL} ${formatted}` : formatted
}

/**
 * Parse currency string to number
 * @param value - Currency string to parse
 * @returns Parsed number
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9,-]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

/**
 * Format date to Indonesian locale
 * @param date - Date to format
 * @param includeTime - Whether to include time
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, includeTime: boolean = false): string => {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) return '-'

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }

    return new Intl.DateTimeFormat(DATE_FORMATS.LOCALE, options).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

/**
 * Format date to short format (DD/MM/YYYY)
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDateShort = (date: string | Date): string => {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) return '-'

    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()

    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

/**
 * Get relative time string (e.g., "2 jam yang lalu")
 * @param date - Date to compare
 * @returns Relative time string
 */
export const getRelativeTime = (date: string | Date): string => {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return 'Baru saja'
    if (diffMin < 60) return `${diffMin} menit yang lalu`
    if (diffHour < 24) return `${diffHour} jam yang lalu`
    if (diffDay < 7) return `${diffDay} hari yang lalu`
    if (diffDay < 30) return `${Math.floor(diffDay / 7)} minggu yang lalu`
    if (diffDay < 365) return `${Math.floor(diffDay / 30)} bulan yang lalu`
    return `${Math.floor(diffDay / 365)} tahun yang lalu`
  } catch (error) {
    console.error('Error getting relative time:', error)
    return '-'
  }
}

/**
 * Truncate string to specified length
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength: number = 50, suffix: string = '...'): string => {
  if (!str) return ''
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Capitalize first letter of string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitalize first letter of each word
 * @param str - String to capitalize
 * @returns Title cased string
 */
export const titleCase = (str: string): string => {
  if (!str) return ''
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Validate email address
 * @param email - Email to validate
 * @returns True if valid email
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email)
}

/**
 * Validate phone number (Indonesian format)
 * @param phone - Phone number to validate
 * @returns True if valid phone number
 */
export const isValidPhone = (phone: string): boolean => {
  return VALIDATION.PHONE_REGEX.test(phone)
}

/**
 * Generate random ID
 * @param prefix - Optional prefix
 * @returns Random ID string
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`
}

/**
 * Debounce function execution
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function execution
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Deep clone object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if object is empty
 * @param obj - Object to check
 * @returns True if empty
 */
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true
  if (typeof obj === 'string') return obj.trim().length === 0
  if (Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

/**
 * Sleep for specified milliseconds
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after ms
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Format file size to human readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get initials from name
 * @param name - Full name
 * @param maxLength - Maximum number of initials
 * @returns Initials string
 */
export const getInitials = (name: string, maxLength: number = 2): string => {
  if (!name) return ''
  
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('')
}

/**
 * Calculate percentage
 * @param value - Current value
 * @param total - Total value
 * @param decimals - Number of decimal places
 * @returns Percentage number
 */
export const calculatePercentage = (value: number, total: number, decimals: number = 2): number => {
  if (total === 0) return 0
  return Math.round((value / total) * 100 * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Sort array of objects by key
 * @param array - Array to sort
 * @param key - Key to sort by
 * @param order - Sort order (asc or desc)
 * @returns Sorted array
 */
export const sortBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Group array of objects by key
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Grouped object
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * Remove duplicates from array
 * @param array - Array to deduplicate
 * @param key - Optional key for object comparison
 * @returns Deduplicated array
 */
export const unique = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)]
  }

  const seen = new Set()
  return array.filter(item => {
    const k = item[key]
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/**
 * Download file from URL
 * @param url - File URL
 * @param filename - File name
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copied
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Check if running on mobile device
 * @returns True if mobile
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Generate random color
 * @returns Random hex color
 */
export const randomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

/**
 * Sanitize HTML string
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
  const temp = document.createElement('div')
  temp.textContent = html
  return temp.innerHTML
}

export default {
  formatCurrency,
  parseCurrency,
  formatDate,
  formatDateShort,
  getRelativeTime,
  truncate,
  capitalize,
  titleCase,
  isValidEmail,
  isValidPhone,
  generateId,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  sleep,
  formatFileSize,
  getInitials,
  calculatePercentage,
  sortBy,
  groupBy,
  unique,
  downloadFile,
  copyToClipboard,
  isMobile,
  randomColor,
  sanitizeHTML,
}

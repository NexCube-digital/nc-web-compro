/**
 * Application Constants
 * Centralized configuration for the NexCube Digital application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// Polling Configuration
export const POLLING_CONFIG = {
  DASHBOARD_STATS: 10000, // 10 seconds
  NOTIFICATIONS: 30000, // 30 seconds
  REAL_TIME_DATA: 5000, // 5 seconds
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_VISIBLE_PAGES: 5,
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
  LOCALE: 'id-ID',
} as const

// Currency
export const CURRENCY = {
  CODE: 'IDR',
  SYMBOL: 'Rp',
  LOCALE: 'id-ID',
  DECIMAL_PLACES: 0,
} as const

// Invoice Status
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const

export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.DRAFT]: 'Draft',
  [INVOICE_STATUS.SENT]: 'Terkirim',
  [INVOICE_STATUS.PAID]: 'Lunas',
  [INVOICE_STATUS.OVERDUE]: 'Terlambat',
  [INVOICE_STATUS.CANCELLED]: 'Dibatalkan',
} as const

export const INVOICE_STATUS_COLORS = {
  [INVOICE_STATUS.DRAFT]: 'bg-slate-100 text-slate-700',
  [INVOICE_STATUS.SENT]: 'bg-blue-100 text-blue-700',
  [INVOICE_STATUS.PAID]: 'bg-green-100 text-green-700',
  [INVOICE_STATUS.OVERDUE]: 'bg-red-100 text-red-700',
  [INVOICE_STATUS.CANCELLED]: 'bg-gray-100 text-gray-700',
} as const

// Finance Types
export const FINANCE_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const

export const FINANCE_TYPE_LABELS = {
  [FINANCE_TYPE.INCOME]: 'Pemasukan',
  [FINANCE_TYPE.EXPENSE]: 'Pengeluaran',
} as const

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
} as const

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.USER]: 'User',
  [USER_ROLES.MANAGER]: 'Manager',
} as const

// Package Types
export const PACKAGE_TYPES = {
  WEBSITE: 'website',
  DESAIN: 'desain',
  EVENT: 'event',
  KATALOG: 'katalog',
  UNDANGAN: 'undangan',
} as const

export const PACKAGE_TYPE_LABELS = {
  [PACKAGE_TYPES.WEBSITE]: 'Website',
  [PACKAGE_TYPES.DESAIN]: 'Desain Grafis',
  [PACKAGE_TYPES.EVENT]: 'Event',
  [PACKAGE_TYPES.KATALOG]: 'Katalog Digital',
  [PACKAGE_TYPES.UNDANGAN]: 'Undangan Digital',
} as const

// Animation Durations (milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  STAGGER: 100,
} as const

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebarOpen',
  LANGUAGE: 'language',
} as const

// Toast Notification Duration
export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 5000,
} as const

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+62|62|0)[0-9]{9,12}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
} as const

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  FORBIDDEN: 'Anda tidak memiliki akses untuk melakukan aksi ini.',
  NOT_FOUND: 'Data tidak ditemukan.',
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  VALIDATION_ERROR: 'Data yang Anda masukkan tidak valid.',
  TIMEOUT: 'Permintaan memakan waktu terlalu lama. Silakan coba lagi.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Data berhasil ditambahkan!',
  UPDATED: 'Data berhasil diperbarui!',
  DELETED: 'Data berhasil dihapus!',
  SENT: 'Data berhasil dikirim!',
  SAVED: 'Data berhasil disimpan!',
} as const

// Application Metadata
export const APP_META = {
  NAME: 'NexCube Digital',
  DESCRIPTION: 'Platform manajemen digital untuk bisnis modern',
  VERSION: '1.0.0',
  AUTHOR: 'NexCube Digital Team',
  CONTACT_EMAIL: 'admin@nexcube.digital',
  CONTACT_PHONE: '+62 123 4567 890',
  ADDRESS: 'Indonesia',
  SOCIAL: {
    FACEBOOK: 'https://facebook.com/nexcubedigital',
    INSTAGRAM: 'https://instagram.com/nexcubedigital',
    TWITTER: 'https://twitter.com/nexcubedigital',
    LINKEDIN: 'https://linkedin.com/company/nexcubedigital',
  },
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CLIENTS: '/dashboard/clients',
  INVOICES: '/dashboard/invoices',
  FINANCES: '/dashboard/finances',
  REPORTS: '/dashboard/reports',
  TEAM: '/dashboard/team',
  PACKAGES: '/dashboard/paket',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  HELP: '/dashboard/help',
} as const

export default {
  API_CONFIG,
  POLLING_CONFIG,
  PAGINATION,
  DATE_FORMATS,
  CURRENCY,
  INVOICE_STATUS,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_COLORS,
  FINANCE_TYPE,
  FINANCE_TYPE_LABELS,
  USER_ROLES,
  USER_ROLE_LABELS,
  PACKAGE_TYPES,
  PACKAGE_TYPE_LABELS,
  ANIMATION,
  BREAKPOINTS,
  STORAGE_KEYS,
  TOAST_DURATION,
  VALIDATION,
  FILE_UPLOAD,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  APP_META,
  ROUTES,
}

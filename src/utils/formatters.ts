import type { RiskLevel, MitigationStatus, QuestionStatus, RiskStatus } from '@/types'

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    return formatRelativeDate(d)
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' }

  return d.toLocaleDateString('en-US', options)
}

/**
 * Format a date relative to now (e.g., "2 days ago", "in 3 weeks")
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`
  if (diffWeek < 4) return `${diffWeek} week${diffWeek !== 1 ? 's' : ''} ago`
  if (diffMonth < 12) return `${diffMonth} month${diffMonth !== 1 ? 's' : ''} ago`
  return `${diffYear} year${diffYear !== 1 ? 's' : ''} ago`
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Get Tailwind CSS classes for risk level badge
 */
export function getRiskLevelClasses(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    'Very High': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    High: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    Medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    Low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  }
  return classes[level] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
}

/**
 * Get Tailwind CSS classes for mitigation status badge
 */
export function getMitigationStatusClasses(status: MitigationStatus): string {
  const classes: Record<MitigationStatus, string> = {
    'Not Started': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    Ongoing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    Completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
}

/**
 * Get Tailwind CSS classes for question status badge
 */
export function getQuestionStatusClasses(status: QuestionStatus): string {
  const classes: Record<QuestionStatus, string> = {
    Open: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    Answered: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    Closed: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
}

/**
 * Get Tailwind CSS classes for risk status badge
 */
export function getRiskStatusClasses(status: RiskStatus): string {
  const classes: Record<RiskStatus, string> = {
    Draft: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    Published: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    Locked: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Get color from hex color code
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Formatting utilities used across the frontend.
 */

/**
 * Format a number as USD currency.
 * @param {number} amount
 * @returns {string}  e.g. "$29.99"
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Format a file size in bytes to a human-readable string.
 * @param {number} bytes
 * @returns {string}  e.g. "4.2 MB"
 */
export function formatFileSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`
  return `${(bytes / 1073741824).toFixed(2)} GB`
}

/**
 * Format a date string to a human-readable relative time.
 * @param {string} dateString
 * @returns {string}  e.g. "3 days ago"
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '—'

  const date  = new Date(dateString)
  const now   = new Date()
  const diffMs = now - date
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours   = Math.floor(diffMinutes / 60)
  const diffDays    = Math.floor(diffHours / 24)

  if (diffSeconds < 60)  return 'just now'
  if (diffMinutes < 60)  return `${diffMinutes}m ago`
  if (diffHours < 24)    return `${diffHours}h ago`
  if (diffDays < 7)      return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Format a date string to a full readable date.
 * @param {string} dateString
 * @returns {string}  e.g. "March 6, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return '—'

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day:   'numeric',
    year:  'numeric',
  })
}

/**
 * Truncate a string to a maximum length.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 100) {
  if (!str) return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Generate star rating display string.
 * @param {number} rating  1-5
 * @returns {string}  e.g. "★★★★☆"
 */
export function formatStars(rating) {
  const filled = Math.round(rating)
  return '★'.repeat(filled) + '☆'.repeat(5 - filled)
}
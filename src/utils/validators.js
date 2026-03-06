/**
 * Form validation helpers.
 * Each returns null if valid or an error message string if invalid.
 */

export const required = (value) =>
  value !== null && value !== undefined && String(value).trim() !== ''
    ? null
    : 'This field is required.'

export const minLength = (min) => (value) =>
  !value || String(value).length >= min
    ? null
    : `Must be at least ${min} characters.`

export const maxLength = (max) => (value) =>
  !value || String(value).length <= max
    ? null
    : `Cannot exceed ${max} characters.`

export const isEmail = (value) =>
  !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : 'Please enter a valid email address.'

export const isUrl = (value) => {
  if (!value) return null
  try {
    new URL(value)
    return null
  } catch {
    return 'Please enter a valid URL.'
  }
}

export const minValue = (min) => (value) =>
  !value || parseFloat(value) >= min
    ? null
    : `Must be at least ${min}.`

export const confirmed = (original) => (value) =>
  value === original
    ? null
    : 'The confirmation does not match.'
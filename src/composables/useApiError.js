/**
 * useApiError
 *
 * Extracts a human-readable error message from a normalised API error.
 * Works with the shape returned by the Axios client interceptor:
 * { message, errors, status }
 */
export function useApiError() {
  function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
    if (!err) return fallback

    // Field-level validation errors — join the first error from each field
    if (err.errors && Object.keys(err.errors).length) {
      return Object.values(err.errors)
        .map((msgs) => (Array.isArray(msgs) ? msgs[0] : msgs))
        .join(' ')
    }

    return err.message || fallback
  }

  function getFieldErrors(err) {
    if (!err?.errors) return {}

    const result = {}
    Object.entries(err.errors).forEach(([key, msgs]) => {
      result[key] = Array.isArray(msgs) ? msgs[0] : msgs
    })
    return result
  }

  return { getErrorMessage, getFieldErrors }
}
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationsApi } from '@/api/notifications'

/**
 * Notifications store — manages the unread count for the nav bell.
 * The full notification list is fetched on demand by the page component.
 */
export const useNotificationsStore = defineStore('notifications', () => {
  const unreadCount = ref(0)
  const polling     = ref(null)

  async function fetchUnreadCount() {
    try {
      const response = await notificationsApi.unreadCount()
      unreadCount.value = response.data.data.unread_count
    } catch {
      // Silently fail — unread count is non-critical
    }
  }

  /**
   * Start polling the unread count every 30 seconds.
   * Called after the user logs in.
   */
  function startPolling() {
    fetchUnreadCount()
    polling.value = setInterval(fetchUnreadCount, 30000)
  }

  /**
   * Stop polling.
   * Called when the user logs out.
   */
  function stopPolling() {
    if (polling.value) {
      clearInterval(polling.value)
      polling.value = null
    }
    unreadCount.value = 0
  }

  function decrement(by = 1) {
    unreadCount.value = Math.max(0, unreadCount.value - by)
  }

  function reset() {
    unreadCount.value = 0
  }

  return {
    unreadCount,
    fetchUnreadCount,
    startPolling,
    stopPolling,
    decrement,
    reset,
  }
})
<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'

const auth          = useAuthStore()
const notifications = useNotificationsStore()

/**
 * On app boot:
 * 1. Restore session if a token exists in localStorage
 * 2. Start notification polling if user is authenticated
 */
onMounted(async () => {
  if (auth.token) {
    await auth.fetchUser()

    if (auth.isAuthenticated) {
      notifications.startPolling()
    }
  }
})
</script>
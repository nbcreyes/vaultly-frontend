<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const auth          = useAuthStore()
const notifications = useNotificationsStore()

onMounted(async () => {
  if (auth.token) {
    await auth.fetchUser()
    if (auth.isAuthenticated) {
      notifications.startPolling()
    }
  }
})
</script>
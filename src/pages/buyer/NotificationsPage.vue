<template>
  <PublicLayout>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
        <button
          v-if="hasUnread"
          @click="markAllRead"
          class="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Mark all as read
        </button>
      </div>

      <LoadingSpinner v-if="loading" />

      <EmptyState
        v-else-if="notifications.length === 0"
        title="No notifications"
        description="You are all caught up."
      />

      <div v-else class="space-y-2">
        <div
          v-for="n in notifications"
          :key="n.id"
          @click="handleClick(n)"
          class="card p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
          :class="{ 'bg-brand-50 border-brand-100': !n.is_read }"
        >
          <!-- Icon dot -->
          <div class="mt-1 shrink-0">
            <div
              class="w-2.5 h-2.5 rounded-full mt-1"
              :class="n.is_read ? 'bg-gray-200' : 'bg-brand-500'"
            />
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ n.title }}</p>
            <p class="text-sm text-gray-500 mt-0.5">{{ n.body }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ formatRelativeTime(n.created_at) }}</p>
          </div>
        </div>

        <Pagination
          v-if="lastPage > 1"
          :current-page="currentPage"
          :last-page="lastPage"
          @change="fetchNotifications"
        />
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { notificationsApi } from '@/api/notifications'
import { useNotificationsStore } from '@/stores/notifications'
import { formatRelativeTime } from '@/utils/format'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'

const router        = useRouter()
const notifStore    = useNotificationsStore()

const loading       = ref(true)
const notifications = ref([])
const currentPage   = ref(1)
const lastPage      = ref(1)

const hasUnread = computed(() => notifications.value.some((n) => !n.is_read))

async function fetchNotifications(page = 1) {
  loading.value     = true
  currentPage.value = page
  try {
    const response      = await notificationsApi.list({ page })
    const data          = response.data
    notifications.value = data.data
    lastPage.value      = data.meta?.last_page || 1
    currentPage.value   = data.meta?.current_page || 1
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function markAllRead() {
  try {
    await notificationsApi.markAllRead()
    notifications.value.forEach((n) => (n.is_read = true))
    notifStore.reset()
  } catch (err) {
    console.error(err)
  }
}

async function handleClick(n) {
  if (!n.is_read) {
    await notificationsApi.markRead(n.id)
    n.is_read = true
    notifStore.decrement(1)
  }

  // Navigate based on notification type
  const data = n.data || {}
  if (data.order_id)   router.push(`/messages/${data.order_id}`)
  if (data.product_id) router.push(`/product/${data.product_id}`)
  if (data.refund_id)  router.push('/refunds')
  if (data.payout_id)  router.push('/seller/payouts')
}

onMounted(() => fetchNotifications())
</script>
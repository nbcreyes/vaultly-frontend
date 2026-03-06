<template>
  <PublicLayout>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <h1 class="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

      <LoadingSpinner v-if="loading" />

      <EmptyState
        v-else-if="threads.length === 0"
        title="No messages yet"
        description="Messages from your orders will appear here."
      />

      <div v-else class="space-y-2">
        <RouterLink
          v-for="thread in threads"
          :key="thread.order_id"
          :to="`/messages/${thread.order_id}`"
          class="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          :class="{ 'bg-brand-50 border-brand-100': thread.unread_count > 0 }"
        >
          <!-- Avatar -->
          <div class="shrink-0">
            <img
              v-if="thread.other_party?.avatar_url"
              :src="thread.other_party.avatar_url"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div v-else class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
              <span class="text-brand-600 text-sm font-semibold">
                {{ thread.other_party?.name?.charAt(0) }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-0.5">
              <p class="text-sm font-semibold text-gray-900">{{ thread.other_party?.name }}</p>
              <p class="text-xs text-gray-400">{{ formatRelativeTime(thread.last_message?.sent_at) }}</p>
            </div>
            <p class="text-xs text-gray-500 mb-0.5">Order {{ thread.order_number }}</p>
            <p class="text-sm text-gray-600 truncate">
              <span v-if="thread.last_message?.is_mine" class="text-gray-400">You: </span>
              {{ thread.last_message?.body }}
            </p>
          </div>

          <!-- Unread badge -->
          <div v-if="thread.unread_count > 0" class="shrink-0">
            <span class="bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {{ thread.unread_count }}
            </span>
          </div>
        </RouterLink>
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { messagesApi } from '@/api/messages'
import { formatRelativeTime } from '@/utils/format'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const loading = ref(true)
const threads = ref([])

onMounted(async () => {
  try {
    const response = await messagesApi.inbox()
    threads.value  = response.data.data?.threads || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
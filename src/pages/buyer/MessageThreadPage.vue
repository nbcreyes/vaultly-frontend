<template>
  <PublicLayout>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div class="flex items-center gap-3 mb-6">
        <RouterLink to="/messages" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </RouterLink>
        <div>
          <h1 class="text-lg font-semibold text-gray-900">{{ otherPartyName }}</h1>
          <p class="text-xs text-gray-400">Order {{ orderNumber }}</p>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else class="flex flex-col gap-3 mb-6" ref="messagesEl">
        <EmptyState
          v-if="messages.length === 0"
          title="No messages yet"
          description="Send the first message below."
        />

        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex"
          :class="msg.is_mine ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-xs sm:max-w-md rounded-2xl px-4 py-2.5 text-sm"
            :class="msg.is_mine
              ? 'bg-brand-600 text-white rounded-br-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'"
          >
            <p class="leading-relaxed">{{ msg.body }}</p>
            <p
              class="text-xs mt-1 opacity-70 text-right"
              :class="msg.is_mine ? 'text-brand-100' : 'text-gray-400'"
            >
              {{ formatRelativeTime(msg.sent_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Compose -->
      <div class="card p-4 flex gap-3 sticky bottom-4">
        <textarea
          v-model="newMessage"
          class="input flex-1 resize-none min-h-[44px] max-h-32"
          placeholder="Type a message..."
          rows="1"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim() || sending"
          class="btn-primary px-4 self-end"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { messagesApi } from '@/api/messages'
import { formatRelativeTime } from '@/utils/format'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useAuthStore } from '@/stores/auth'

const route   = useRoute()
const auth    = useAuthStore()
const orderId = route.params.orderId

const loading     = ref(true)
const messages    = ref([])
const newMessage  = ref('')
const sending     = ref(false)
const orderNumber = ref('')
const messagesEl  = ref(null)

const otherPartyName = computed(() => {
  const other = messages.value.find((m) => !m.is_mine)
  return other?.sender?.name || 'Support'
})

async function fetchThread() {
  loading.value = true
  try {
    const response  = await messagesApi.thread(orderId)
    const data      = response.data.data
    messages.value  = data.messages || []
    orderNumber.value = data.order_number || ''
    await messagesApi.markRead(orderId)
    scrollToBottom()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || sending.value) return
  sending.value = true
  const body = newMessage.value.trim()
  newMessage.value = ''
  try {
    const response = await messagesApi.send(orderId, { body })
    messages.value.push(response.data.data.message)
    scrollToBottom()
  } catch (err) {
    newMessage.value = body
    console.error(err)
  } finally {
    sending.value = false
  }
}

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

onMounted(fetchThread)
</script>
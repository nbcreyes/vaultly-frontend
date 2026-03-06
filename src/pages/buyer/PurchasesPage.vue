<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <h1 class="text-2xl font-bold text-gray-900 mb-6">My Purchases</h1>

      <LoadingSpinner v-if="loading" />

      <EmptyState
        v-else-if="items.length === 0"
        title="No purchases yet"
        description="Browse the marketplace and find something you love."
      >
        <RouterLink to="/browse" class="btn-primary mt-2">Browse products</RouterLink>
      </EmptyState>

      <div v-else class="space-y-4">
        <div
          v-for="item in items"
          :key="item.id"
          class="card p-5 flex flex-col sm:flex-row gap-4"
        >
          <div class="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
            <img
              v-if="item.product?.thumbnail"
              :src="item.product.thumbnail"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 mb-1">{{ item.product?.title }}</h3>
            <p class="text-sm text-gray-500 mb-3">
              Purchased {{ formatDate(item.purchased_at) }} ·
              <span class="font-medium text-gray-700">{{ formatPrice(item.price) }}</span>
            </p>

            <div class="flex flex-wrap gap-2 items-center">

              
                v-if="item.download_token && item.status !== 'refunded'"
                :href="`${apiBase}/downloads/${item.download_token}`"
                target="_blank"
                class="btn-primary btn-sm"
              >
                ↓ Download
              </a>

              <button
                v-if="item.can_regenerate && item.status !== 'refunded'"
                @click="handleRegenerate(item)"
                :disabled="regeneratingId === item.id"
                class="btn-secondary btn-sm"
              >
                {{ regeneratingId === item.id ? 'Generating...' : 'New link' }}
              </button>

              <span v-if="item.status === 'refunded'" class="badge-red">
                Refunded
              </span>

              <span
                v-if="item.download_token && item.token_expires_at"
                class="text-xs text-gray-400"
              >
                Link expires {{ formatRelativeTime(item.token_expires_at) }}
              </span>

              <button
                v-if="item.status !== 'refunded' && item.within_window"
                @click="openRefund(item)"
                class="ml-auto text-xs text-red-500 hover:text-red-700 underline"
              >
                Request refund
              </button>

            </div>
          </div>
        </div>

        <Pagination
          v-if="lastPage > 1"
          :current-page="currentPage"
          :last-page="lastPage"
          @change="fetchPurchases"
        />
      </div>

      <!-- Refund modal -->
      <div
        v-if="refundItem"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
        @click.self="refundItem = null"
      >
        <div class="card p-6 w-full max-w-md">
          <h2 class="font-semibold text-gray-900 mb-1">Request a refund</h2>
          <p class="text-sm text-gray-500 mb-4">
            For <strong>{{ refundItem.product?.title }}</strong>
          </p>

          <AlertBanner
            v-if="refundError"
            variant="error"
            :message="refundError"
            class="mb-4"
          />

          <label class="label">Reason <span class="text-gray-400 font-normal">(min 20 characters)</span></label>
          <textarea
            v-model="refundReason"
            class="input min-h-[100px] resize-none"
            placeholder="Describe the issue with your purchase..."
          />

          <div class="flex gap-3 mt-4">
            <button @click="refundItem = null" class="btn-secondary flex-1">Cancel</button>
            <button
              @click="submitRefund"
              :disabled="refundReason.length < 20 || refundLoading"
              class="btn-danger flex-1"
            >
              {{ refundLoading ? 'Submitting...' : 'Submit request' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { buyerApi } from '@/api/buyer'
import { formatDate, formatPrice, formatRelativeTime } from '@/utils/format'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'
import AlertBanner from '@/components/ui/AlertBanner.vue'

const apiBase = import.meta.env.VITE_API_URL?.replace('/v1', '') || 'http://localhost:8000/api'

const loading       = ref(true)
const items         = ref([])
const currentPage   = ref(1)
const lastPage      = ref(1)
const regeneratingId = ref(null)

const refundItem    = ref(null)
const refundReason  = ref('')
const refundError   = ref('')
const refundLoading = ref(false)

async function fetchPurchases(page = 1) {
  loading.value     = true
  currentPage.value = page
  try {
    const response    = await buyerApi.purchases({ page })
    const data        = response.data
    items.value       = data.data
    lastPage.value    = data.meta?.last_page || 1
    currentPage.value = data.meta?.current_page || 1
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function handleRegenerate(item) {
  regeneratingId.value = item.id
  try {
    const response = await buyerApi.regenerateDownload(item.id)
    const newToken = response.data.data?.download_token
    if (newToken) {
      item.download_token = newToken
    }
  } catch (err) {
    console.error(err)
  } finally {
    regeneratingId.value = null
  }
}

function openRefund(item) {
  refundItem.value   = item
  refundReason.value = ''
  refundError.value  = ''
}

async function submitRefund() {
  refundError.value  = ''
  refundLoading.value = true
  try {
    await buyerApi.requestRefund({
      order_item_id: refundItem.value.id,
      reason:        refundReason.value,
    })
    refundItem.value.within_window = false
    refundItem.value = null
  } catch (err) {
    refundError.value = err.message || 'Failed to submit refund request.'
  } finally {
    refundLoading.value = false
  }
}

onMounted(() => fetchPurchases())
</script>
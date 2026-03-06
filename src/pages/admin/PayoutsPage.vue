<template>
  <AdminLayout>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Payout Requests</h1>

      <div class="flex gap-3 mb-6">
        <select v-model="statusFilter" class="input w-36" @change="fetch()">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <LoadingSpinner v-if="loading" />
      <EmptyState v-else-if="payouts.length === 0" title="No payouts" description="No payout requests found." />

      <div v-else class="space-y-4">
        <div v-for="payout in payouts" :key="payout.id" class="card p-5">
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-semibold text-gray-900">{{ formatPrice(payout.amount) }}</p>
              <p class="text-sm text-gray-500">{{ payout.seller_name }} · {{ payout.paypal_email }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(payout.created_at) }}</p>
            </div>
            <span class="badge capitalize"
              :class="{
                'badge-yellow': payout.status === 'pending',
                'badge-green':  payout.status === 'paid',
                'badge-red':    payout.status === 'rejected',
              }">{{ payout.status }}</span>
          </div>

          <div v-if="payout.status === 'pending'" class="flex gap-2">
            <div class="flex gap-2 flex-1">
              <input v-model="paypalIds[payout.id]" type="text" class="input text-sm flex-1" placeholder="PayPal payout ID (required to mark paid)" />
              <button
                @click="process(payout, 'paid')"
                :disabled="!paypalIds[payout.id]"
                class="btn-primary btn-sm"
              >Mark paid</button>
            </div>
            <button @click="process(payout, 'rejected')" class="btn-danger btn-sm">Reject</button>
          </div>
        </div>

        <Pagination v-if="lastPage > 1" :current-page="currentPage" :last-page="lastPage" @change="fetch" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { adminApi } from '@/api/admin'
import { formatDate, formatPrice } from '@/utils/format'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'

const loading      = ref(true)
const payouts      = ref([])
const statusFilter = ref('pending')
const currentPage  = ref(1)
const lastPage     = ref(1)
const paypalIds    = reactive({})

async function fetch(page = 1) {
  loading.value = true
  try {
    const params = { page }
    if (statusFilter.value) params.status = statusFilter.value
    const response    = await adminApi.getPayouts(params)
    const data        = response.data
    payouts.value     = data.data
    lastPage.value    = data.meta?.last_page || 1
    currentPage.value = data.meta?.current_page || 1
  } catch (err) { console.error(err) } finally {
    loading.value = false
  }
}

async function process(payout, decision) {
  try {
    await adminApi.processPayout(payout.id, {
      decision,
      paypal_payout_id: paypalIds[payout.id] || undefined,
    })
    payout.status = decision
  } catch (err) { console.error(err) }
}

onMounted(() => fetch())
</script>
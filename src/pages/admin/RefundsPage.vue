<template>
  <AdminLayout>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Refund Requests</h1>

      <div class="flex gap-3 mb-6">
        <select v-model="statusFilter" class="input w-36" @change="fetch()">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <LoadingSpinner v-if="loading" />
      <EmptyState v-else-if="refunds.length === 0" title="No refunds" description="No refund requests found." />

      <div v-else class="space-y-4">
        <div v-for="refund in refunds" :key="refund.id" class="card p-5">
          <div class="flex items-start justify-between mb-2">
            <div>
              <p class="font-semibold text-gray-900">{{ refund.product_title }}</p>
              <p class="text-sm text-gray-500">{{ refund.buyer_name }} · {{ formatPrice(refund.amount) }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(refund.created_at) }}</p>
            </div>
            <span class="badge capitalize"
              :class="{
                'badge-yellow': refund.status === 'pending',
                'badge-green':  refund.status === 'approved',
                'badge-red':    refund.status === 'rejected',
              }">{{ refund.status }}</span>
          </div>

          <p class="text-sm text-gray-600 mb-3">{{ refund.reason }}</p>

          <div v-if="refund.status === 'pending'" class="flex gap-2">
            <button @click="process(refund, 'approved')" class="btn-primary btn-sm">Approve & Refund</button>
            <div class="flex gap-2 flex-1">
              <input v-model="adminNotes[refund.id]" type="text" class="input text-sm flex-1" placeholder="Note to buyer (optional)" />
              <button @click="process(refund, 'rejected')" class="btn-danger btn-sm">Reject</button>
            </div>
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
const refunds      = ref([])
const statusFilter = ref('pending')
const currentPage  = ref(1)
const lastPage     = ref(1)
const adminNotes   = reactive({})

async function fetch(page = 1) {
  loading.value = true
  try {
    const params = { page, per_page: 20 }
    if (statusFilter.value) params.status = statusFilter.value
    const response    = await adminApi.getRefunds(params)
    const data        = response.data
    refunds.value     = data.data
    lastPage.value    = data.meta?.last_page || 1
    currentPage.value = data.meta?.current_page || 1
  } catch (err) { console.error(err) } finally {
    loading.value = false
  }
}

async function process(refund, decision) {
  try {
    await adminApi.processRefund(refund.id, {
      decision,
      admin_note: adminNotes[refund.id] || undefined,
    })
    refund.status = decision
  } catch (err) { console.error(err) }
}

onMounted(() => fetch())
</script>
<template>
  <PublicLayout>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <h1 class="text-2xl font-bold text-gray-900 mb-6">My Refunds</h1>

      <LoadingSpinner v-if="loading" />

      <EmptyState
        v-else-if="refunds.length === 0"
        title="No refund requests"
        description="You have not submitted any refund requests."
      />

      <div v-else class="space-y-4">
        <div v-for="refund in refunds" :key="refund.id" class="card p-5">
          <div class="flex items-start justify-between mb-2">
            <div>
              <p class="font-semibold text-gray-900">{{ refund.product_title }}</p>
              <p class="text-sm text-gray-400 mt-0.5">Submitted {{ formatDate(refund.created_at) }}</p>
            </div>
            <span
              class="badge capitalize"
              :class="{
                'badge-yellow': refund.status === 'pending',
                'badge-green':  refund.status === 'approved',
                'badge-red':    refund.status === 'rejected',
              }"
            >
              {{ refund.status }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mt-2">{{ refund.reason }}</p>
          <div v-if="refund.admin_note" class="mt-2 p-3 bg-gray-50 rounded-lg">
            <p class="text-xs font-medium text-gray-500 mb-1">Admin note</p>
            <p class="text-sm text-gray-600">{{ refund.admin_note }}</p>
          </div>
        </div>
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { buyerApi } from '@/api/buyer'
import { formatDate } from '@/utils/format'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const loading = ref(true)
const refunds = ref([])

onMounted(async () => {
  try {
    const response = await buyerApi.refunds()
    refunds.value  = response.data.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <SellerLayout>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Payouts</h1>

      <div class="card p-6 mb-6">
        <p class="text-sm text-gray-500 mb-1">Available balance</p>
        <p class="text-3xl font-bold text-gray-900 mb-4">{{ formatPrice(balance) }}</p>

        <AlertBanner v-if="requestSuccess" variant="success" message="Payout requested. An admin will process it shortly." class="mb-4" />
        <AlertBanner v-if="requestError"   variant="error"   :message="requestError"   class="mb-4" />

        <div class="flex gap-3 items-end">
          <div class="flex-1">
            <label class="label">Amount to withdraw</label>
            <input
              v-model="amount"
              type="number"
              class="input"
              :placeholder="`Min $10 · Max ${formatPrice(balance)}`"
              min="10"
              :max="balance"
            />
          </div>
          <button
            @click="requestPayout"
            :disabled="requesting || !amount || parseFloat(amount) < 10 || parseFloat(amount) > balance"
            class="btn-primary"
          >
            {{ requesting ? 'Requesting...' : 'Request payout' }}
          </button>
        </div>
      </div>

      <h2 class="font-semibold text-gray-900 mb-3">Payout History</h2>

      <LoadingSpinner v-if="loading" />

      <EmptyState
        v-else-if="payouts.length === 0"
        title="No payouts yet"
        description="Request a payout when your balance reaches $10."
      />

      <div v-else class="space-y-3">
        <div v-for="payout in payouts" :key="payout.id" class="card p-4 flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900">{{ formatPrice(payout.amount) }}</p>
            <p class="text-sm text-gray-400">{{ formatDate(payout.created_at) }}</p>
          </div>
          <span
            class="badge capitalize"
            :class="{
              'badge-yellow': payout.status === 'pending',
              'badge-green':  payout.status === 'paid',
              'badge-red':    payout.status === 'rejected',
            }"
          >
            {{ payout.status }}
          </span>
        </div>
      </div>
    </div>
  </SellerLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { sellerApi } from '@/api/seller'
import { formatPrice, formatDate } from '@/utils/format'
import SellerLayout from '@/components/layout/SellerLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AlertBanner from '@/components/ui/AlertBanner.vue'

const loading        = ref(true)
const payouts        = ref([])
const balance        = ref(0)
const amount         = ref('')
const requesting     = ref(false)
const requestSuccess = ref(false)
const requestError   = ref('')

onMounted(async () => {
  try {
    const [summaryRes, payoutsRes] = await Promise.all([
      sellerApi.dashboardSummary(),
      sellerApi.getPayouts(),
    ])
    balance.value = summaryRes.data.data?.balance?.available ?? summaryRes.data.data?.available_balance ?? 0
    payouts.value = payoutsRes.data.data || []
  } catch (err) { console.error(err) } finally {
    loading.value = false
  }
})

async function requestPayout() {
  requesting.value     = true
  requestSuccess.value = false
  requestError.value   = ''
  try {
    await sellerApi.requestPayout({ amount: parseFloat(amount.value) })
    balance.value       -= parseFloat(amount.value)
    amount.value        = ''
    requestSuccess.value = true
    const response      = await sellerApi.getPayouts()
    payouts.value       = response.data.data || []
  } catch (err) {
    requestError.value = err.message || 'Failed to request payout.'
  } finally {
    requesting.value = false
  }
}
</script>
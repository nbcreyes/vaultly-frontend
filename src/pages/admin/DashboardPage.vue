<template>
  <AdminLayout>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h1>

      <LoadingSpinner v-if="loading" />

      <div v-else>

        <!-- Summary cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="card p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Platform Revenue</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatPrice(summary.revenue?.total_platform) }}</p>
            <p class="text-xs mt-1" :class="summary.revenue?.change_percent >= 0 ? 'text-green-600' : 'text-red-500'">
              {{ summary.revenue?.change_percent >= 0 ? '+' : '' }}{{ summary.revenue?.change_percent }}% this month
            </p>
          </div>
          <div class="card p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Total Orders</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.orders?.total }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ summary.orders?.this_month }} this month</p>
          </div>
          <div class="card p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Total Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.users?.total }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ summary.users?.new_this_month }} new this month</p>
          </div>
          <div class="card p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Pending Actions</p>
            <p class="text-2xl font-bold text-red-600">{{ summary.pending_actions?.total }}</p>
            <p class="text-xs text-gray-400 mt-1">Require attention</p>
          </div>
        </div>

        <!-- Pending actions breakdown -->
        <div class="card p-6 mb-8">
          <h2 class="font-semibold text-gray-900 mb-4">Pending Actions</h2>
          <div class="grid grid-cols-3 gap-4">
            <RouterLink to="/admin/applications" class="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <p class="text-2xl font-bold text-yellow-700">{{ summary.pending_actions?.seller_applications }}</p>
              <p class="text-sm text-yellow-600 mt-1">Seller applications</p>
            </RouterLink>
            <RouterLink to="/admin/refunds" class="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <p class="text-2xl font-bold text-red-700">{{ summary.pending_actions?.refunds }}</p>
              <p class="text-sm text-red-600 mt-1">Refund requests</p>
            </RouterLink>
            <RouterLink to="/admin/payouts" class="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <p class="text-2xl font-bold text-blue-700">{{ summary.pending_actions?.payouts }}</p>
              <p class="text-sm text-blue-600 mt-1">Payout requests</p>
            </RouterLink>
          </div>
        </div>

        <!-- Top sellers -->
        <div class="card p-6">
          <h2 class="font-semibold text-gray-900 mb-4">Top Sellers</h2>
          <div class="space-y-3">
            <div v-for="(seller, i) in topSellers" :key="seller.seller_id" class="flex items-center gap-3">
              <span class="text-sm font-medium text-gray-400 w-5">{{ i + 1 }}</span>
              <div class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                <span class="text-xs font-semibold text-brand-600">{{ seller.name?.charAt(0) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ seller.store_name || seller.name }}</p>
                <p class="text-xs text-gray-400">{{ seller.total_sales }} sales</p>
              </div>
              <p class="text-sm font-semibold text-gray-900">{{ formatPrice(seller.total_earned) }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin'
import { formatPrice } from '@/utils/format'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const loading    = ref(true)
const summary    = ref({})
const topSellers = ref([])

onMounted(async () => {
  try {
    const [summaryRes, sellersRes] = await Promise.all([
      adminApi.summary(),
      adminApi.topSellers({ limit: 5 }),
    ])
    summary.value    = summaryRes.data.data    || {}
    topSellers.value = sellersRes.data.data?.sellers || []
  } catch (err) { console.error(err) } finally {
    loading.value = false
  }
})
</script>
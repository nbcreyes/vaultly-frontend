<template>
  <SellerLayout>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <LoadingSpinner v-if="loading" />

      <div v-else>
        <!-- Summary cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="card p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Balance</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatPrice(summary.available_balance) }}</p>
          </div>
          <div class="card p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Total Earned</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatPrice(summary.total_earned) }}</p>
          </div>
          <div class="card p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Total Sales</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.total_sales }}</p>
          </div>
          <div class="card p-5">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Avg Rating</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ summary.average_rating ? summary.average_rating + ' ★' : '—' }}
            </p>
          </div>
        </div>

        <!-- Revenue chart (simple bar) -->
        <div class="card p-6 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-gray-900">Revenue</h2>
            <select v-model="revenuePeriod" @change="fetchRevenue" class="input w-28 text-sm">
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
              <option value="12m">12 months</option>
            </select>
          </div>

          <div v-if="revenueLoading" class="h-32 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>

          <div v-else-if="revenueSeries.length" class="flex items-end gap-1 h-32">
            <div
              v-for="(point, i) in revenueSeries"
              :key="i"
              class="flex-1 bg-brand-100 hover:bg-brand-300 rounded-t transition-colors relative group"
              :style="{ height: barHeight(point.revenue) }"
            >
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
                {{ formatPrice(point.revenue) }}
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-500 mt-2 text-right">
            Total: <span class="font-semibold text-gray-900">{{ formatPrice(revenueTotal) }}</span>
          </p>
        </div>

        <!-- Top products -->
        <div class="card p-6 mb-8">
          <h2 class="font-semibold text-gray-900 mb-4">Top Products</h2>
          <div v-if="topProducts.length" class="space-y-3">
            <div v-for="p in topProducts" :key="p.id" class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                <img v-if="p.thumbnail" :src="p.thumbnail" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ p.title }}</p>
                <p class="text-xs text-gray-400">{{ p.sales_count }} sales</p>
              </div>
              <p class="text-sm font-semibold text-gray-900 shrink-0">{{ formatPrice(p.total_revenue) }}</p>
            </div>
          </div>
          <EmptyState v-else title="No sales yet" description="Your top products will appear here." />
        </div>

        <!-- Recent sales -->
        <div class="card p-6">
          <h2 class="font-semibold text-gray-900 mb-4">Recent Sales</h2>
          <div v-if="recentSales.length" class="space-y-3">
            <div v-for="sale in recentSales" :key="sale.id" class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ sale.product?.title }}</p>
                <p class="text-xs text-gray-400">{{ formatRelativeTime(sale.purchased_at) }}</p>
              </div>
              <p class="text-sm font-semibold text-green-600">+{{ formatPrice(sale.seller_earnings) }}</p>
            </div>
          </div>
          <EmptyState v-else title="No sales yet" description="Your recent sales will appear here." />
        </div>

      </div>
    </div>
  </SellerLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { sellerApi } from '@/api/seller'
import { formatPrice, formatRelativeTime } from '@/utils/format'
import SellerLayout from '@/components/layout/SellerLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const loading       = ref(true)
const revenueLoading = ref(false)
const summary       = ref({})
const recentSales   = ref([])
const topProducts   = ref([])
const revenueSeries = ref([])
const revenueTotal  = ref(0)
const revenuePeriod = ref('30d')

function barHeight(value) {
  const max = Math.max(...revenueSeries.value.map((p) => p.revenue), 1)
  const pct = Math.max((value / max) * 100, 2)
  return pct + '%'
}

async function fetchRevenue() {
  revenueLoading.value = true
  try {
    const response   = await sellerApi.dashboardRevenue({ period: revenuePeriod.value })
    const data       = response.data.data
    revenueSeries.value = data.series  || []
    revenueTotal.value  = data.total_revenue || 0
  } catch { /* non-critical */ } finally {
    revenueLoading.value = false
  }
}

onMounted(async () => {
  try {
    const [summaryRes, salesRes, topRes] = await Promise.all([
      sellerApi.dashboardSummary(),
      sellerApi.dashboardSales({ per_page: 5 }),
      sellerApi.dashboardTopProducts({ limit: 5 }),
    ])
    summary.value     = summaryRes.data.data   || {}
    recentSales.value = salesRes.data.data     || []
    topProducts.value = topRes.data.data?.products || []
    await fetchRevenue()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
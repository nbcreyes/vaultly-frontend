<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <div class="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">

      <!-- Sidebar -->
      <aside class="hidden lg:block w-56 shrink-0">
        <nav class="space-y-1 sticky top-24">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Seller
          </p>

          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="sidebar-link"
            :class="{ 'sidebar-link-active': isActive(item.to) }"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>

      <!-- Mobile nav -->
      <div class="lg:hidden w-full mb-4">
        <div class="flex gap-2 overflow-x-auto pb-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
            :class="isActive(item.to)
              ? 'bg-brand-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </div>

      <!-- Main content -->
      <main class="flex-1 min-w-0">
        <slot />
      </main>

    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './Navbar.vue'

const route = useRoute()
function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
}

const IconChart = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])
const IconBox = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })
])
const IconStore = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' }),
  h('polyline', { points: '9 22 9 12 15 12 15 22', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2' })
])
const IconCash = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' })
])

const navItems = [
  { to: '/seller/dashboard', label: 'Dashboard', icon: IconChart },
  { to: '/seller/products',  label: 'Products',  icon: IconBox   },
  { to: '/seller/store',     label: 'Store',     icon: IconStore },
  { to: '/seller/payouts',   label: 'Payouts',   icon: IconCash  },
]
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors;
}
.sidebar-link-active {
  @apply bg-brand-50 text-brand-700 hover:bg-brand-50 hover:text-brand-700;
}
</style>
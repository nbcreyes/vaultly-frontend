<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <div
      class="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8"
    >
      <!-- Sidebar -->
      <aside class="hidden lg:block w-56 shrink-0">
        <nav class="space-y-1 sticky top-24">
          <p
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3"
          >
            Admin
          </p>
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="sidebar-link"
            :class="{ 'sidebar-link-active': isActive(item.to) }"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            <span>{{ item.label }}</span>
            <span
              v-if="item.badge && item.badge > 0"
              class="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ item.badge > 9 ? "9+" : item.badge }}
            </span>
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
            :class="
              isActive(item.to)
                ? 'bg-brand-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            "
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
import { h, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { adminApi } from "@/api/admin";
import Navbar from "./Navbar.vue";

const route = useRoute();
const pendingCounts = ref({ applications: 0, refunds: 0, payouts: 0 });

function isActive(path) {
  return route.path === path || route.path.startsWith(path + "/");
}

onMounted(async () => {
  try {
    const response = await adminApi.summary();
    const pending = response.data.data.pending_actions;
    pendingCounts.value = {
      applications: pending.seller_applications,
      refunds: pending.refunds,
      payouts: pending.payouts,
    };
  } catch {
    /* non-critical */
  }
});

const IconChart = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    }),
  ]);
const IconUsers = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    }),
  ]);
const IconBox = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    }),
  ]);
const IconClipboard = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    }),
  ]);
const IconRefresh = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    }),
  ]);
const IconCash = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    }),
  ]);

const navItems = computed(() => [
  { to: "/admin/dashboard", label: "Dashboard", icon: IconChart, badge: 0 },
  { to: "/admin/users", label: "Users", icon: IconUsers, badge: 0 },
  { to: "/admin/products", label: "Products", icon: IconBox, badge: 0 },
  {
    to: "/admin/applications",
    label: "Applications",
    icon: IconClipboard,
    badge: pendingCounts.value.applications,
  },
  {
    to: "/admin/refunds",
    label: "Refunds",
    icon: IconRefresh,
    badge: pendingCounts.value.refunds,
  },
  {
    to: "/admin/payouts",
    label: "Payouts",
    icon: IconCash,
    badge: pendingCounts.value.payouts,
  },
]);
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors;
}
.sidebar-link-active {
  @apply bg-brand-50 text-brand-700 hover:bg-brand-50 hover:text-brand-700;
}
</style>

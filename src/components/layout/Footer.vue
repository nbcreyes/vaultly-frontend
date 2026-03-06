<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <RouterLink to="/" class="flex items-center gap-2 mb-4">
            <div
              class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">V</span>
            </div>
            <span class="font-bold text-xl text-gray-900">Vaultly</span>
          </RouterLink>
          <p class="text-sm text-gray-500 leading-relaxed">
            The marketplace for premium digital assets. Buy and sell code,
            design, documents, and more.
          </p>
        </div>

        <!-- Marketplace -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Marketplace</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/browse" class="footer-link"
                >Browse All</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="{ name: 'browse', query: { category: 'code' } }"
                class="footer-link"
                >Code & Scripts</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="{ name: 'browse', query: { category: 'design' } }"
                class="footer-link"
                >Design Assets</RouterLink
              >
            </li>
            <li>
              <RouterLink
                :to="{ name: 'browse', query: { category: 'education' } }"
                class="footer-link"
                >Education</RouterLink
              >
            </li>
          </ul>
        </div>

        <!-- Sellers -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Sellers</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/become-seller" class="footer-link"
                >Start Selling</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/seller/dashboard" class="footer-link"
                >Dashboard</RouterLink
              >
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Support</h3>
          <ul class="space-y-2">
            <li>
              <a href="mailto:support@vaultly.com" class="footer-link"
                >Contact Us</a
              >
            </li>
            <li>
              <RouterLink to="/refunds" class="footer-link"
                >Refund Policy</RouterLink
              >
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <p class="text-sm text-gray-500">
          © {{ new Date().getFullYear() }} Vaultly. All rights reserved.
        </p>
        <p class="text-xs text-gray-400">
          10% platform commission on all sales.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  @apply text-sm text-gray-500 hover:text-gray-900 transition-colors;
}
</style>

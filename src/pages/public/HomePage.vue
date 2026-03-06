<template>
  <PublicLayout>
    <div class="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Vaultly</h1>
      <p class="text-lg text-gray-500">The marketplace for premium digital assets.</p>
      <RouterLink to="/browse" class="btn-primary btn-lg mt-8 inline-flex">
        Browse Products
      </RouterLink>
    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '@/components/layout/PublicLayout.vue'
</script>
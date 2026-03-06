<template>
  <PublicLayout>
    <div class="max-w-2xl mx-auto px-4 py-32 text-center">
      <p class="text-8xl font-bold text-brand-200 mb-4">404</p>
      <h1 class="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
      <p class="text-gray-500 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <div class="flex gap-3 justify-center">
        <RouterLink to="/" class="btn-primary">Go home</RouterLink>
        <RouterLink to="/browse" class="btn-secondary">Browse products</RouterLink>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '@/components/layout/PublicLayout.vue'
</script>
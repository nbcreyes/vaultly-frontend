<template>
  <RouterLink
    :to="{ name: 'product', params: { slug: product.slug } }"
    class="card overflow-hidden hover:shadow-md hover:border-brand-200 transition-all group block"
  >
    <!-- Thumbnail -->
    <div class="aspect-video bg-gray-100 overflow-hidden">
      <img
        v-if="product.thumbnail || product.images?.[0]?.url"
        :src="product.thumbnail || product.images[0].url"
        :alt="product.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <!-- Category badge -->
      <span v-if="product.category" class="badge-gray text-xs mb-2 inline-block">
        {{ product.category?.name || product.category }}
      </span>

      <!-- Title -->
      <h3 class="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-brand-600 transition-colors">
        {{ product.title }}
      </h3>

      <!-- Seller -->
      <p v-if="product.seller_name || product.seller?.store_name" class="text-xs text-gray-400 mb-3">
        by {{ product.seller_name || product.seller?.store_name || product.seller?.name }}
      </p>

      <!-- Rating and sales -->
      <div class="flex items-center gap-2 mb-3">
        <div v-if="product.average_rating" class="flex items-center gap-1">
          <span class="text-yellow-400 text-xs">★</span>
          <span class="text-xs font-medium text-gray-700">{{ product.average_rating }}</span>
          <span class="text-xs text-gray-400">({{ product.review_count || 0 }})</span>
        </div>
        <span v-if="product.sales_count" class="text-xs text-gray-400">
          {{ product.sales_count }} sold
        </span>
      </div>

      <!-- Price -->
      <div class="flex items-center justify-between">
        <span class="text-lg font-bold text-gray-900">
          {{ formatPrice(product.price) }}
        </span>
        <span class="badge-gray text-xs capitalize">
          {{ product.license_type || 'commercial' }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { formatPrice } from '@/utils/format'

defineProps({
  product: { type: Object, required: true },
})
</script>
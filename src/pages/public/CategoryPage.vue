<template>
  <PublicLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div class="mb-8">
        <RouterLink to="/browse" class="text-sm text-brand-600 hover:text-brand-700 mb-2 inline-block">
          ← Back to browse
        </RouterLink>
        <h1 class="text-3xl font-bold text-gray-900 capitalize">
          {{ route.params.category.replace(/-/g, ' ') }}
        </h1>
        <p class="text-gray-500 mt-1">{{ total }} products</p>
      </div>

      <LoadingSpinner v-if="loading" />

      <EmptyState
        v-else-if="products.length === 0"
        title="No products in this category"
        description="Check back later or browse other categories."
      >
        <RouterLink to="/browse" class="btn-secondary">Browse all</RouterLink>
      </EmptyState>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>

        <Pagination
          v-if="lastPage > 1"
          :current-page="currentPage"
          :last-page="lastPage"
          @change="fetchProducts"
          class="mt-8"
        />
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { browseApi } from '@/api/browse'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'

const route       = useRoute()
const loading     = ref(true)
const products    = ref([])
const total       = ref(0)
const currentPage = ref(1)
const lastPage    = ref(1)

async function fetchProducts(page = 1) {
  loading.value     = true
  currentPage.value = page
  try {
    const response    = await browseApi.categoryProducts(route.params.category, { page, per_page: 12 })
    const data        = response.data
    products.value    = data.data
    total.value       = data.meta?.total     || 0
    lastPage.value    = data.meta?.last_page  || 1
    currentPage.value = data.meta?.current_page || 1
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

watch(() => route.params.category, () => fetchProducts(1))
onMounted(() => fetchProducts())
</script>
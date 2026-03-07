<template>
  <PublicLayout>

    <LoadingSpinner v-if="loading" full-page />

    <div v-else-if="!store" class="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Store not found</h1>
      <RouterLink to="/browse" class="btn-primary mt-4">Browse products</RouterLink>
    </div>

    <div v-else>

      <!-- Store banner -->
      <div class="relative h-56 bg-gradient-to-r from-brand-600 to-brand-800 overflow-hidden">
        <img
          v-if="store.banner_url"
          :src="store.banner_url"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Store header -->
        <div class="flex items-end gap-5 -mt-10 mb-8 pt-2">
          <div class="w-24 h-24 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
            <img
              v-if="store.logo_url"
              :src="store.logo_url"
              :alt="store.store_name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-brand-100 flex items-center justify-center">
              <span class="text-3xl font-bold text-brand-600">
                {{ store.store_name?.charAt(0) }}
              </span>
            </div>
          </div>
          <div class="pb-1">
            <h1 class="text-2xl font-bold text-gray-900">{{ store.store_name }}</h1>
            <div class="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span>{{ store.total_sales || 0 }} sales</span>
              <span v-if="store.average_rating">
                ★ {{ store.average_rating }}
              </span>
              <span>{{ products.length }} products</span>
            </div>
          </div>
        </div>

        <!-- Bio -->
        <p v-if="store.store_description" class="text-gray-600 mb-8 max-w-2xl">{{ store.store_description }}</p>

        <!-- Products -->
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Products</h2>

        <LoadingSpinner v-if="productsLoading" />

        <EmptyState
          v-else-if="products.length === 0"
          title="No products yet"
          description="This seller hasn't listed any products yet."
        />

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>

      </div>
    </div>

  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { browseApi } from '@/api/browse'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route          = useRoute()
const loading        = ref(true)
const productsLoading = ref(false)
const store          = ref(null)
const products       = ref([])

onMounted(async () => {
  try {
    const response = await browseApi.store(route.params.slug)
    const data     = response.data.data
    store.value    = data.store || data

    // products is paginated: { data: [...], meta: ... }
    const raw      = data.products
    products.value = Array.isArray(raw) ? raw : (raw?.data || [])

    // Normalise each product so ProductCard gets a thumbnail
    products.value = products.value.map(p => ({
      ...p,
      thumbnail: p.thumbnail || p.images?.[0]?.url || null,
    }))
  } catch {
    store.value = null
  } finally {
    loading.value = false
  }
})
</script>
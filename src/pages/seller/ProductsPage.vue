<template>
  <SellerLayout>
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <RouterLink to="/seller/products/create" class="btn-primary btn-sm">
          + New product
        </RouterLink>
      </div>

      <LoadingSpinner v-if="loading" />

      <EmptyState
        v-else-if="products.length === 0"
        title="No products yet"
        description="Create your first product to start selling."
      >
        <RouterLink to="/seller/products/create" class="btn-primary mt-2">Create product</RouterLink>
      </EmptyState>

      <div v-else class="space-y-3">
        <div
          v-for="product in products"
          :key="product.id"
          class="card p-4 flex gap-4 items-center"
        >
          <div class="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
            <img v-if="product.thumbnail" :src="product.thumbnail" class="w-full h-full object-cover" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">{{ product.title }}</p>
            <p class="text-sm text-gray-400 mt-0.5">
              {{ formatPrice(product.price) }} ·
              {{ product.sales_count }} sales ·
              <span
                class="capitalize"
                :class="{
                  'text-green-600':  product.status === 'published',
                  'text-yellow-600': product.status === 'draft',
                  'text-gray-400':   product.status === 'unpublished',
                }"
              >{{ product.status }}</span>
            </p>
          </div>

          <div class="flex gap-2 shrink-0">
            <RouterLink
              :to="`/seller/products/${product.id}/edit`"
              class="btn-secondary btn-sm"
            >
              Edit
            </RouterLink>
            <button
              v-if="product.status !== 'published'"
              @click="publish(product)"
              class="btn-primary btn-sm"
            >
              Publish
            </button>
            <button
              v-else
              @click="unpublish(product)"
              class="btn-secondary btn-sm"
            >
              Unpublish
            </button>
          </div>
        </div>

        <Pagination
          v-if="lastPage > 1"
          :current-page="currentPage"
          :last-page="lastPage"
          @change="fetchProducts"
        />
      </div>
    </div>
  </SellerLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { sellerApi } from '@/api/seller'
import { formatPrice } from '@/utils/format'
import SellerLayout from '@/components/layout/SellerLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'

const loading     = ref(true)
const products    = ref([])
const currentPage = ref(1)
const lastPage    = ref(1)

async function fetchProducts(page = 1) {
  loading.value = true
  currentPage.value = page
  try {
    const response    = await sellerApi.getProducts({ page })
    const data        = response.data
    products.value    = data.data
    lastPage.value    = data.meta?.last_page || 1
    currentPage.value = data.meta?.current_page || 1
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function publish(product) {
  try {
    await sellerApi.publishProduct(product.id)
    product.status = 'published'
  } catch (err) { console.error(err) }
}

async function unpublish(product) {
  try {
    await sellerApi.unpublishProduct(product.id)
    product.status = 'unpublished'
  } catch (err) { console.error(err) }
}

onMounted(() => fetchProducts())
</script>
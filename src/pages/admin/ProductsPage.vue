<template>
  <AdminLayout>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Product Moderation</h1>

      <div class="flex flex-wrap gap-3 mb-6">
        <input v-model="search" type="text" class="input w-56" placeholder="Search title..." @input="debouncedFetch" />
        <select v-model="statusFilter" class="input w-36" @change="fetch()">
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      <LoadingSpinner v-if="loading" />
      <EmptyState v-else-if="products.length === 0" title="No products" description="No products match your filters." />

      <div v-else class="space-y-3">
        <div v-for="product in products" :key="product.id" class="card p-4 flex gap-4 items-center">
          <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
            <img v-if="product.thumbnail" :src="product.thumbnail" class="w-full h-full object-cover" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">{{ product.title }}</p>
            <p class="text-sm text-gray-400">{{ product.seller?.store_name || product.seller?.name }} · {{ formatPrice(product.price) }}</p>
          </div>

          <span class="badge capitalize shrink-0"
            :class="{
              'badge-green':  product.status === 'published',
              'badge-yellow': product.status === 'draft',
              'badge-gray':   product.status === 'unpublished',
            }">{{ product.status }}</span>

          <div class="shrink-0">
            <button
              v-if="product.status === 'published'"
              @click="updateStatus(product, 'unpublished')"
              class="btn-danger btn-sm"
            >Unpublish</button>
            <button
              v-else
              @click="updateStatus(product, 'published')"
              class="btn-primary btn-sm"
            >Publish</button>
          </div>
        </div>

        <Pagination v-if="lastPage > 1" :current-page="currentPage" :last-page="lastPage" @change="fetch" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { adminApi } from '@/api/admin'
import { formatPrice } from '@/utils/format'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'

const loading      = ref(true)
const products     = ref([])
const search       = ref('')
const statusFilter = ref('')
const currentPage  = ref(1)
const lastPage     = ref(1)

const debouncedFetch = useDebounceFn(() => fetch(1), 400)

async function fetch(page = 1) {
  loading.value = true
  currentPage.value = page
  try {
    const params = { page }
    if (search.value)       params.q      = search.value
    if (statusFilter.value) params.status = statusFilter.value
    const response    = await adminApi.getProducts(params)
    const data        = response.data
    products.value    = data.data
    lastPage.value    = data.meta?.last_page || 1
    currentPage.value = data.meta?.current_page || 1
  } catch (err) { console.error(err) } finally {
    loading.value = false
  }
}

async function updateStatus(product, status) {
  try {
    await adminApi.updateProductStatus(product.id, { status })
    product.status = status
  } catch (err) { console.error(err) }
}

onMounted(() => fetch())
</script>
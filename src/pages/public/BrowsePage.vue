<template>
  <PublicLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Page header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Browse Products</h1>
        <p class="text-gray-500 mt-1">{{ total }} products available</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">

        <!-- Filters sidebar -->
        <aside class="w-full lg:w-56 shrink-0">
          <div class="card p-5 space-y-6 sticky top-24">

            <div>
              <label class="label">Search</label>
              <input
                v-model="filters.q"
                type="text"
                class="input"
                placeholder="Search products..."
                @input="debouncedFetch"
              />
            </div>

            <div>
              <label class="label">Category</label>
              <select v-model="filters.category" class="input" @change="fetchProducts">
                <option value="">All categories</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.slug">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="label">Price range</label>
              <div class="flex gap-2">
                <input
                  v-model="filters.min_price"
                  type="number"
                  class="input"
                  placeholder="Min"
                  min="0"
                  @change="fetchProducts"
                />
                <input
                  v-model="filters.max_price"
                  type="number"
                  class="input"
                  placeholder="Max"
                  min="0"
                  @change="fetchProducts"
                />
              </div>
            </div>

            <div>
              <label class="label">License</label>
              <select v-model="filters.license" class="input" @change="fetchProducts">
                <option value="">Any license</option>
                <option value="personal">Personal</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <button @click="resetFilters" class="btn-secondary w-full text-sm">
              Reset filters
            </button>

          </div>
        </aside>

        <!-- Products area -->
        <div class="flex-1 min-w-0">

          <!-- Sort bar -->
          <div class="flex items-center justify-between mb-6">
            <p class="text-sm text-gray-500">
              Showing {{ products.length }} of {{ total }} results
            </p>
            <select v-model="filters.sort" class="input w-40 text-sm" @change="fetchProducts">
              <option value="newest">Newest</option>
              <option value="best_selling">Best selling</option>
              <option value="top_rated">Top rated</option>
              <option value="price_asc">Price: Low to high</option>
              <option value="price_desc">Price: High to low</option>
            </select>
          </div>

          <LoadingSpinner v-if="loading" />

          <EmptyState
            v-else-if="!loading && products.length === 0"
            title="No products found"
            description="Try adjusting your search or filters."
          />

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
            @change="goToPage"
            class="mt-8"
          />

        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { browseApi } from '@/api/browse'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'

const route  = useRoute()
const router = useRouter()

const loading     = ref(false)
const products    = ref([])
const categories  = ref([])
const total       = ref(0)
const currentPage = ref(1)
const lastPage    = ref(1)

const filters = reactive({
  q:         route.query.q        || '',
  category:  route.query.category || '',
  min_price: route.query.min_price|| '',
  max_price: route.query.max_price|| '',
  license:   route.query.license  || '',
  sort:      route.query.sort     || 'newest',
})

const debouncedFetch = useDebounceFn(fetchProducts, 400)

async function fetchProducts(page = 1) {
  loading.value = true
  currentPage.value = page

  // Sync filters to URL query params
  const query = {}
  Object.entries(filters).forEach(([k, v]) => { if (v) query[k] = v })
  if (page > 1) query.page = page
  router.replace({ query })

  try {
    const params = { ...filters, page, per_page: 12 }
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k] })

    const response    = await browseApi.products(params)
    const data        = response.data
    products.value    = data.data
    total.value       = data.meta?.total    || 0
    lastPage.value    = data.meta?.last_page || 1
    currentPage.value = data.meta?.current_page || 1
  } catch (err) {
    console.error('Failed to fetch products', err)
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const response  = await browseApi.categories()
    categories.value = response.data.data || []
  } catch { /* non-critical */ }
}

function resetFilters() {
  Object.assign(filters, {
    q: '', category: '', min_price: '', max_price: '', license: '', sort: 'newest',
  })
  fetchProducts(1)
}

function goToPage(page) {
  fetchProducts(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>
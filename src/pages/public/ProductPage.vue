<template>
  <PublicLayout>

    <LoadingSpinner v-if="loading" full-page />

    <div v-else-if="!product" class="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
      <RouterLink to="/browse" class="btn-primary mt-4">Browse products</RouterLink>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col lg:flex-row gap-10">

        <!-- Left: Images and description -->
        <div class="flex-1 min-w-0">

          <!-- Image gallery -->
          <div class="card overflow-hidden mb-6">
            <div class="aspect-video bg-gray-100">
              <img
                v-if="activeImage"
                :src="activeImage"
                :alt="product.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <!-- Thumbnails -->
            <div v-if="product.images?.length > 1" class="flex gap-2 p-3 overflow-x-auto border-t border-gray-100">
              <button
                v-for="(img, i) in product.images"
                :key="i"
                @click="activeImage = img.url"
                class="w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors"
                :class="activeImage === img.url ? 'border-brand-500' : 'border-transparent'"
              >
                <img :src="img.url" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Description -->
          <div class="card p-6 mb-6">
            <h2 class="font-semibold text-gray-900 mb-3">Description</h2>
            <div class="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
              {{ product.description }}
            </div>
          </div>

          <!-- Reviews -->
          <div class="card p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-semibold text-gray-900">
                Reviews
                <span class="text-gray-400 font-normal ml-1">({{ reviewMeta.total || 0 }})</span>
              </h2>
              <div v-if="product.average_rating" class="flex items-center gap-1.5">
                <span class="text-yellow-400">★</span>
                <span class="font-semibold text-gray-900">{{ product.average_rating }}</span>
                <span class="text-gray-400 text-sm">/ 5</span>
              </div>
            </div>

            <LoadingSpinner v-if="reviewsLoading" size="sm" />

            <EmptyState
              v-else-if="reviews.length === 0"
              title="No reviews yet"
              description="Be the first to review this product."
            />

            <div v-else class="space-y-6">
              <div v-for="review in reviews" :key="review.id" class="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                      <span class="text-brand-600 text-xs font-semibold">
                        {{ review.buyer?.name?.charAt(0) }}
                      </span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ review.buyer?.name }}</p>
                      <p class="text-xs text-gray-400">{{ formatRelativeTime(review.created_at) }}</p>
                    </div>
                  </div>
                  <div class="text-yellow-400 text-sm">
                    {{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}
                  </div>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{{ review.body }}</p>

                <!-- Seller reply -->
                <div v-if="review.seller_reply" class="mt-3 ml-4 pl-4 border-l-2 border-gray-200">
                  <p class="text-xs font-medium text-gray-500 mb-1">Seller reply</p>
                  <p class="text-sm text-gray-600">{{ review.seller_reply }}</p>
                </div>
              </div>
            </div>

            <Pagination
              v-if="reviewMeta.last_page > 1"
              :current-page="reviewMeta.current_page"
              :last-page="reviewMeta.last_page"
              @change="fetchReviews"
              class="mt-4"
            />
          </div>

        </div>

        <!-- Right: Purchase card -->
        <div class="w-full lg:w-80 shrink-0">
          <div class="card p-6 sticky top-24">

            <!-- Title and category -->
            <span v-if="product.category" class="badge-gray mb-2 inline-block">
              {{ product.category }}
            </span>
            <h1 class="text-xl font-bold text-gray-900 mb-1">{{ product.title }}</h1>
            <p class="text-sm text-gray-500 mb-4">{{ product.short_description }}</p>

            <!-- Rating -->
            <div v-if="product.average_rating" class="flex items-center gap-2 mb-4">
              <div class="flex text-yellow-400 text-sm">
                {{ '★'.repeat(Math.round(product.average_rating)) }}{{ '☆'.repeat(5 - Math.round(product.average_rating)) }}
              </div>
              <span class="text-sm text-gray-600">{{ product.average_rating }}</span>
              <span class="text-sm text-gray-400">({{ product.review_count }} reviews)</span>
            </div>

            <!-- Price -->
            <div class="text-3xl font-bold text-gray-900 mb-6">
              {{ formatPrice(product.price) }}
            </div>

            <!-- Buy button -->
            <button
              v-if="!product.has_purchased"
              @click="handleBuy"
              class="btn-primary w-full btn-lg mb-3"
            >
              Buy Now
            </button>
            <div v-else class="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 text-center mb-3 font-medium">
              ✓ Already purchased
            </div>

            <!-- Product details -->
            <div class="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4 mt-4">
              <div class="flex justify-between">
                <span class="text-gray-400">File type</span>
                <span class="font-medium uppercase">{{ product.file_type }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">File size</span>
                <span class="font-medium">{{ formatFileSize(product.file_size) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Version</span>
                <span class="font-medium">{{ product.version || '1.0.0' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">License</span>
                <span class="font-medium capitalize">{{ product.license_type }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Downloads</span>
                <span class="font-medium">{{ product.sales_count }}</span>
              </div>
            </div>

            <!-- Seller info -->
            <div v-if="product.seller" class="border-t border-gray-100 pt-4 mt-4">
              <RouterLink
                :to="{ name: 'store', params: { slug: product.seller.store_slug || product.seller.slug } }"
                class="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
              >
                <img
                  v-if="product.seller.avatar_url"
                  :src="product.seller.avatar_url"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div v-else class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <span class="text-brand-600 text-sm font-semibold">
                    {{ product.seller.name?.charAt(0) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ product.seller.store_name || product.seller.name }}</p>
                  <p class="text-xs text-gray-400">{{ product.seller.total_sales || 0 }} sales</p>
                </div>
              </RouterLink>
            </div>

          </div>
        </div>

      </div>
    </div>

  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { browseApi } from '@/api/browse'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { formatPrice, formatFileSize, formatRelativeTime } from '@/utils/format'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'

const route  = useRoute()
const router = useRouter()
const cart   = useCartStore()
const auth   = useAuthStore()

const loading       = ref(true)
const reviewsLoading = ref(false)
const product       = ref(null)
const activeImage   = ref(null)
const reviews       = ref([])
const reviewMeta    = ref({ total: 0, current_page: 1, last_page: 1 })

async function fetchProduct() {
  loading.value = true
  try {
    const response = await browseApi.productDetail(route.params.slug)
    product.value  = response.data.data
    activeImage.value = product.value.images?.[0]?.url || null
    await fetchReviews()
  } catch {
    product.value = null
  } finally {
    loading.value = false
  }
}

async function fetchReviews(page = 1) {
  reviewsLoading.value = true
  try {
    const response   = await browseApi.productReviews(route.params.slug, { page, per_page: 5 })
    reviews.value    = response.data.data
    reviewMeta.value = response.data.meta
  } catch { /* non-critical */ } finally {
    reviewsLoading.value = false
  }
}

function handleBuy() {
  if (!auth.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  cart.clearCart()
  cart.addItem(product.value)
  router.push({ name: 'checkout' })
}

onMounted(fetchProduct)
</script>
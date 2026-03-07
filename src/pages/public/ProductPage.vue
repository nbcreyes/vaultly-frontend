<template>
  <PublicLayout>
    <div v-if="loading" class="flex justify-center py-24">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="!product" class="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
      <p class="text-gray-500 mb-6">
        This product may have been removed or unpublished.
      </p>
      <RouterLink to="/browse" class="btn-primary">Browse products</RouterLink>
    </div>

    <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- ── Left column: images + description ─────────────────── -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Image gallery -->
          <div>
            <div
              class="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-3"
            >
              <img
                v-if="activeImage"
                :src="activeImage"
                :alt="product.title"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-300"
              >
                <svg
                  class="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <!-- Thumbnails -->
            <div v-if="product.images?.length > 1" class="flex gap-2">
              <button
                v-for="img in product.images"
                :key="img.id"
                @click="activeImage = img.url"
                class="w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors"
                :class="
                  activeImage === img.url
                    ? 'border-brand-500'
                    : 'border-transparent'
                "
              >
                <img :src="img.url" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Title + meta -->
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <RouterLink
                v-if="product.category?.slug"
                :to="`/browse/${product.category.slug}`"
                class="badge-blue text-xs"
              >
                {{ product.category?.name }}
              </RouterLink>
              <span class="badge-gray text-xs uppercase">{{
                product.license_type
              }}</span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {{ product.title }}
            </h1>

            <p class="text-gray-500 mb-4">{{ product.short_description }}</p>

            <!-- Rating row -->
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <template v-for="n in 5" :key="n">
                  <svg
                    class="w-4 h-4"
                    :class="
                      n <= Math.round(product.average_rating)
                        ? 'text-amber-400'
                        : 'text-gray-200'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </template>
                <span class="ml-1 font-medium text-gray-700">{{
                  Number(product.average_rating).toFixed(1)
                }}</span>
              </div>
              <span
                >{{ product.review_count }} review{{
                  product.review_count !== 1 ? "s" : ""
                }}</span
              >
              <span>{{ product.sales_count }} sales</span>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="product.tags?.length" class="flex flex-wrap gap-2">
            <span
              v-for="tag in product.tags"
              :key="tag.id"
              class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{{ tag.name }}
            </span>
          </div>

          <!-- Description -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <div
              class="prose prose-sm max-w-none text-gray-600 whitespace-pre-line"
            >
              {{ product.description }}
            </div>
          </div>

          <!-- Reviews -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Reviews
              <span class="text-gray-400 font-normal text-base ml-1"
                >({{ product.review_count }})</span
              >
            </h2>

            <div v-if="reviews.length === 0" class="text-gray-400 text-sm py-4">
              No reviews yet. Be the first to leave one.
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="review in reviews"
                :key="review.id"
                class="border-b border-gray-100 pb-6 last:border-0"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0"
                  >
                    <span class="text-brand-600 text-xs font-semibold">
                      {{ review.buyer?.name?.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ review.buyer?.name }}
                    </p>
                    <div class="flex items-center gap-1">
                      <template v-for="n in 5" :key="n">
                        <svg
                          class="w-3 h-3"
                          :class="
                            n <= review.rating
                              ? 'text-amber-400'
                              : 'text-gray-200'
                          "
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      </template>
                    </div>
                  </div>
                  <span class="ml-auto text-xs text-gray-400">{{
                    formatDate(review.created_at)
                  }}</span>
                </div>

                <p class="text-sm text-gray-700 mb-3">{{ review.body }}</p>

                <!-- Seller reply -->
                <div
                  v-if="review.seller_reply"
                  class="ml-4 pl-4 border-l-2 border-gray-200"
                >
                  <p class="text-xs font-medium text-gray-500 mb-1">
                    Seller reply
                  </p>
                  <p class="text-sm text-gray-600">{{ review.seller_reply }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Right column: purchase card ────────────────────────── -->
        <div class="lg:col-span-1">
          <div class="card p-6 sticky top-24 space-y-5">
            <!-- Price -->
            <div>
              <p class="text-3xl font-bold text-gray-900">
                {{ formatPrice(product.price) }}
              </p>
              <p class="text-sm text-gray-400 mt-1">
                One-time purchase · Instant download
              </p>
            </div>

            <!-- Already purchased -->
            <div
              v-if="product.has_purchased"
              class="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-3"
            >
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span class="text-sm font-medium">Already purchased</span>
            </div>

            <!-- Buy button -->
            <button
              v-else
              @click="handleBuy"
              class="btn-primary w-full text-center"
            >
              Buy Now
            </button>

            <!-- File info -->
            <div class="space-y-2 pt-2 border-t border-gray-100">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">File type</span>
                <span class="font-medium text-gray-700 uppercase">{{
                  product.file_type
                }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">File size</span>
                <span class="font-medium text-gray-700">{{
                  formatFileSize(product.file_size)
                }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Version</span>
                <span class="font-medium text-gray-700">{{
                  product.version
                }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">License</span>
                <span class="font-medium text-gray-700 capitalize">{{
                  product.license_type
                }}</span>
              </div>
            </div>

            <!-- Seller info -->
            <div class="pt-2 border-t border-gray-100">
              <p class="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                Sold by
              </p>
              <RouterLink
                v-if="product.seller?.store?.store_slug"
                :to="{
                  name: 'store',
                  params: { slug: product.seller.store.store_slug },
                }"
                class="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
              >
                <div
                  class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0"
                >
                  <img
                    v-if="product.seller.avatar_url"
                    :src="product.seller.avatar_url"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <span v-else class="text-brand-600 text-sm font-semibold">
                    {{ product.seller.name?.charAt(0) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ product.seller.store.store_name }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ product.seller.store.total_sales || 0 }} sales
                  </p>
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
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { browseApi } from "@/api/browse";
import { useAuthStore } from "@/stores/auth";
import { formatDate, formatPrice } from "@/utils/format";
import PublicLayout from "@/components/layout/PublicLayout.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const loading = ref(true);
const product = ref(null);
const activeImage = ref(null);
const reviews = ref([]);
const reviewMeta = ref({ total: 0, current_page: 1, last_page: 1 });

// ── Helpers ────────────────────────────────────────────────────────────────

function formatFileSize(bytes) {
  if (!bytes) return "—";
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${(bytes / 1_000).toFixed(0)} KB`;
}

// ── Data ───────────────────────────────────────────────────────────────────

async function fetchProduct() {
  loading.value = true;
  try {
    const res = await browseApi.productDetail(route.params.slug);
    const payload = res.data.data; // { product, has_purchased, has_reviewed }

    product.value = payload.product;
    product.value.has_purchased = payload.has_purchased;
    product.value.has_reviewed = payload.has_reviewed;

    activeImage.value = product.value.images?.[0]?.url || null;

    // Reviews are included in the product response
    reviews.value = product.value.reviews || [];
    reviewMeta.value = {
      total: product.value.review_count || 0,
      current_page: 1,
      last_page: 1,
    };
  } catch {
    product.value = null;
  } finally {
    loading.value = false;
  }
}

// ── Actions ────────────────────────────────────────────────────────────────

function handleBuy() {
  if (!auth.isAuthenticated) {
    router.push({ name: "login", query: { redirect: route.fullPath } });
    return;
  }
  router.push({
    name: "checkout",
    query: { product_id: product.value.id },
  });
}

// ── Lifecycle ──────────────────────────────────────────────────────────────

onMounted(fetchProduct);

// Re-fetch if the slug changes (e.g. navigating between products)
watch(
  () => route.params.slug,
  (newSlug, oldSlug) => {
    if (newSlug && newSlug !== oldSlug) fetchProduct();
  },
);
</script>

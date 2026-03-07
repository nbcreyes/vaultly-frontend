<template>
  <PublicLayout>
    <!-- Hero -->
    <section
      class="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20 px-4"
    >
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          Premium Digital Assets<br class="hidden sm:block" />
          for Creators
        </h1>
        <p class="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
          Buy and sell code, design templates, documents, fonts, and more.
          Instant download. 10% commission. No subscriptions.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <RouterLink
            to="/browse"
            class="btn bg-white text-brand-700 hover:bg-brand-50 btn-lg font-semibold"
          >
            Browse Products
          </RouterLink>
          <RouterLink
            to="/become-seller"
            class="btn border-2 border-white text-white hover:bg-white hover:text-brand-700 btn-lg font-semibold"
          >
            Start Selling
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="bg-white border-b border-gray-200">
      <div
        class="max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 divide-x divide-gray-200"
      >
        <div class="text-center px-4">
          <p class="text-2xl font-bold text-gray-900">{{ stats.products }}+</p>
          <p class="text-sm text-gray-500 mt-0.5">Products</p>
        </div>
        <div class="text-center px-4">
          <p class="text-2xl font-bold text-gray-900">{{ stats.sellers }}+</p>
          <p class="text-sm text-gray-500 mt-0.5">Sellers</p>
        </div>
        <div class="text-center px-4">
          <p class="text-2xl font-bold text-gray-900">{{ stats.sales }}+</p>
          <p class="text-sm text-gray-500 mt-0.5">Sales</p>
        </div>
      </div>
    </section>

    <!-- Featured products -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Featured Products</h2>
          <p class="text-gray-500 text-sm mt-1">Handpicked by our team</p>
        </div>
        <RouterLink
          to="/browse"
          class="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          View all →
        </RouterLink>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in featured"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <!-- Categories -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">
          Browse by Category
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <template v-for="cat in categories" :key="cat.id">
            <RouterLink
              v-if="cat && cat.slug"
              :to="{ name: 'category', params: { category: cat.slug } }"
              class="card p-4 text-center hover:shadow-md hover:border-brand-200 transition-all group"
            >
              <div class="text-3xl mb-2">{{ cat.icon || "📦" }}</div>
              <p
                class="text-sm font-medium text-gray-900 group-hover:text-brand-600"
              >
                {{ cat.name }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ cat.products_count }} items
              </p>
            </RouterLink>
          </template>
        </div>
      </div>
    </section>

    <!-- New arrivals -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">New Arrivals</h2>
          <p class="text-gray-500 text-sm mt-1">
            Just added to the marketplace
          </p>
        </div>
        <RouterLink
          :to="{ name: 'browse', query: { sort: 'newest' } }"
          class="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          View all →
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in newArrivals"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-brand-600 text-white py-16 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to start selling?</h2>
        <p class="text-brand-100 mb-8">
          Join hundreds of creators earning passive income by selling digital
          assets on Vaultly.
        </p>
        <RouterLink
          to="/become-seller"
          class="btn bg-white text-brand-700 hover:bg-brand-50 btn-lg font-semibold"
        >
          Apply to Sell
        </RouterLink>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { browseApi } from "@/api/browse";
import PublicLayout from "@/components/layout/PublicLayout.vue";
import ProductCard from "@/components/product/ProductCard.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const loading = ref(true);
const featured = ref([]);
const newArrivals = ref([]);
const categories = ref([]);
const stats = ref({ products: 0, sellers: 0, sales: 0 });

onMounted(async () => {
  try {
    const [featuredRes, categoriesRes] = await Promise.all([
      browseApi.featured(),
      browseApi.categories(),
    ])

    const featuredData    = featuredRes.data.data
    featured.value        = featuredData.top_products || []
    newArrivals.value     = featuredData.new_arrivals  || []

    const catsRaw         = categoriesRes.data.data?.categories ?? []
    categories.value      = Array.isArray(catsRaw) ? catsRaw : []

    stats.value = {
      products: categories.value.reduce((sum, c) => sum + (c.products_count || 0), 0),
      sellers:  Math.max(10, featured.value.length * 3),
      sales:    Math.max(50, featured.value.reduce((sum, p) => sum + (p.sales_count || 0), 0)),
    }
  } catch (err) {
    console.error('Failed to load homepage data', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <h1 class="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <!-- Empty cart -->
      <div v-if="cart.isEmpty" class="card p-12 text-center">
        <p class="text-gray-500 mb-4">Your cart is empty.</p>
        <RouterLink to="/browse" class="btn-primary">Browse products</RouterLink>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8">

        <!-- Order summary -->
        <div class="flex-1">
          <div class="card p-6 mb-4">
            <h2 class="font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div v-for="item in cart.items" :key="item.id" class="flex gap-4 items-center">
              <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img
                  v-if="item.thumbnail || item.images?.[0]?.url"
                  :src="item.thumbnail || item.images[0].url"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ item.title }}</p>
                <p class="text-sm text-gray-500">{{ item.seller?.store_name || item.seller?.name }}</p>
                <p class="text-sm text-gray-400 capitalize">{{ item.license_type }} license</p>
              </div>
              <p class="font-semibold text-gray-900 shrink-0">{{ formatPrice(item.price) }}</p>
            </div>

            <div class="border-t border-gray-100 mt-4 pt-4 flex justify-between">
              <span class="font-semibold text-gray-900">Total</span>
              <span class="font-bold text-xl text-gray-900">{{ formatPrice(cart.total) }}</span>
            </div>
          </div>

          <div class="card p-4 bg-green-50 border-green-200">
            <p class="text-sm text-green-700 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              Secure payment via PayPal. Instant download after purchase.
            </p>
          </div>
        </div>

        <!-- PayPal button -->
        <div class="w-full lg:w-80 shrink-0">
          <div class="card p-6">
            <h2 class="font-semibold text-gray-900 mb-4">Pay with PayPal</h2>

            <AlertBanner
              v-if="errorMessage"
              variant="error"
              :message="errorMessage"
              class="mb-4"
            />

            <AlertBanner
              v-if="successMessage"
              variant="success"
              :message="successMessage"
              class="mb-4"
            />

            <!-- PayPal button container -->
            <div v-if="!orderComplete" id="paypal-button-container" />

            <LoadingSpinner v-if="loadingPayPal && !orderComplete" size="sm" label="Loading PayPal..." class="py-2" />

            <!-- Post-purchase -->
            <div v-if="orderComplete" class="text-center py-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <p class="font-semibold text-gray-900 mb-1">Payment complete!</p>
              <p class="text-sm text-gray-500 mb-4">Your downloads are ready.</p>
              <RouterLink to="/purchases" class="btn-primary w-full block text-center">
                Go to My Purchases
              </RouterLink>
            </div>

            <p class="text-xs text-gray-400 mt-4 text-center">
              By purchasing you agree to our terms of service.
            </p>
          </div>
        </div>

      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { checkoutApi } from '@/api/checkout'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import AlertBanner from '@/components/ui/AlertBanner.vue'

const cart         = useCartStore()
const router       = useRouter()
const loadingPayPal = ref(true)
const errorMessage  = ref('')
const successMessage = ref('')
const orderComplete = ref(false)
let paypalScript    = null

function loadPayPalScript() {
  return new Promise((resolve, reject) => {
    if (window.paypal) { resolve(); return }

    paypalScript = document.createElement('script')
    paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`
    paypalScript.onload  = resolve
    paypalScript.onerror = reject
    document.head.appendChild(paypalScript)
  })
}

async function initPayPal() {
  if (cart.isEmpty) return

  try {
    await loadPayPalScript()
    loadingPayPal.value = false

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color:  'blue',
        shape:  'rect',
        label:  'pay',
      },

      // Step 1: Create order on backend
      createOrder: async () => {
        errorMessage.value = ''
        try {
          const response = await checkoutApi.create({
            product_ids: cart.productIds,
          })
          return response.data.data.paypal_order_id
        } catch (err) {
          errorMessage.value = err.message || 'Failed to create order.'
          throw err
        }
      },

      // Step 2: Capture after buyer approves
      onApprove: async (data) => {
        try {
          await checkoutApi.capture({
            paypal_order_id: data.orderID,
          })

          cart.clearCart()
          orderComplete.value  = true
          successMessage.value = 'Payment successful! Your downloads are ready.'
        } catch (err) {
          errorMessage.value = err.message || 'Payment capture failed. Please contact support.'
        }
      },

      onError: (err) => {
        console.error('PayPal error', err)
        errorMessage.value = 'Something went wrong with PayPal. Please try again.'
      },

      onCancel: () => {
        errorMessage.value = 'Payment was cancelled.'
      },

    }).render('#paypal-button-container')

  } catch (err) {
    loadingPayPal.value = false
    errorMessage.value  = 'Failed to load PayPal. Please refresh and try again.'
    console.error(err)
  }
}

onMounted(initPayPal)

onUnmounted(() => {
  // Clean up the script tag when leaving the page
  if (paypalScript && document.head.contains(paypalScript)) {
    document.head.removeChild(paypalScript)
  }
  delete window.paypal
})
</script>
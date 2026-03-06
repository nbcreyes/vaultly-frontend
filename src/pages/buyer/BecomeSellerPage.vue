<template>
  <PublicLayout>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <!-- Already a seller -->
      <div v-if="auth.isSeller" class="card p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">You are a seller</h1>
        <p class="text-gray-500 mb-6">Your seller account is active. Go to your dashboard to manage products.</p>
        <RouterLink to="/seller/dashboard" class="btn-primary">Go to dashboard</RouterLink>
      </div>

      <!-- Application submitted -->
      <div v-else-if="submitted || application?.status === 'pending'" class="card p-8 text-center">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Application submitted</h1>
        <p class="text-gray-500">Your application is under review. We will notify you once a decision has been made.</p>
      </div>

      <!-- Rejected — allow reapply -->
      <div v-else-if="application?.status === 'rejected'" class="mb-6">
        <AlertBanner
          variant="error"
          title="Previous application rejected"
          :message="application.rejection_reason || 'Your previous application was not approved.'"
          class="mb-6"
        />
        <SellerApplicationForm @submitted="submitted = true" />
      </div>

      <!-- Application form -->
      <div v-else-if="!loading">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-bold text-gray-900 mb-3">Become a Seller</h1>
          <p class="text-gray-500 max-w-lg mx-auto">
            Join hundreds of creators earning passive income. Just 10% commission — no monthly fees.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-10">
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold text-brand-600">10%</p>
            <p class="text-xs text-gray-500 mt-1">Platform commission</p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold text-brand-600">48h</p>
            <p class="text-xs text-gray-500 mt-1">Payout processing</p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold text-brand-600">∞</p>
            <p class="text-xs text-gray-500 mt-1">Products to sell</p>
          </div>
        </div>

        <SellerApplicationForm @submitted="submitted = true" />
      </div>

      <LoadingSpinner v-else />

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { sellerApi } from '@/api/seller'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import AlertBanner from '@/components/ui/AlertBanner.vue'
import SellerApplicationForm from '@/components/seller/SellerApplicationForm.vue'

const auth        = useAuthStore()
const loading     = ref(true)
const submitted   = ref(false)
const application = ref(null)

onMounted(async () => {
  if (auth.isSeller) { loading.value = false; return }
  try {
    const response  = await sellerApi.getApplication()
    application.value = response.data.data
  } catch {
    // No application yet — show the form
  } finally {
    loading.value = false
  }
})
</script>
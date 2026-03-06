<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">

      <RouterLink to="/" class="flex items-center justify-center gap-2 mb-8">
        <div class="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold text-lg">V</span>
        </div>
        <span class="font-bold text-2xl text-gray-900">Vaultly</span>
      </RouterLink>

      <div class="card p-8 text-center">

        <!-- Auto-verifying state -->
        <template v-if="verifying">
          <LoadingSpinner size="lg" label="Verifying your email..." />
        </template>

        <!-- Success state -->
        <template v-else-if="verified">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Email verified</h1>
          <p class="text-gray-500 mb-6">Your account is ready. You can now log in.</p>
          <RouterLink to="/login" class="btn-primary w-full block">Go to login</RouterLink>
        </template>

        <!-- Error state — bad or expired link -->
        <template v-else-if="errorMessage && !token">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Invalid link</h1>
          <p class="text-gray-500 mb-6">{{ errorMessage }}</p>
          <RouterLink to="/register" class="btn-secondary w-full block">Back to register</RouterLink>
        </template>

        <!-- Waiting state — user arrived without a token (just registered) -->
        <template v-else>
          <div class="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p class="text-gray-500 mb-6">
            We sent a verification link to
            <strong class="text-gray-700">{{ email || 'your email address' }}</strong>.
            Click the link in the email to verify your account.
          </p>

          <AlertBanner
            v-if="errorMessage"
            variant="error"
            :message="errorMessage"
            class="mb-4 text-left"
          />

          <AlertBanner
            v-if="successMessage"
            variant="success"
            :message="successMessage"
            class="mb-4 text-left"
          />

          <button
            @click="handleResend"
            :disabled="resendLoading || resendCooldown > 0"
            class="btn-secondary w-full"
          >
            <LoadingSpinner v-if="resendLoading" size="sm" class="py-0 mr-2" />
            <template v-if="resendCooldown > 0">Resend in {{ resendCooldown }}s</template>
            <template v-else>{{ resendLoading ? 'Sending...' : 'Resend verification email' }}</template>
          </button>

          <RouterLink to="/login" class="block mt-3 text-sm text-gray-500 hover:text-gray-700">
            Back to login
          </RouterLink>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { authApi } from '@/api/auth'
import AlertBanner from '@/components/ui/AlertBanner.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()

const email          = ref(route.query.email || '')
const token          = ref(route.query.token || '')
const verifying      = ref(false)
const verified       = ref(false)
const errorMessage   = ref('')
const successMessage = ref('')
const resendLoading  = ref(false)
const resendCooldown = ref(0)

let cooldownTimer = null

onMounted(async () => {
  // If the user arrived via the email link, token and email are in the URL
  // Auto-verify immediately without any user interaction
  if (token.value && email.value) {
    verifying.value = true

    try {
      await authApi.verifyEmail({ token: token.value, email: email.value })
      verified.value = true
    } catch (err) {
      errorMessage.value = err.message || 'This verification link is invalid or has expired. Please register again.'
    } finally {
      verifying.value = false
    }
  }
})

async function handleResend() {
  errorMessage.value   = ''
  successMessage.value = ''
  resendLoading.value  = true

  try {
    await authApi.resendVerification({ email: email.value })
    successMessage.value = 'A new verification email has been sent.'
    startCooldown(60)
  } catch (err) {
    errorMessage.value = err.message || 'Failed to resend. Please try again.'
  } finally {
    resendLoading.value = false
  }
}

function startCooldown(seconds) {
  resendCooldown.value = seconds
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(cooldownTimer)
  }, 1000)
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>
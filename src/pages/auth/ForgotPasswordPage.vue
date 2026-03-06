<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">

      <RouterLink to="/" class="flex items-center justify-center gap-2 mb-8">
        <div class="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold text-lg">V</span>
        </div>
        <span class="font-bold text-2xl text-gray-900">Vaultly</span>
      </RouterLink>

      <div class="card p-8">

        <!-- Sent state -->
        <template v-if="sent">
          <div class="text-center">
            <div class="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p class="text-gray-500 mb-6">
              If an account exists for <strong class="text-gray-700">{{ form.email }}</strong>,
              you will receive a password reset link shortly.
            </p>
            <RouterLink to="/login" class="btn-secondary w-full">Back to login</RouterLink>
          </div>
        </template>

        <!-- Form state -->
        <template v-else>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Reset your password</h1>
          <p class="text-sm text-gray-500 mb-6">
            Enter your email address and we will send you a reset link.
          </p>

          <AlertBanner
            v-if="errorMessage"
            variant="error"
            :message="errorMessage"
            class="mb-4"
          />

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="label">Email address</label>
              <input
                v-model="form.email"
                type="email"
                class="input"
                placeholder="john@example.com"
                autocomplete="email"
              />
            </div>

            <button
              type="submit"
              class="btn-primary w-full"
              :disabled="loading"
            >
              <LoadingSpinner v-if="loading" size="sm" class="py-0 mr-2" />
              {{ loading ? 'Sending...' : 'Send reset link' }}
            </button>

            <RouterLink to="/login" class="btn-secondary w-full text-center block">
              Back to login
            </RouterLink>
          </form>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { authApi } from '@/api/auth'
import AlertBanner from '@/components/ui/AlertBanner.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const loading      = ref(false)
const errorMessage = ref('')
const sent         = ref(false)
const form         = reactive({ email: '' })

async function handleSubmit() {
  errorMessage.value = ''
  loading.value      = true

  try {
    await authApi.forgotPassword(form)
    sent.value = true
  } catch (err) {
    errorMessage.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
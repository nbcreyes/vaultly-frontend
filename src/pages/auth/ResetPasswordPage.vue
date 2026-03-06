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

        <!-- Success state -->
        <template v-if="success">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Password reset</h1>
            <p class="text-gray-500 mb-6">Your password has been updated. You can now log in with your new password.</p>
            <RouterLink to="/login" class="btn-primary w-full">Go to login</RouterLink>
          </div>
        </template>

        <!-- Form state -->
        <template v-else>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Set new password</h1>
          <p class="text-sm text-gray-500 mb-6">Choose a strong password for your account.</p>

          <AlertBanner
            v-if="errorMessage"
            variant="error"
            :message="errorMessage"
            class="mb-4"
          />

          <form @submit.prevent="handleSubmit" class="space-y-4">

            <div>
              <label class="label">New password</label>
              <input
                v-model="form.password"
                type="password"
                class="input"
                :class="{ 'input-error': errors.password }"
                placeholder="At least 8 characters"
                autocomplete="new-password"
              />
              <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
            </div>

            <div>
              <label class="label">Confirm new password</label>
              <input
                v-model="form.password_confirmation"
                type="password"
                class="input"
                :class="{ 'input-error': errors.password_confirmation }"
                placeholder="Repeat your new password"
                autocomplete="new-password"
              />
              <p v-if="errors.password_confirmation" class="error-message">{{ errors.password_confirmation }}</p>
            </div>

            <button
              type="submit"
              class="btn-primary w-full"
              :disabled="loading"
            >
              <LoadingSpinner v-if="loading" size="sm" class="py-0 mr-2" />
              {{ loading ? 'Updating...' : 'Update password' }}
            </button>

          </form>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '@/api/auth'
import AlertBanner from '@/components/ui/AlertBanner.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route  = useRoute()
const router = useRouter()

const loading      = ref(false)
const errorMessage = ref('')
const success      = ref(false)

const form = reactive({
  token:                 '',
  email:                 '',
  password:              '',
  password_confirmation: '',
})

const errors = reactive({
  password:              '',
  password_confirmation: '',
})

onMounted(() => {
  // The reset link from the email contains token and email as query params
  form.token = route.query.token || ''
  form.email = route.query.email || ''

  if (!form.token || !form.email) {
    errorMessage.value = 'Invalid reset link. Please request a new one.'
  }
})

function clearErrors() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  errorMessage.value = ''
}

async function handleSubmit() {
  clearErrors()
  loading.value = true

  try {
    await authApi.resetPassword(form)
    success.value = true
  } catch (err) {
    if (err.errors && Object.keys(err.errors).length) {
      Object.keys(err.errors).forEach((key) => {
        if (errors[key] !== undefined) {
          errors[key] = err.errors[key][0]
        }
      })
    } else {
      errorMessage.value = err.message || 'Failed to reset password. The link may have expired.'
    }
  } finally {
    loading.value = false
  }
}
</script>
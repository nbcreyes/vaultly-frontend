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
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p class="text-sm text-gray-500 mb-6">
          Don't have an account?
          <RouterLink to="/register" class="text-brand-600 hover:text-brand-700 font-medium">Sign up</RouterLink>
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
              :class="{ 'input-error': errors.email }"
              placeholder="john@example.com"
              autocomplete="email"
            />
            <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="label mb-0">Password</label>
              <RouterLink
                to="/forgot-password"
                class="text-xs text-brand-600 hover:text-brand-700"
              >
                Forgot password?
              </RouterLink>
            </div>
            <input
              v-model="form.password"
              type="password"
              class="input"
              :class="{ 'input-error': errors.password }"
              placeholder="Your password"
              autocomplete="current-password"
            />
            <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
          </div>

          <button
            type="submit"
            class="btn-primary w-full mt-2"
            :disabled="loading"
          >
            <LoadingSpinner v-if="loading" size="sm" class="py-0 mr-2" />
            {{ loading ? 'Logging in...' : 'Log in' }}
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import AlertBanner from '@/components/ui/AlertBanner.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const auth          = useAuthStore()
const notifications = useNotificationsStore()
const router        = useRouter()
const route         = useRoute()

const loading      = ref(false)
const errorMessage = ref('')

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

function clearErrors() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  errorMessage.value = ''
}

async function handleSubmit() {
  clearErrors()
  loading.value = true

  try {
    const payload = await auth.login(form)

    // Start notification polling after login
    notifications.startPolling()

    // Redirect to intended page or role-based default
    const redirect = route.query.redirect

    if (redirect) {
      router.push(redirect)
    } else if (payload.user.role === 'admin') {
      router.push({ name: 'admin-dashboard' })
    } else if (payload.user.role === 'seller') {
      router.push({ name: 'seller-dashboard' })
    } else {
      router.push({ name: 'home' })
    }
  } catch (err) {
    if (err.errors && Object.keys(err.errors).length) {
      Object.keys(err.errors).forEach((key) => {
        if (errors[key] !== undefined) {
          errors[key] = err.errors[key][0]
        }
      })
    } else {
      errorMessage.value = err.message || 'Login failed. Please check your credentials.'
    }
  } finally {
    loading.value = false
  }
}
</script>
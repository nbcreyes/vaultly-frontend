<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center justify-center gap-2 mb-8">
        <div class="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold text-lg">V</span>
        </div>
        <span class="font-bold text-2xl text-gray-900">Vaultly</span>
      </RouterLink>

      <div class="card p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
        <p class="text-sm text-gray-500 mb-6">
          Already have an account?
          <RouterLink to="/login" class="text-brand-600 hover:text-brand-700 font-medium">Log in</RouterLink>
        </p>

        <AlertBanner
          v-if="errorMessage"
          variant="error"
          :message="errorMessage"
          class="mb-4"
        />

        <form @submit.prevent="handleSubmit" class="space-y-4">

          <div>
            <label class="label">Full name</label>
            <input
              v-model="form.name"
              type="text"
              class="input"
              :class="{ 'input-error': errors.name }"
              placeholder="John Smith"
              autocomplete="name"
            />
            <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
          </div>

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
            <label class="label">Password</label>
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
            <label class="label">Confirm password</label>
            <input
              v-model="form.password_confirmation"
              type="password"
              class="input"
              :class="{ 'input-error': errors.password_confirmation }"
              placeholder="Repeat your password"
              autocomplete="new-password"
            />
            <p v-if="errors.password_confirmation" class="error-message">{{ errors.password_confirmation }}</p>
          </div>

          <button
            type="submit"
            class="btn-primary w-full mt-2"
            :disabled="loading"
          >
            <LoadingSpinner v-if="loading" size="sm" class="py-0 mr-2" />
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>

        </form>
      </div>

      <p class="text-center text-xs text-gray-400 mt-6">
        By signing up you agree to our terms of service.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AlertBanner from '@/components/ui/AlertBanner.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const auth   = useAuthStore()
const router = useRouter()

const loading      = ref(false)
const errorMessage = ref('')

const form = reactive({
  name:                  '',
  email:                 '',
  password:              '',
  password_confirmation: '',
})

const errors = reactive({
  name:                  '',
  email:                 '',
  password:              '',
  password_confirmation: '',
})

function clearErrors() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  errorMessage.value = ''
}

async function handleSubmit() {
  clearErrors()
  loading.value = true

  try {
    await auth.register(form)

    // Redirect to verify email page with the email pre-filled
    router.push({
      name:  'verify-email',
      query: { email: form.email },
    })
  } catch (err) {
    if (err.errors && Object.keys(err.errors).length) {
      Object.keys(err.errors).forEach((key) => {
        if (errors[key] !== undefined) {
          errors[key] = err.errors[key][0]
        }
      })
    } else {
      errorMessage.value = err.message || 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>
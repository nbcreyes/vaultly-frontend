<template>
  <div class="card p-6">
    <h2 class="font-semibold text-gray-900 mb-4">Seller Application</h2>

    <AlertBanner v-if="error" variant="error" :message="error" class="mb-4" />

    <div class="space-y-4">
      <div>
        <label class="label">Store name</label>
        <input v-model="form.store_name" type="text" class="input" :class="{ 'input-error': errors.store_name }" placeholder="My Creative Studio" />
        <p v-if="errors.store_name" class="error-message">{{ errors.store_name }}</p>
      </div>

      <div>
        <label class="label">What will you sell?</label>
        <textarea v-model="form.description" class="input min-h-[80px] resize-none" :class="{ 'input-error': errors.description }" placeholder="UI kits, code templates, ebooks..." />
        <p v-if="errors.description" class="error-message">{{ errors.description }}</p>
      </div>

      <div>
        <label class="label">PayPal email (for payouts)</label>
        <input v-model="form.paypal_email" type="email" class="input" :class="{ 'input-error': errors.paypal_email }" placeholder="paypal@example.com" />
        <p v-if="errors.paypal_email" class="error-message">{{ errors.paypal_email }}</p>
      </div>

      <button @click="submit" :disabled="loading" class="btn-primary w-full">
        {{ loading ? 'Submitting...' : 'Submit application' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { sellerApi } from '@/api/seller'
import AlertBanner from '@/components/ui/AlertBanner.vue'

const emit = defineEmits(['submitted'])

const loading = ref(false)
const error   = ref('')
const form    = reactive({ store_name: '', description: '', paypal_email: '' })
const errors  = reactive({ store_name: '', description: '', paypal_email: '' })

async function submit() {
  loading.value = true
  error.value   = ''
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  try {
    await sellerApi.submitApplication(form)
    emit('submitted')
  } catch (err) {
    if (err.errors) {
      Object.keys(err.errors).forEach((k) => {
        if (errors[k] !== undefined) errors[k] = err.errors[k][0]
      })
    } else {
      error.value = err.message || 'Failed to submit application.'
    }
  } finally {
    loading.value = false
  }
}
</script>
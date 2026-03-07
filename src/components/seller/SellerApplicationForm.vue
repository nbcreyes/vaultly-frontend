<template>
  <div class="card p-6">
    <h2 class="font-semibold text-gray-900 mb-4">Seller Application</h2>

    <AlertBanner v-if="error" variant="error" :message="error" class="mb-4" />

    <div class="space-y-4">

      <div>
        <label class="label">Full name</label>
        <input
          v-model="form.full_name"
          type="text"
          class="input"
          :class="{ 'input-error': errors.full_name }"
          placeholder="Your full name"
        />
        <p v-if="errors.full_name" class="error-message">{{ errors.full_name }}</p>
      </div>

      <div>
        <label class="label">Store name</label>
        <input
          v-model="form.store_name"
          type="text"
          class="input"
          :class="{ 'input-error': errors.store_name }"
          placeholder="My Creative Studio"
        />
        <p v-if="errors.store_name" class="error-message">{{ errors.store_name }}</p>
      </div>

      <div>
        <label class="label">Store description</label>
        <textarea
          v-model="form.store_description"
          class="input min-h-[80px] resize-none"
          :class="{ 'input-error': errors.store_description }"
          placeholder="Describe what you will sell — UI kits, code templates, ebooks..."
        />
        <p v-if="errors.store_description" class="error-message">{{ errors.store_description }}</p>
      </div>

      <div>
        <label class="label">Category focus</label>
        <select
          v-model="form.category_focus"
          class="input"
          :class="{ 'input-error': errors.category_focus }"
        >
          <option value="">Select a category...</option>
          <option value="Code & Scripts">Code & Scripts</option>
          <option value="Design Assets">Design Assets</option>
          <option value="Education">Education</option>
          <option value="Templates">Templates</option>
          <option value="Fonts">Fonts</option>
          <option value="Audio & Music">Audio & Music</option>
          <option value="Video">Video</option>
          <option value="Photography">Photography</option>
          <option value="Other">Other</option>
        </select>
        <p v-if="errors.category_focus" class="error-message">{{ errors.category_focus }}</p>
      </div>

      <div>
        <label class="label">PayPal email (for payouts)</label>
        <input
          v-model="form.paypal_email"
          type="email"
          class="input"
          :class="{ 'input-error': errors.paypal_email }"
          placeholder="paypal@example.com"
        />
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
const form    = reactive({
  full_name:         '',
  store_name:        '',
  store_description: '',
  category_focus:    '',
  paypal_email:      '',
})
const errors = reactive({
  full_name:         '',
  store_name:        '',
  store_description: '',
  category_focus:    '',
  paypal_email:      '',
})

async function submit() {
  loading.value = true
  error.value   = ''
  Object.keys(errors).forEach(k => (errors[k] = ''))
  try {
    await sellerApi.submitApplication(form)
    emit('submitted')
  } catch (err) {
    if (err.errors) {
      Object.keys(err.errors).forEach(k => {
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
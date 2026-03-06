<template>
  <SellerLayout>
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Store Settings</h1>

      <AlertBanner v-if="success" variant="success" message="Store settings saved." class="mb-4" />
      <AlertBanner v-if="error"   variant="error"   :message="error"               class="mb-4" />

      <LoadingSpinner v-if="loading" />

      <div v-else class="space-y-6">

        <!-- Logo and banner -->
        <div class="card p-6">
          <h2 class="font-semibold text-gray-900 mb-4">Store Images</h2>

          <div class="grid grid-cols-2 gap-4">
            <!-- Logo -->
            <div>
              <p class="label">Logo</p>
              <div class="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden mb-2">
                <img v-if="store.logo_url" :src="store.logo_url" class="w-full h-full object-cover" />
              </div>
              <label class="btn-secondary btn-sm cursor-pointer inline-block">
                <input type="file" accept="image/*" class="hidden" @change="uploadLogo" />
                Upload logo
              </label>
            </div>

            <!-- Banner -->
            <div>
              <p class="label">Banner</p>
              <div class="w-full h-20 rounded-xl bg-gray-100 overflow-hidden mb-2">
                <img v-if="store.banner_url" :src="store.banner_url" class="w-full h-full object-cover" />
              </div>
              <label class="btn-secondary btn-sm cursor-pointer inline-block">
                <input type="file" accept="image/*" class="hidden" @change="uploadBanner" />
                Upload banner
              </label>
            </div>
          </div>
        </div>

        <!-- Store details -->
        <div class="card p-6 space-y-4">
          <h2 class="font-semibold text-gray-900">Store Details</h2>

          <div>
            <label class="label">Store name</label>
            <input v-model="form.store_name" type="text" class="input" />
          </div>

          <div>
            <label class="label">Bio</label>
            <textarea v-model="form.bio" class="input min-h-[80px] resize-none" placeholder="Tell buyers about your store..." />
          </div>

          <div>
            <label class="label">Website</label>
            <input v-model="form.website" type="url" class="input" placeholder="https://yoursite.com" />
          </div>

          <div>
            <label class="label">Twitter</label>
            <input v-model="form.twitter" type="text" class="input" placeholder="@handle" />
          </div>

          <button @click="save" :disabled="saving" class="btn-primary">
            {{ saving ? 'Saving...' : 'Save changes' }}
          </button>
        </div>

      </div>
    </div>
  </SellerLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { sellerApi } from '@/api/seller'
import SellerLayout from '@/components/layout/SellerLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import AlertBanner from '@/components/ui/AlertBanner.vue'

const loading = ref(true)
const saving  = ref(false)
const success = ref(false)
const error   = ref('')
const store   = ref({})

const form = reactive({
  store_name: '',
  bio:        '',
  website:    '',
  twitter:    '',
})

onMounted(async () => {
  try {
    const response = await sellerApi.getStore()
    store.value    = response.data.data || {}
    Object.assign(form, {
      store_name: store.value.store_name || '',
      bio:        store.value.bio        || '',
      website:    store.value.website    || '',
      twitter:    store.value.twitter    || '',
    })
  } catch (err) { console.error(err) } finally {
    loading.value = false
  }
})

async function save() {
  saving.value  = true
  success.value = false
  error.value   = ''
  try {
    const response = await sellerApi.updateStore(form)
    store.value    = response.data.data
    success.value  = true
  } catch (err) {
    error.value = err.message || 'Failed to save.'
  } finally {
    saving.value = false
  }
}

async function uploadLogo(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('logo', file)
  try {
    const response   = await sellerApi.uploadLogo(fd)
    store.value.logo_url = response.data.data?.logo_url
  } catch (err) { error.value = err.message }
}

async function uploadBanner(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('banner', file)
  try {
    const response      = await sellerApi.uploadBanner(fd)
    store.value.banner_url = response.data.data?.banner_url
  } catch (err) { error.value = err.message }
}
</script>
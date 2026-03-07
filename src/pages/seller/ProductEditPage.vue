<template>
  <SellerLayout>
    <div class="max-w-2xl">

      <div class="flex items-center gap-3 mb-6">
        <RouterLink to="/seller/products" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </RouterLink>
        <h1 class="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else class="space-y-6">

        <AlertBanner v-if="success" variant="success" message="Product saved." class="mb-2" />
        <AlertBanner v-if="error"   variant="error"   :message="error"         class="mb-2" />

        <!-- Basic info -->
        <div class="card p-6 space-y-4">
          <h2 class="font-semibold text-gray-900">Basic Info</h2>

          <div>
            <label class="label">Title</label>
            <input v-model="form.title" type="text" class="input" :class="{ 'input-error': errors.title }" />
            <p v-if="errors.title" class="error-message">{{ errors.title }}</p>
          </div>

          <div>
            <label class="label">Short description</label>
            <input v-model="form.short_description" type="text" class="input" maxlength="160" />
          </div>

          <div>
            <label class="label">Full description</label>
            <textarea v-model="form.description" class="input min-h-[120px] resize-none" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Category</label>
              <select v-model="form.category_id" class="input">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="label">License</label>
              <select v-model="form.license_type" class="input">
                <option value="personal">Personal</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Price (USD)</label>
              <input v-model="form.price" type="number" class="input" min="0.99" step="0.01" />
            </div>
            <div>
              <label class="label">Version</label>
              <input v-model="form.version" type="text" class="input" />
            </div>
          </div>

          <div>
            <label class="label">Tags <span class="text-gray-400 font-normal text-xs">(comma separated)</span></label>
            <input v-model="tagsInput" type="text" class="input" />
          </div>
        </div>

        <!-- Replace product file -->
        <div class="card p-6">
          <h2 class="font-semibold text-gray-900 mb-1">Replace Product File</h2>
          <p class="text-sm text-gray-500 mb-3">Leave empty to keep the existing file.</p>

          <div v-if="newFile" class="flex items-center gap-3 p-3 bg-brand-50 rounded-lg mb-2">
            <svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-sm text-gray-700 flex-1">{{ newFile.name }}</span>
            <button @click="newFile = null" class="text-xs text-red-500">Remove</button>
          </div>

          <label class="btn-secondary btn-sm cursor-pointer inline-block">
            <input type="file" class="hidden" @change="newFile = $event.target.files?.[0]" />
            {{ newFile ? 'Change file' : 'Upload new file' }}
          </label>
        </div>

        <!-- Existing images -->
        <div class="card p-6">
          <h2 class="font-semibold text-gray-900 mb-1">Preview Images</h2>
          <p class="text-sm text-gray-500 mb-4">Delete existing images or add new ones. First image is the thumbnail.</p>

          <div class="grid grid-cols-3 gap-3 mb-3">
            <div
              v-for="img in existingImages"
              :key="img.id"
              class="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
            >
              <img :src="img.url" class="w-full h-full object-cover" />
              <button
                @click="deleteImage(img)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >×</button>
            </div>

            <div
              v-for="(img, i) in newImages"
              :key="'new-' + i"
              class="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
            >
              <img :src="img.preview" class="w-full h-full object-cover" />
              <button
                @click="removeNewImage(i)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >×</button>
            </div>

            <label
              v-if="existingImages.length + newImages.length < 5"
              class="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-brand-300"
            >
              <input type="file" accept="image/*" multiple class="hidden" @change="addNewImages" />
              <span class="text-3xl text-gray-300">+</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pb-8">
          <button @click="save" :disabled="saving" class="btn-primary flex-1">
            {{ saving ? 'Saving...' : 'Save changes' }}
          </button>
          <button
            v-if="product?.status !== 'published'"
            @click="saveAndPublish"
            :disabled="saving"
            class="btn-secondary flex-1"
          >
            Save & Publish
          </button>
          <button
            v-else
            @click="unpublish"
            :disabled="saving"
            class="btn-secondary flex-1 text-orange-600"
          >
            Unpublish
          </button>
        </div>

        <!-- Danger zone -->
        <div class="card p-6 border-red-200">
          <h2 class="font-semibold text-red-600 mb-2">Danger Zone</h2>
          <p class="text-sm text-gray-500 mb-3">Deleting a product is permanent and cannot be undone.</p>
          <button @click="deleteProduct" class="btn-danger btn-sm">Delete product</button>
        </div>

      </div>
    </div>
  </SellerLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sellerApi } from '@/api/seller'
import { browseApi } from '@/api/browse'
import SellerLayout from '@/components/layout/SellerLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import AlertBanner from '@/components/ui/AlertBanner.vue'

const route  = useRoute()
const router = useRouter()
const id     = route.params.id

const loading       = ref(true)
const saving        = ref(false)
const success       = ref(false)
const error         = ref('')
const product       = ref(null)
const categories    = ref([])
const existingImages = ref([])
const newImages     = ref([])
const newFile       = ref(null)
const tagsInput     = ref('')

const form   = reactive({ title: '', short_description: '', description: '', category_id: '', license_type: 'commercial', price: '', version: '' })
const errors = reactive({ title: '', description: '', price: '' })

function clearErrors() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  error.value = ''
  success.value = false
}

function addNewImages(event) {
  const files     = Array.from(event.target.files || [])
  const remaining = 5 - existingImages.value.length - newImages.value.length
  files.slice(0, remaining).forEach((file) => {
    newImages.value.push({ file, preview: URL.createObjectURL(file) })
  })
}

function removeNewImage(index) {
  URL.revokeObjectURL(newImages.value[index].preview)
  newImages.value.splice(index, 1)
}

async function deleteImage(img) {
  try {
    await sellerApi.deleteProductImage(id, img.id)
    existingImages.value = existingImages.value.filter((i) => i.id !== img.id)
  } catch (err) { error.value = err.message }
}

async function save() {
  clearErrors()
  saving.value = true
  try {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v) })

    if (newFile.value) fd.append('product_file', newFile.value)

    if (tagsInput.value.trim()) {
      tagsInput.value.split(',').map((t) => t.trim()).filter(Boolean).forEach((tag) => {
        fd.append('tags[]', tag)
      })
    }

    // Upload new images separately
    if (newImages.value.length) {
      const imgFd = new FormData()
      newImages.value.forEach((img, i) => imgFd.append(`images[${i}]`, img.file))
      await sellerApi.addProductImages(id, imgFd)
      newImages.value = []
    }

    await sellerApi.updateProduct(id, fd)
    success.value = true
    newFile.value = null
  } catch (err) {
    if (err.errors) {
      Object.keys(err.errors).forEach((k) => { if (errors[k] !== undefined) errors[k] = err.errors[k][0] })
    } else {
      error.value = err.message || 'Failed to save.'
    }
  } finally {
    saving.value = false
  }
}

async function saveAndPublish() {
  await save()
  if (!error.value) {
    await sellerApi.publishProduct(id)
    product.value.status = 'published'
  }
}

async function unpublish() {
  try {
    await sellerApi.unpublishProduct(id)
    product.value.status = 'unpublished'
    success.value = true
  } catch (err) { error.value = err.message }
}

async function deleteProduct() {
  if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return
  try {
    await sellerApi.deleteProduct(id)
    router.push('/seller/products')
  } catch (err) { error.value = err.message }
}

onMounted(async () => {
  try {
    const [productRes, catsRes] = await Promise.all([
      sellerApi.getProduct(id),
      browseApi.categories(),
    ])

    // API wraps product under data.product
    const raw             = productRes.data.data
    product.value         = raw?.product ?? raw
    existingImages.value  = product.value.images || []

    // Categories nested under data.categories
    const catsRaw    = catsRes.data.data
    categories.value = catsRaw?.categories ?? (Array.isArray(catsRaw) ? catsRaw : [])

    const p = product.value
    Object.assign(form, {
      title:             p.title             || '',
      short_description: p.short_description || '',
      description:       p.description       || '',
      category_id:       p.category?.id      || p.category_id || '',
      license_type:      p.license_type      || 'commercial',
      price:             p.price             || '',
      version:           p.version           || '',
    })

    // Tags are objects {id, name, slug} — extract name strings
    tagsInput.value = (p.tags || []).map(t => t.name ?? t).join(', ')

  } catch (err) {
    console.error(err)
    error.value = 'Failed to load product.'
  } finally {
    loading.value = false
  }
})
</script>
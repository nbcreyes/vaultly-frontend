<template>
  <SellerLayout>
    <div class="max-w-2xl">
      <div class="flex items-center gap-3 mb-6">
        <RouterLink
          to="/seller/products"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </RouterLink>
        <h1 class="text-2xl font-bold text-gray-900">New Product</h1>
      </div>

      <AlertBanner v-if="error" variant="error" :message="error" class="mb-4" />

      <div class="space-y-6">
        <!-- Basic info -->
        <div class="card p-6 space-y-4">
          <h2 class="font-semibold text-gray-900">Basic Info</h2>

          <div>
            <label class="label"
              >Title <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.title"
              type="text"
              class="input"
              :class="{ 'input-error': errors.title }"
              placeholder="My Awesome UI Kit"
            />
            <p v-if="errors.title" class="error-message">{{ errors.title }}</p>
          </div>

          <div>
            <label class="label">Short description</label>
            <input
              v-model="form.short_description"
              type="text"
              class="input"
              placeholder="One line summary shown in cards"
              maxlength="160"
            />
          </div>

          <div>
            <label class="label"
              >Full description <span class="text-red-500">*</span></label
            >
            <textarea
              v-model="form.description"
              class="input min-h-[120px] resize-none"
              :class="{ 'input-error': errors.description }"
              placeholder="Describe what's included, who it's for, and what problems it solves..."
            />
            <p v-if="errors.description" class="error-message">
              {{ errors.description }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label"
                >Category <span class="text-red-500">*</span></label
              >
              <select
                v-model="form.category_id"
                class="input"
                :class="{ 'input-error': errors.category_id }"
              >
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <p v-if="errors.category_id" class="error-message">
                {{ errors.category_id }}
              </p>
            </div>
            <div>
              <label class="label"
                >License <span class="text-red-500">*</span></label
              >
              <select v-model="form.license_type" class="input">
                <option value="personal">Personal</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label"
                >Price (USD) <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.price"
                type="number"
                class="input"
                :class="{ 'input-error': errors.price }"
                placeholder="9.99"
                min="0.99"
                step="0.01"
              />
              <p v-if="errors.price" class="error-message">
                {{ errors.price }}
              </p>
            </div>
            <div>
              <label class="label">Version</label>
              <input
                v-model="form.version"
                type="text"
                class="input"
                placeholder="1.0.0"
              />
            </div>
          </div>

          <div>
            <label class="label"
              >Tags
              <span class="text-gray-400 font-normal text-xs"
                >(comma separated)</span
              ></label
            >
            <input
              v-model="tagsInput"
              type="text"
              class="input"
              placeholder="vue, tailwind, dashboard"
            />
          </div>
        </div>

        <!-- Product file -->
        <div class="card p-6">
          <h2 class="font-semibold text-gray-900 mb-4">
            Product File <span class="text-red-500">*</span>
          </h2>
          <p class="text-sm text-gray-500 mb-3">
            The file buyers will download. ZIP, PDF, MP3, MP4, fonts accepted.
            Max 200MB.
          </p>

          <div
            class="border-2 border-dashed rounded-xl p-8 text-center transition-colors"
            :class="
              productFile
                ? 'border-brand-300 bg-brand-50'
                : 'border-gray-200 hover:border-brand-300'
            "
            @dragover.prevent
            @drop.prevent="handleFileDrop"
          >
            <template v-if="productFile">
              <svg
                class="w-10 h-10 text-brand-500 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p class="text-sm font-medium text-gray-900">
                {{ productFile.name }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatFileSize(productFile.size) }}
              </p>
              <button
                @click="productFile = null"
                class="text-xs text-red-500 mt-2 hover:text-red-700"
              >
                Remove
              </button>
            </template>
            <template v-else>
              <svg
                class="w-10 h-10 text-gray-300 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p class="text-sm text-gray-500 mb-2">
                Drag and drop or click to upload
              </p>
              <label class="btn-secondary btn-sm cursor-pointer">
                <input type="file" class="hidden" @change="handleFileInput" />
                Choose file
              </label>
            </template>
          </div>
          <p v-if="errors.product_file" class="error-message mt-2">
            {{ errors.product_file }}
          </p>
        </div>

        <!-- Preview images -->
        <div class="card p-6">
          <h2 class="font-semibold text-gray-900 mb-1">Preview Images</h2>
          <p class="text-sm text-gray-500 mb-4">
            Upload up to 5 images showing your product. First image is the
            thumbnail.
          </p>

          <div class="grid grid-cols-3 gap-3 mb-3">
            <div
              v-for="(img, i) in previewImages"
              :key="i"
              class="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
            >
              <img :src="img.preview" class="w-full h-full object-cover" />
              <button
                @click="removePreviewImage(i)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
              <span
                v-if="i === 0"
                class="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded"
                >Cover</span
              >
            </div>

            <label
              v-if="previewImages.length < 5"
              class="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-brand-300 transition-colors"
            >
              <input
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="addPreviewImages"
              />
              <span class="text-3xl text-gray-300">+</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pb-8">
          <button
            @click="submit('draft')"
            :disabled="saving"
            class="btn-secondary flex-1"
          >
            {{ saving === "draft" ? "Saving..." : "Save as draft" }}
          </button>
          <button
            @click="submit('published')"
            :disabled="saving"
            class="btn-primary flex-1"
          >
            {{ saving === "published" ? "Publishing..." : "Publish product" }}
          </button>
        </div>
      </div>
    </div>
  </SellerLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { sellerApi } from "@/api/seller";
import { browseApi } from "@/api/browse";
import { formatFileSize } from "@/utils/format";
import SellerLayout from "@/components/layout/SellerLayout.vue";
import AlertBanner from "@/components/ui/AlertBanner.vue";

const router = useRouter();

const saving = ref(false);
const error = ref("");
const categories = ref([]);
const productFile = ref(null);
const previewImages = ref([]);
const tagsInput = ref("");

const form = reactive({
  title: "",
  short_description: "",
  description: "",
  category_id: "",
  license_type: "commercial",
  price: "",
  version: "1.0.0",
});

const errors = reactive({
  title: "",
  description: "",
  category_id: "",
  price: "",
  product_file: "",
});

function clearErrors() {
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  error.value = "";
}

function handleFileInput(event) {
  productFile.value = event.target.files?.[0] || null;
}

function handleFileDrop(event) {
  productFile.value = event.dataTransfer.files?.[0] || null;
}

function addPreviewImages(event) {
  const files = Array.from(event.target.files || []);
  const remaining = 5 - previewImages.value.length;
  files.slice(0, remaining).forEach((file) => {
    previewImages.value.push({
      file,
      preview: URL.createObjectURL(file),
    });
  });
}

function removePreviewImage(index) {
  URL.revokeObjectURL(previewImages.value[index].preview);
  previewImages.value.splice(index, 1);
}

async function submit(publishStatus) {
  clearErrors();

  if (!productFile.value) {
    errors.product_file = "A product file is required.";
    return;
  }

  saving.value = publishStatus;

  try {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "") fd.append(k, v);
    });
    fd.append("product_file", productFile.value);

    if (tagsInput.value.trim()) {
      tagsInput.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((tag) => {
          fd.append("tags[]", tag);
        });
    }

    previewImages.value.forEach((img, i) => {
      fd.append(`images[${i}]`, img.file);
    });

    const response = await sellerApi.createProduct(fd);
    const productId = response.data.data?.id;

    // Publish if requested
    if (publishStatus === "published" && productId) {
      await sellerApi.publishProduct(productId);
    }

    router.push("/seller/products");
  } catch (err) {
    if (err.errors) {
      Object.keys(err.errors).forEach((k) => {
        if (errors[k] !== undefined) errors[k] = err.errors[k][0];
      });
    } else {
      error.value = err.message || "Failed to create product.";
    }
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    const response   = await browseApi.categories()
    const raw        = response.data.data
    categories.value = raw?.categories ?? (Array.isArray(raw) ? raw : [])
  } catch { /* non-critical */ }
})
</script>

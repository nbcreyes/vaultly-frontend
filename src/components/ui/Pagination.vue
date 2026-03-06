<template>
  <div v-if="lastPage > 1" class="flex items-center justify-between mt-6">
    <p class="text-sm text-gray-500">
      Page {{ currentPage }} of {{ lastPage }}
    </p>
    <div class="flex gap-1">
      <button
        @click="$emit('change', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="$emit('change', currentPage + 1)"
        :disabled="currentPage === lastPage"
        class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  lastPage:    { type: Number, required: true },
})
defineEmits(['change'])
</script>
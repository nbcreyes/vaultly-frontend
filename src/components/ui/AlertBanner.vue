<template>
  <div
    class="rounded-lg px-4 py-3 text-sm flex items-start gap-3"
    :class="variantClasses"
  >
    <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path v-if="variant === 'error' || variant === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div>
      <p class="font-medium" v-if="title">{{ title }}</p>
      <p :class="title ? 'mt-0.5 opacity-90' : ''">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'info' },
  title:   { type: String, default: '' },
  message: { type: String, required: true },
})

const variantClasses = computed(() => ({
  'error':   'bg-red-50 text-red-800 border border-red-200',
  'success': 'bg-green-50 text-green-800 border border-green-200',
  'warning': 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  'info':    'bg-blue-50 text-blue-800 border border-blue-200',
}[props.variant] || 'bg-blue-50 text-blue-800 border border-blue-200'))
</script>
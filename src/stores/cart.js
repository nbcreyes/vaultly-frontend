import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Cart store — manages the current checkout cart.
 *
 * Vaultly supports single-product checkout but the cart
 * architecture is kept flexible for future multi-product support.
 * Cart state is kept in memory only — not persisted to localStorage
 * since digital products are single-purchase items.
 */
export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const isEmpty    = computed(() => items.value.length === 0)
  const itemCount  = computed(() => items.value.length)
  const total      = computed(() =>
    items.value.reduce((sum, item) => sum + parseFloat(item.price), 0)
  )
  const productIds = computed(() => items.value.map((item) => item.id))

  function addItem(product) {
    const exists = items.value.find((i) => i.id === product.id)
    if (!exists) {
      items.value.push(product)
    }
  }

  function removeItem(productId) {
    items.value = items.value.filter((i) => i.id !== productId)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    isEmpty,
    itemCount,
    total,
    productIds,
    addItem,
    removeItem,
    clearCart,
  }
})
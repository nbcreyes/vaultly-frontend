import { ref } from 'vue'

/**
 * usePagination
 *
 * Manages pagination state for any paginated API endpoint.
 *
 * Usage:
 *   const { currentPage, lastPage, total, setMeta, goToPage } = usePagination(fetchFn)
 */
export function usePagination(fetchFn) {
  const currentPage = ref(1)
  const lastPage    = ref(1)
  const total       = ref(0)

  function setMeta(meta) {
    if (!meta) return
    currentPage.value = meta.current_page || 1
    lastPage.value    = meta.last_page    || 1
    total.value       = meta.total        || 0
  }

  async function goToPage(page) {
    currentPage.value = page
    await fetchFn(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { currentPage, lastPage, total, setMeta, goToPage }
}
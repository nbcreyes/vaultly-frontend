<template>
  <AdminLayout>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Seller Applications</h1>

      <LoadingSpinner v-if="loading" />
      <EmptyState v-else-if="applications.length === 0" title="No applications" description="No pending seller applications." />

      <div v-else class="space-y-4">
        <div v-for="app in applications" :key="app.id" class="card p-5">
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-semibold text-gray-900">{{ app.store_name }}</p>
              <p class="text-sm text-gray-500">{{ app.user?.name }} · {{ app.user?.email }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(app.created_at) }}</p>
            </div>
            <span class="badge capitalize"
              :class="{
                'badge-yellow': app.status === 'pending',
                'badge-green':  app.status === 'approved',
                'badge-red':    app.status === 'rejected',
              }">
              {{ app.status }}
            </span>
          </div>

          <p class="text-sm text-gray-600 mb-4">{{ app.description }}</p>

          <div v-if="app.status === 'pending'" class="flex gap-2">
            <button @click="review(app, 'approved')" class="btn-primary btn-sm">Approve</button>
            <div class="flex gap-2 flex-1">
              <input v-model="rejectionReasons[app.id]" type="text" class="input text-sm flex-1" placeholder="Rejection reason..." />
              <button
                @click="review(app, 'rejected')"
                :disabled="!rejectionReasons[app.id]"
                class="btn-danger btn-sm"
              >Reject</button>
            </div>
          </div>
        </div>

        <Pagination v-if="lastPage > 1" :current-page="currentPage" :last-page="lastPage" @change="fetch" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { adminApi } from '@/api/admin'
import { formatDate } from '@/utils/format'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'

const loading          = ref(true)
const applications     = ref([])
const currentPage      = ref(1)
const lastPage         = ref(1)
const rejectionReasons = reactive({})

async function fetch(page = 1) {
  loading.value = true
  try {
    const response       = await adminApi.getApplications({ page })
    const data           = response.data
    applications.value   = data.data
    lastPage.value       = data.meta?.last_page || 1
    currentPage.value    = data.meta?.current_page || 1
  } catch (err) { console.error(err) } finally {
    loading.value = false
  }
}

async function review(app, decision) {
  try {
    await adminApi.reviewApplication(app.id, {
      decision,
      rejection_reason: rejectionReasons[app.id] || undefined,
    })
    app.status = decision
  } catch (err) { console.error(err) }
}

onMounted(() => fetch())
</script>
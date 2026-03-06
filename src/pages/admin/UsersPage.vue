<template>
  <AdminLayout>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Users</h1>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 mb-6">
        <input v-model="search" type="text" class="input w-56" placeholder="Search name or email..." @input="debouncedFetch" />
        <select v-model="roleFilter" class="input w-36" @change="fetchUsers()">
          <option value="">All roles</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        <select v-model="statusFilter" class="input w-36" @change="fetchUsers()">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else class="space-y-2">
        <div v-for="user in users" :key="user.id" class="card p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <img v-if="user.avatar_url" :src="user.avatar_url" class="w-full h-full rounded-full object-cover" />
            <span v-else class="text-brand-600 text-sm font-semibold">{{ user.name?.charAt(0) }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900">{{ user.name }}</p>
            <p class="text-sm text-gray-400">{{ user.email }}</p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <span class="badge-blue capitalize">{{ user.role }}</span>
            <span
              class="badge capitalize"
              :class="{
                'badge-green':  user.status === 'active',
                'badge-yellow': user.status === 'suspended',
                'badge-red':    user.status === 'banned',
              }"
            >{{ user.status }}</span>
          </div>

          <div v-if="user.role !== 'admin'" class="shrink-0">
            <select
              :value="user.status"
              @change="updateStatus(user, $event.target.value)"
              class="input text-sm py-1 w-32"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        <Pagination
          v-if="lastPage > 1"
          :current-page="currentPage"
          :last-page="lastPage"
          @change="fetchUsers"
        />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { adminApi } from '@/api/admin'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import Pagination from '@/components/ui/Pagination.vue'
import { onMounted } from 'vue'

const loading      = ref(true)
const users        = ref([])
const search       = ref('')
const roleFilter   = ref('')
const statusFilter = ref('')
const currentPage  = ref(1)
const lastPage     = ref(1)

const debouncedFetch = useDebounceFn(() => fetchUsers(1), 400)

async function fetchUsers(page = 1) {
  loading.value = true
  currentPage.value = page
  try {
    const params = { page, per_page: 20 }
    if (search.value)       params.q      = search.value
    if (roleFilter.value)   params.role   = roleFilter.value
    if (statusFilter.value) params.status = statusFilter.value
    const response    = await adminApi.getUsers(params)
    const data        = response.data
    users.value       = data.data
    lastPage.value    = data.meta?.last_page || 1
    currentPage.value = data.meta?.current_page || 1
  } catch (err) { console.error(err) } finally {
    loading.value = false
  }
}

async function updateStatus(user, status) {
  try {
    await adminApi.updateUserStatus(user.id, { status })
    user.status = status
  } catch (err) { console.error(err) }
}

onMounted(() => fetchUsers())
</script>
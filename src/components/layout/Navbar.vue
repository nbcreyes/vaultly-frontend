<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">V</span>
          </div>
          <span class="font-bold text-xl text-gray-900">Vaultly</span>
        </RouterLink>

        <!-- Search bar -->
        <div class="hidden md:flex flex-1 max-w-lg mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="input pl-10 pr-4"
              @keydown.enter="handleSearch"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-3">

          <!-- Guest links -->
          <template v-if="!auth.isAuthenticated">
            <RouterLink to="/login" class="btn-secondary btn-sm">
              Log in
            </RouterLink>
            <RouterLink to="/register" class="btn-primary btn-sm">
              Sign up
            </RouterLink>
          </template>

          <!-- Authenticated links -->
          <template v-else>

            <!-- Notification bell -->
            <RouterLink to="/notifications" class="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span
                v-if="notifications.unreadCount > 0"
                class="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
              >
                {{ notifications.unreadCount > 9 ? '9+' : notifications.unreadCount }}
              </span>
            </RouterLink>

            <!-- Messages -->
            <RouterLink to="/messages" class="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </RouterLink>

            <!-- User menu -->
            <div class="relative" ref="userMenuRef">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  v-if="auth.user?.avatar_url"
                  :src="auth.user.avatar_url"
                  :alt="auth.user.name"
                  class="w-7 h-7 rounded-full object-cover"
                />
                <div v-else class="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                  <span class="text-brand-600 text-xs font-semibold">
                    {{ auth.user?.name?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown -->
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
              >
                <!-- User info -->
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ auth.user?.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
                  <span class="badge-blue mt-1">{{ auth.user?.role }}</span>
                </div>

                <!-- Links -->
                <RouterLink to="/purchases" class="dropdown-item" @click="userMenuOpen = false">
                  My Purchases
                </RouterLink>

                <RouterLink
                  v-if="auth.isSeller"
                  to="/seller/dashboard"
                  class="dropdown-item"
                  @click="userMenuOpen = false"
                >
                  Seller Dashboard
                </RouterLink>

                <RouterLink
                  v-if="auth.isAdmin"
                  to="/admin/dashboard"
                  class="dropdown-item"
                  @click="userMenuOpen = false"
                >
                  Admin Panel
                </RouterLink>

                <RouterLink
                  v-if="!auth.isSeller && !auth.isAdmin"
                  to="/become-seller"
                  class="dropdown-item"
                  @click="userMenuOpen = false"
                >
                  Become a Seller
                </RouterLink>

                <RouterLink to="/settings" class="dropdown-item" @click="userMenuOpen = false">
                  Settings
                </RouterLink>

                <div class="border-t border-gray-100 mt-1 pt-1">
                  <button
                    @click="handleLogout"
                    class="dropdown-item text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>

          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'

const auth          = useAuthStore()
const notifications = useNotificationsStore()
const router        = useRouter()

const searchQuery  = ref('')
const userMenuOpen = ref(false)
const userMenuRef  = ref(null)

onClickOutside(userMenuRef, () => {
  userMenuOpen.value = false
})

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'browse', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}

async function handleLogout() {
  userMenuOpen.value = false
  notifications.stopPolling()
  await auth.logout()
  router.push({ name: 'home' })
}
</script>

<style scoped>
.dropdown-item {
  @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer;
}
</style>
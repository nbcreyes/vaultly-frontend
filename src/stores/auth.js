import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

/**
 * Auth store — manages the authenticated user and token.
 *
 * The token is persisted to localStorage so the session
 * survives page refreshes. The user object is re-fetched
 * from /auth/me on app boot to ensure it is always current.
 */
export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null)
  const token = ref(localStorage.getItem('vaultly_token') || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isBuyer         = computed(() => user.value?.role === 'buyer')
  const isSeller        = computed(() => user.value?.role === 'seller')
  const isAdmin         = computed(() => user.value?.role === 'admin')
  const isVerified      = computed(() => !!user.value?.email_verified)

  /**
   * Register a new buyer account.
   */
  async function register(data) {
    const response = await authApi.register(data)
    return response.data
  }

  /**
   * Log in and persist the token.
   */
  async function login(data) {
    const response = await authApi.login(data)
    const payload  = response.data.data

    token.value = payload.token
    user.value  = payload.user

    localStorage.setItem('vaultly_token', payload.token)
    localStorage.setItem('vaultly_user', JSON.stringify(payload.user))

    return payload
  }

  /**
   * Log out and clear all persisted session data.
   */
  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout API errors — always clear local state
    } finally {
      token.value = null
      user.value  = null
      localStorage.removeItem('vaultly_token')
      localStorage.removeItem('vaultly_user')
    }
  }

  /**
   * Fetch the current user from the API.
   * Called on app boot to restore session state.
   */
  async function fetchUser() {
    if (!token.value) return null

    try {
      const response = await authApi.me()
      user.value = response.data.data
      return user.value
    } catch {
      // Token is invalid or expired — clear everything
      token.value = null
      user.value  = null
      localStorage.removeItem('vaultly_token')
      localStorage.removeItem('vaultly_user')
      return null
    }
  }

  /**
   * Update the local user object after a profile change.
   */
  function setUser(updatedUser) {
    user.value = updatedUser
    localStorage.setItem('vaultly_user', JSON.stringify(updatedUser))
  }

  return {
    user,
    token,
    isAuthenticated,
    isBuyer,
    isSeller,
    isAdmin,
    isVerified,
    register,
    login,
    logout,
    fetchUser,
    setUser,
  }
})
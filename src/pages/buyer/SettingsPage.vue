<template>
  <PublicLayout>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <h1 class="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

      <!-- Profile section -->
      <div class="card p-6 mb-6">
        <h2 class="font-semibold text-gray-900 mb-4">Profile</h2>

        <div class="flex items-center gap-4 mb-6">
          <div class="relative">
            <img
              v-if="auth.user?.avatar_url"
              :src="auth.user.avatar_url"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div v-else class="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
              <span class="text-2xl font-bold text-brand-600">
                {{ auth.user?.name?.charAt(0) }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <label class="btn-secondary btn-sm cursor-pointer">
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
              />
              {{ avatarLoading ? 'Uploading...' : 'Change photo' }}
            </label>
            <button
              v-if="auth.user?.avatar_url"
              @click="removeAvatar"
              class="btn-secondary btn-sm text-red-500"
            >
              Remove
            </button>
          </div>
        </div>

        <AlertBanner v-if="profileSuccess" variant="success" message="Profile updated." class="mb-4" />
        <AlertBanner v-if="profileError"   variant="error"   :message="profileError"   class="mb-4" />

        <div class="space-y-4">
          <div>
            <label class="label">Full name</label>
            <input v-model="profileForm.name" type="text" class="input" />
          </div>
          <div>
            <label class="label">Email address</label>
            <input :value="auth.user?.email" type="email" class="input bg-gray-50" disabled />
            <p class="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>
          <button
            @click="saveProfile"
            :disabled="profileLoading"
            class="btn-primary"
          >
            {{ profileLoading ? 'Saving...' : 'Save changes' }}
          </button>
        </div>
      </div>

      <!-- Password section -->
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">Change Password</h2>

        <AlertBanner v-if="passwordSuccess" variant="success" message="Password changed. All other devices have been logged out." class="mb-4" />
        <AlertBanner v-if="passwordError"   variant="error"   :message="passwordError"   class="mb-4" />

        <div class="space-y-4">
          <div>
            <label class="label">Current password</label>
            <input
              v-model="passwordForm.current_password"
              type="password"
              class="input"
              :class="{ 'input-error': passwordErrors.current_password }"
            />
            <p v-if="passwordErrors.current_password" class="error-message">{{ passwordErrors.current_password }}</p>
          </div>
          <div>
            <label class="label">New password</label>
            <input
              v-model="passwordForm.new_password"
              type="password"
              class="input"
              :class="{ 'input-error': passwordErrors.new_password }"
            />
            <p v-if="passwordErrors.new_password" class="error-message">{{ passwordErrors.new_password }}</p>
          </div>
          <div>
            <label class="label">Confirm new password</label>
            <input
              v-model="passwordForm.new_password_confirmation"
              type="password"
              class="input"
            />
          </div>
          <button
            @click="changePassword"
            :disabled="passwordLoading"
            class="btn-primary"
          >
            {{ passwordLoading ? 'Updating...' : 'Update password' }}
          </button>
        </div>
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userApi } from '@/api/user'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import AlertBanner from '@/components/ui/AlertBanner.vue'

const auth = useAuthStore()

// Profile
const profileLoading = ref(false)
const profileSuccess = ref(false)
const profileError   = ref('')
const avatarLoading  = ref(false)
const profileForm    = reactive({ name: '' })

// Password
const passwordLoading = ref(false)
const passwordSuccess = ref(false)
const passwordError   = ref('')
const passwordErrors  = reactive({ current_password: '', new_password: '' })
const passwordForm    = reactive({
  current_password:      '',
  new_password:          '',
  new_password_confirmation: '',
})

onMounted(() => {
  profileForm.name = auth.user?.name || ''
})

async function saveProfile() {
  profileLoading.value = true
  profileSuccess.value = false
  profileError.value   = ''
  try {
    const response = await userApi.updateProfile({ name: profileForm.name })
    auth.setUser(response.data.data.user)
    profileSuccess.value = true
  } catch (err) {
    profileError.value = err.message || 'Failed to save profile.'
  } finally {
    profileLoading.value = false
  }
}

async function handleAvatarUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  avatarLoading.value = true
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await userApi.uploadAvatar(formData)
    auth.setUser({ ...auth.user, avatar_url: response.data.data.avatar_url })
  } catch (err) {
    profileError.value = err.message || 'Failed to upload avatar.'
  } finally {
    avatarLoading.value = false
  }
}

async function removeAvatar() {
  try {
    await userApi.deleteAvatar()
    auth.setUser({ ...auth.user, avatar_url: null })
  } catch (err) {
    profileError.value = err.message || 'Failed to remove avatar.'
  }
}

async function changePassword() {
  passwordLoading.value = true
  passwordSuccess.value = false
  passwordError.value   = ''
  Object.keys(passwordErrors).forEach((k) => (passwordErrors[k] = ''))

  try {
    await userApi.changePassword(passwordForm)
    passwordSuccess.value = true
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.new_password_confirmation = ''
  } catch (err) {
    if (err.errors) {
      Object.keys(err.errors).forEach((k) => {
        if (passwordErrors[k] !== undefined) passwordErrors[k] = err.errors[k][0]
      })
    } else {
      passwordError.value = err.message || 'Failed to update password.'
    }
  } finally {
    passwordLoading.value = false
  }
}
</script>
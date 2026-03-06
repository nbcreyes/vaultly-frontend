import client from './client'

export const userApi = {
  updateProfile: (data) =>
    client.patch('/user/profile', data),

  uploadAvatar: (formData) =>
    client.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteAvatar: () =>
    client.delete('/user/avatar'),

  changePassword: (data) =>
    client.post('/user/change-password', data),
}
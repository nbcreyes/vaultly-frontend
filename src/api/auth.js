import client from './client'

export const authApi = {
  register: (data) =>
    client.post('/auth/register', data),

  verifyEmail: (data) =>
    client.post('/auth/verify-email', data),

  resendVerification: (data) =>
    client.post('/auth/resend-verification', data),

  login: (data) =>
    client.post('/auth/login', data),

  logout: () =>
    client.post('/auth/logout'),

  me: () =>
    client.get('/auth/me'),

  forgotPassword: (data) =>
    client.post('/auth/forgot-password', data),

  resetPassword: (data) =>
    client.post('/auth/reset-password', data),
}
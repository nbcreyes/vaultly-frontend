import client from './client'

export const adminApi = {
  // Dashboard
  summary: () =>
    client.get('/admin/dashboard/summary'),

  revenue: (params = {}) =>
    client.get('/admin/dashboard/revenue', { params }),

  topSellers: (params = {}) =>
    client.get('/admin/dashboard/top-sellers', { params }),

  // Users
  getUsers: (params = {}) =>
    client.get('/admin/users', { params }),

  updateUserStatus: (id, data) =>
    client.patch(`/admin/users/${id}/status`, data),

  // Products
  getProducts: (params = {}) =>
    client.get('/admin/products', { params }),

  updateProductStatus: (id, data) =>
    client.patch(`/admin/products/${id}/status`, data),

  // Seller applications
  getApplications: (params = {}) =>
    client.get('/admin/seller-applications', { params }),

  getApplication: (id) =>
    client.get(`/admin/seller-applications/${id}`),

  reviewApplication: (id, data) =>
    client.patch(`/admin/seller-applications/${id}/review`, data),

  // Payouts
  getPayouts: (params = {}) =>
    client.get('/admin/payouts', { params }),

  getPayout: (id) =>
    client.get(`/admin/payouts/${id}`),

  processPayout: (id, data) =>
    client.patch(`/admin/payouts/${id}/process`, data),

  // Refunds
  getRefunds: (params = {}) =>
    client.get('/admin/refunds', { params }),

  getRefund: (id) =>
    client.get(`/admin/refunds/${id}`),

  processRefund: (id, data) =>
    client.patch(`/admin/refunds/${id}/process`, data),
}
import client from './client'

export const sellerApi = {
  // Application
  submitApplication: (data) =>
    client.post('/seller/application', data),

  getApplication: () =>
    client.get('/seller/application'),

  // Store
  getStore: () =>
    client.get('/seller/store'),

  updateStore: (data) =>
    client.patch('/seller/store', data),

  uploadLogo: (formData) =>
    client.post('/seller/store/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteLogo: () =>
    client.delete('/seller/store/logo'),

  uploadBanner: (formData) =>
    client.post('/seller/store/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteBanner: () =>
    client.delete('/seller/store/banner'),

  // Products
  getProducts: (params = {}) =>
    client.get('/seller/products', { params }),

  getProduct: (id) =>
    client.get(`/seller/products/${id}`),

  createProduct: (formData) =>
    client.post('/seller/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateProduct: (id, formData) =>
    client.post(`/seller/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { _method: 'PATCH' },
    }),

  publishProduct: (id) =>
    client.post(`/seller/products/${id}/publish`),

  unpublishProduct: (id) =>
    client.post(`/seller/products/${id}/unpublish`),

  deleteProduct: (id) =>
    client.delete(`/seller/products/${id}`),

  addProductImages: (id, formData) =>
    client.post(`/seller/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteProductImage: (productId, imageId) =>
    client.delete(`/seller/products/${productId}/images/${imageId}`),

  // Dashboard
  dashboardSummary: () =>
    client.get('/seller/dashboard/summary'),

  dashboardSales: (params = {}) =>
    client.get('/seller/dashboard/sales', { params }),

  dashboardRevenue: (params = {}) =>
    client.get('/seller/dashboard/revenue', { params }),

  dashboardTopProducts: (params = {}) =>
    client.get('/seller/dashboard/top-products', { params }),

  dashboardTransactions: (params = {}) =>
    client.get('/seller/dashboard/transactions', { params }),

  // Payouts
  getPayouts: () =>
    client.get('/seller/payouts'),

  requestPayout: (data) =>
    client.post('/seller/payouts', data),
}
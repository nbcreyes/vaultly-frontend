import client from './client'

export const buyerApi = {
  purchases: (params = {}) =>
    client.get('/buyer/purchases', { params }),

  regenerateDownload: (orderItemId) =>
    client.post(`/buyer/downloads/${orderItemId}/regenerate`),

  refunds: (params = {}) =>
    client.get('/buyer/refunds', { params }),

  requestRefund: (data) =>
    client.post('/buyer/refunds', data),
}
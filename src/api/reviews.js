import client from './client'

export const reviewsApi = {
  submit: (data) =>
    client.post('/reviews', data),

  delete: (id) =>
    client.delete(`/reviews/${id}`),

  reply: (id, data) =>
    client.patch(`/reviews/${id}/reply`, data),
}
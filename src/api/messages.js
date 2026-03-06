import client from './client'

export const messagesApi = {
  inbox: () =>
    client.get('/messages'),

  thread: (orderId) =>
    client.get(`/messages/order/${orderId}`),

  send: (orderId, data) =>
    client.post(`/messages/order/${orderId}`, data),

  markRead: (orderId) =>
    client.post(`/messages/order/${orderId}/read`),
}
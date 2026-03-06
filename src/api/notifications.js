import client from './client'

export const notificationsApi = {
  list: (params = {}) =>
    client.get('/notifications', { params }),

  unreadCount: () =>
    client.get('/notifications/unread-count'),

  markRead: (id) =>
    client.post(`/notifications/${id}/read`),

  markAllRead: () =>
    client.post('/notifications/read-all'),
}
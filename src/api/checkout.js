import client from './client'

export const checkoutApi = {
  create: (data) =>
    client.post('/checkout/create', data),

  capture: (data) =>
    client.post('/checkout/capture', data),
}
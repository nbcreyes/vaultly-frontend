import client from './client'

export const browseApi = {
  featured: () =>
    client.get('/browse/featured'),

  categories: () =>
    client.get('/browse/categories'),

  products: (params = {}) =>
    client.get('/browse/products', { params }),

  productDetail: (slug) =>
    client.get(`/browse/products/${slug}`),

  productReviews: (slug, params = {}) =>
    client.get(`/browse/products/${slug}/reviews`, { params }),

  categoryProducts: (slug, params = {}) =>
    client.get(`/browse/categories/${slug}/products`, { params }),

  store: (slug) =>
    client.get(`/browse/stores/${slug}`),
}
import { api } from './api';

export const productService = {
  search: (params: Record<string, any>) =>
    api.get('/products/', { params }),

  getById: (id: number) =>
    api.get(`/products/${id}`),
};

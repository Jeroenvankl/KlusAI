import { useCallback, useState } from 'react';
import * as productService from '../services/productService';

interface Product {
  id: number;
  name: string;
  store: string;
  category: string;
  price: number;
  unit: string;
  product_url: string;
  brand: string;
  eco_score: number;
  in_stock: boolean;
}

interface UseProductsOptions {
  store?: string;
  category?: string;
  limit?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await productService.search({
          q: query,
          store: options.store,
          category: options.category,
          limit: options.limit || 20,
          offset: 0,
        });

        setProducts(result);
        return result;
      } catch (err: any) {
        setError(err.message || 'Zoeken mislukt');
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [options.store, options.category, options.limit],
  );

  const getById = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await productService.getById(id);
      return result;
    } catch (err: any) {
      setError(err.message || 'Product ophalen mislukt');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    products,
    isLoading,
    error,
    search,
    getById,
  };
};

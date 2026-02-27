export type Store = 'gamma' | 'praxis' | 'ikea' | 'karwei' | 'kwantum';

export interface Product {
  id: number;
  store: Store;
  category: string;
  subcategory: string | null;
  name: string;
  description: string | null;
  price: number | null;
  unit: string | null;
  productUrl: string | null;
  imageUrl: string | null;
  brand: string | null;
  ecoScore: string | null;
  inStock: boolean;
  tags: string[];
}

export interface CartItem {
  id: number;
  projectId: number;
  product: Product | null;
  paintColor: import('./paint').PaintColor | null;
  quantity: number;
  unit: string | null;
  notes: string | null;
}

export interface ShoppingCart {
  items: CartItem[];
  totalCost: number;
  byStore: Record<Store, CartItem[]>;
}

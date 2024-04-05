import { Product } from '@/ts';

export interface CartState {
  loading: boolean;
  count: number;
  items: CartItem[];
  total: number;
  showCart: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

import { Product } from '@/ts';

export interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

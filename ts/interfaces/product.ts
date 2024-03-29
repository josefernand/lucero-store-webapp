import { Material, ProductType } from '@/ts';

export interface Product {
  id: string;
  productType?: ProductType;
  material?: Material;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrls?: string[];
  purchasePrice?: number;
  supplierId?: string;
  supplierProductId?: string;
  available: boolean;
  created?: Date;
  updated?: Date;
}

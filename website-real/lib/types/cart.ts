import { ICartItem } from '@/database/Cart';
import { IProduct } from '@/database/Product';

export interface PopulatedCartItem extends Omit<ICartItem, 'product'> {
  product: IProduct;
}

export interface PopulatedCart {
  _id: string;
  user?: string;
  sessionId?: string;
  items: PopulatedCartItem[];
  totalAmount: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

import { LocationAndName } from './checkoutSteps.interface';

export interface IOrderProduct {
  originalProductId: number;
  categoryId: number;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export type orderStatus = 'WAITING_FOR_PAYMENT' | 'PAID' | 'DELIVERED' | 'CANCELLED';

export interface IOrder {
  id?: number;
  userId: number | null;
  products: IOrderProduct[];
  status: orderStatus;
  deliveryPrice: number;
  totalPrice: number;
  createdAt: number;
  updatedAt?: number;
  deliveredAt?: number | null;
  deliveryType: string;
  deliveryAddress: LocationAndName | null;
}

export interface IOrderFilterParams {
  status?: string;
  year?: string;
}

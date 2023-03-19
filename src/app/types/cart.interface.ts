import { IProduct } from './product.model';
export interface ICartList {
  [key: string]: ICart;
}
export interface ICart {
  checked: boolean;
  amount: number;
  product: IProduct;
  addingTime: number;
}

export interface IProductsWithLastAddingTime {
  lastAddingTime: number;
  products: IProduct[];
}

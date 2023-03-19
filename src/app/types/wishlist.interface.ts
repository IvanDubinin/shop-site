export interface IWishlist {
  id: number | null;
  name: string;
  isDefault?: boolean;
  userId: number;
  products: number[];
}

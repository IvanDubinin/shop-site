export interface IRawProduct {
  id: number;
  name: string;
  categoryName: string;
  details: { [key: string]: string };
  description: Array<string>;
  price: number;
  discountPrice: number;
  category: number;
  images: Array<string>;
  createdAt: number;
  updatedAt: number;
  sellerId: number;
  sellerName: string;
}

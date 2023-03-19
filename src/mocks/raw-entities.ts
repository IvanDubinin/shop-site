import { rawProductToIProduct } from 'src/app/types/builders/raw-product-to-product';
import { IRawProduct } from 'src/app/types/raw-product.interface';
import { IUser } from 'src/app/types/user.interface';
import { IOrder } from '../app/types/order.interfaces';
import { IWishlist } from '../app/types/wishlist.interface';

export const rawProductMock: IRawProduct = {
  id: 0,
  name: 'Awesome Metal Pants',
  categoryName: 'Garden',
  description: ['Aut tempore quos et.'],
  price: 1101917,
  discountPrice: 10000,
  category: 0,
  images: [
    'https://c.dns-shop.ru/thumb/st1/fit/200/200/33c9b6f00b441d9076a8e1c474d4e4fe/01887601edc06ab7832297e19078785229299f4f39adbf7e8ec9b7491c794dbf.jpg.webp'
  ],
  details: {
    nostrum: 'Voluptates quis sint possimus a.'
  },
  createdAt: 1574997070417,
  updatedAt: 1640341947412,
  sellerId: 2,
  sellerName: 'Durgan - Leffler'
};

export const rawUserMock: IUser = {
  id: 0,
  firstName: 'petya',
  lastName: 'vasechkin',
  email: 'petyavs@bing.com',
  password: '!23%%&GfA',
  role: 'consumer'
};

export const rawOrderMock: IOrder = {
  id: 1,
  userId: 4,
  products: [
    {
      originalProductId: 58,
      categoryId: 11,
      price: 12233,
      quantity: 4
    },
    {
      originalProductId: 208,
      categoryId: 11,
      price: 4507,
      quantity: 1
    }
  ],
  status: 'WAITING_FOR_PAYMENT',
  deliveryPrice: 90,
  totalPrice: 53529,
  createdAt: 1648545853778,
  updatedAt: 1648545853778,
  deliveredAt: 1648545853778,
  deliveryType: 'Courier service delivery',
  deliveryAddress: null
};

export const rawSellerMock: IUser = {
  id: 1,
  firstName: 'Vasya',
  lastName: 'Pupkin',
  email: 'vp@bing.com',
  password: '!23%%&GfA',
  role: 'seller'
};

export const ICartProduct = {
  checked: true,
  amount: 1,
  product: rawProductToIProduct(rawProductMock),
  addingTime: Date.now()
};

export const rawWishlistMock: IWishlist = {
  id: 1,
  name: 'Mock wishlist',
  userId: 1,
  isDefault: false,
  products: [0]
};

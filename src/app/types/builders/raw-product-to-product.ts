import { IRawProduct } from '../raw-product.interface';
import { IProduct } from '../product.model';
import { msToDate } from '../../helpers/msToDate';

export const rawProductToIProduct = (rawProduct: IRawProduct): IProduct => {
  return new IProduct(
    rawProduct.id,
    rawProduct.name,
    rawProduct.categoryName,
    new Map(Object.entries(rawProduct.details)),
    rawProduct.description,
    rawProduct.price,
    rawProduct.discountPrice,
    rawProduct.category,
    rawProduct.images,
    msToDate(rawProduct.createdAt),
    msToDate(rawProduct.updatedAt),
    rawProduct.sellerId,
    rawProduct.sellerName
  );
};

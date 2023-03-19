export class IProduct {
  constructor(
    public id: number,
    public name: string,
    public categoryName: string,
    public details: Map<string, string>,
    public description: Array<string>,
    public price: number,
    public discountPrice: number,
    public category: number,
    public images: Array<string>,
    public createdAt: Date,
    public updatedAt: Date,
    public sellerId: number,
    public sellerName: string
  ) {}
}

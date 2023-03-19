interface ProductCardSettings {
  defaultImgPath: string;
  hostCssClasses: { [key: string]: string };
  viewModes: { [key: string]: string };
}

export const productItemCardSettings: ProductCardSettings = {
  defaultImgPath: '../assets/images/no-image-available.jpg',
  hostCssClasses: {
    list: 'list-view',
    bar: 'bar-view'
  },
  viewModes: {
    list: 'list',
    bar: 'bar'
  }
};

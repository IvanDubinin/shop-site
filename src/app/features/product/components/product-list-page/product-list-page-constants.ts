export const FILTER_OPTIONS: { [key: string]: { [key: string]: string } } = {
  'From old to new': {
    sort: 'updatedAt',
    order: 'asc'
  },
  'From new to old': {
    sort: 'updatedAt',
    order: 'desc'
  },
  'From cheap to expensive': {
    sort: 'discountPrice',
    order: 'asc'
  },
  'From expensive to cheap': {
    sort: 'discountPrice',
    order: 'desc'
  }
};
export const DEFAULT_FILTER_OPTION = 'From old to new';

export const DEFAULT_PLP_IHTTP_PARAMS = {
  sort: 'updatedAt',
  order: 'asc',
  limit: 6,
  page: 1,
  search: '',
  category: ''
};

export const viewModes = {
  list: 'list',
  bar: 'bar'
};

export const resizeThreshold = 768;

export const FILTER_INDEXES: { [key: string]: string } = {
  updatedAtasc: 'From old to new',
  updatedAtdesc: 'From new to old',
  priceasc: 'From cheap to expensive',
  pricedesc: 'From expensive to cheap'
};

import { IQueryParams } from '../types/queryParams.interface';
import { FilterOptions, paramsOptions } from '../constants/constants';

export const buildParamsObject = (params: IQueryParams) => {
  const resObj: IQueryParams = {};
  for (let param in FilterOptions) {
    if (params[param]) {
      resObj[paramsOptions[param]] = params[param];
    }
  }
  return resObj;
};

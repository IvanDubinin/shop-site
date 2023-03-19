import { IConfig } from 'ngx-mask/lib/config';
import { IParamsOptions } from '../types/httpParamsOptions.interface';
import { INotification } from '../types/notification.interface';

export enum FilterOptions {
  'sort',
  'order',
  'limit',
  'page',
  'category',
  'productId',
  'userId',
  'search',
  'email',
  'id'
}

export const paramsOptions: IParamsOptions = {
  sort: '_sort',
  order: '_order',
  limit: '_limit',
  page: '_page',
  category: 'category',
  productId: 'productId',
  userId: 'userId',
  search: 'q',
  email: 'email',
  id: 'id'
};
export const maskConfig: Partial<IConfig> = {
  validation: false
};
const TMP_TIMEOUT = 3500; /* change timeouts to environment's DEFAULT_TIMEOUT when it'll be created in upcoming fix */
export const ERROR_INOTIFICATONS = {
  clientSide: {
    title: 'app network error',
    message: 'error occured during network request. Please, try again in a several moments',
    removeByTimeout: TMP_TIMEOUT
  },
  navigatorOffline: {
    title: 'no internet connection',
    message: 'check your internet connection and try again later',
    removeByTimeout: TMP_TIMEOUT
  },
  serverSide: {
    title: 'sever network error',
    message:
      'please try again in a several minutes. If problem will persist in the future, please contact support',
    removeByTimeout: TMP_TIMEOUT
  },
  apiNetworkError: {
    title: 'unknown error',
    message: 'If problem will persist in the future, please contact support',
    removeByTimeout: TMP_TIMEOUT
  },
  unhandledException: {
    title: 'unhandled exception',
    message:
      'oops... something went wrong by our side. Please, try again and contact support if problem continues to persist',
    removeByTimeout: TMP_TIMEOUT
  }
};

export const ERROR_INOTIFICATONS_HTTP_CODES: { [key: number]: INotification } = {
  404: {
    title: 'resource not found',
    message: 'resource temporary unavailable or does not exist',
    removeByTimeout: TMP_TIMEOUT
  },
  401: {
    title: 'unauthorized',
    message: 'check your credentials and try again',
    removeByTimeout: TMP_TIMEOUT
  }
};

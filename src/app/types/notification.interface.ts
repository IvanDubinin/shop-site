export type IInnerNotificationType = 'error' | 'information' | 'business-action';

export interface INotification {
  title: string;
  message: string;
  link?: 'string';
  removeByTimeout?: number;
  isKeptOpen?: boolean;
}

export interface IInnerNotification extends INotification {
  type: IInnerNotificationType;
}

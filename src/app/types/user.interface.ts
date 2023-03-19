import { Roles } from './roles';

export interface IUser {
  id: number;
  picture?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  email: string;
  dateOfBirth?: number;
  phoneNumber?: string;
  password: string;
  role: Roles;
  spentMoney?: number;
  organizationName?: string;
}

export interface IAvatarCloudResponse {
  url: string;
}

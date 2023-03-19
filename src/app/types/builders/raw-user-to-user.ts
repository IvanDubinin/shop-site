import { msToDate } from 'src/app/helpers/msToDate';
import { IRawUser } from '../raw-user.interface';
import { User } from '../user.model';

export const rawUserToIUser = (rawUser: IRawUser): User => {
  return new User(
    rawUser.id,
    rawUser.email,
    rawUser.password,
    rawUser.picture,
    rawUser.title,
    rawUser.firstName,
    rawUser.lastName,
    rawUser.gender,
    msToDate(rawUser.dateOfBirth!),
    rawUser.phoneNumber
  );
};

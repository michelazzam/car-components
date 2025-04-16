import { IUser } from '../user.schema';

// 💡 This interface is used to define the user data that will be extracted from the request object
export interface ReqUserData extends Omit<IUser, 'password'> {
  // Excluding the 'password' field from IUser
}

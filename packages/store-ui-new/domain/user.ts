export interface User {
  _id: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

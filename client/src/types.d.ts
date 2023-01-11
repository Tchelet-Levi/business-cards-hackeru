export interface APIResponse<T> {
  success: boolean;
  message: string | T;
}

export interface IBusinessCard {
  card_id: string;
  createdOn: string;
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  businessPhone: string;
  businessImage?: string;
}

export interface IUserInfo {
  user_id: string;
  email: string;
  fullName: string;
  isBusinessAccount: boolean;
  avatar?: string;
}

export interface ISignUpForm {
  email: string;
  fullName: string;
  password: string;
  isBusinessAccount: boolean;
  avatar?: string;
}

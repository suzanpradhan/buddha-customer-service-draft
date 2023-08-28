export interface LoginRequestType {
  username: string;
  password: string;
}

export interface RegisterRequestType {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordRequestType {
  email: string;
}

export const authTypes = {
  REGISTER_SUBMIT: 'REGISTER_SUBMIT',
  SET_USER: 'SET_USER',
  SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  FORGOT_PASSWORD_SUBMIT: 'FORGOT_PASSWORD_SUBMIT',
  SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
};

export interface AuthenticatedUser {
  name: string;
  email: string;
  avatar: string;
  email_verified_at: Date;
}

export interface AuthReponseType {
  access_token: string;
  user: AuthenticatedUser;
  status: string;
}

export interface GetUserReponseType {
  name: string;
  email: string;
}

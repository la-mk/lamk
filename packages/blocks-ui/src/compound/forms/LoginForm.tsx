import React, { useContext } from 'react';
import { LocalizationContext } from '../../basic/Provider';
import { AuthFormBase } from './AuthFormBase';
import { FormProps } from '../../basic/NewForm/NewForm';

export interface LoginFormProps extends FormProps<any> {
  login: (credentials: LoginCredentials) => void;
  onSignupNowClick: (data?: any) => void;
  onForgotPasswordClick: () => void;
  logoUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const LoginForm = ({
  login,
  onSignupNowClick,
  onForgotPasswordClick,
  logoUrl,
  ...otherProps
}: LoginFormProps) => {
  const localization = useContext(LocalizationContext);

  return (
    <AuthFormBase
      {...otherProps}
      logoUrl={logoUrl}
      onPrimary={login}
      primaryText={localization.login || 'Log in'}
      secondaryText={localization.signup || 'Sign up'}
      forgotPasswordText={
        localization.forgotPassword || 'Forgot your password?'
      }
      onSecondary={onSignupNowClick}
      onForgotPassword={onForgotPasswordClick}
    />
  );
};

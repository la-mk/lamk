import React, { useContext } from 'react';
import { LocalizationContext } from '../../basic/Provider';
import { AuthFormBase } from './AuthFormBase';
import { FormProps } from '../../basic/NewForm/NewForm';

export interface LoginProps extends FormProps<any> {
  signup: (credentials: SignupCredentials) => void;
  onLoginNowClick: () => void;
  logoUrl?: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

export const SignupForm = ({
  signup,
  onLoginNowClick,
  logoUrl,
  ...otherProps
}: LoginProps) => {
  const localization = useContext(LocalizationContext);

  return (
    <AuthFormBase
      {...otherProps}
      logoUrl={logoUrl}
      onPrimary={signup}
      primaryText={localization.signup || 'Sign up'}
      secondaryText={localization.login || 'Log in'}
      onSecondary={onLoginNowClick}
    />
  );
};

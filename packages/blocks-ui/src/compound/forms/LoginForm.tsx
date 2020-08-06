import React, { useContext } from 'react';
import { formInput, formPassword } from '../FormHelpers';
import { FormItem, FormHandlers } from '../../basic/Form/Form';
import { LocalizationContext } from '../../basic/Provider';
import { AuthFormBase } from './AuthFormBase';

export interface LoginProps extends FormHandlers {
  login: (credentials: LoginCredentials) => void;
  onSignupNowClick: () => void;
  logoUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const LoginForm = ({
  login,
  onSignupNowClick,
  logoUrl,
  ...otherProps
}: LoginProps) => {
  const localization = useContext(LocalizationContext);

  return (
    <AuthFormBase
      logoUrl={logoUrl}
      onPrimary={login}
      primaryText={localization.login || 'Log in'}
      secondaryText={localization.signup || 'Sign up'}
      onSecondary={onSignupNowClick}
      {...otherProps}
    >
      <FormItem selector="email" label={localization.email || 'Email address'}>
        {formInput({ size: 'large' })}
      </FormItem>

      <FormItem selector="password" label={localization.password || 'Password'}>
        {formPassword({ size: 'large' })}
      </FormItem>
    </AuthFormBase>
  );
};

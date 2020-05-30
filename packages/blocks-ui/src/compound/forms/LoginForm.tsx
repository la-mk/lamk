import React, { useContext } from 'react';
import { formInput } from '../FormHelpers';
import { FormItem, FormHandlers } from '../../basic/Form/Form';
import { Text } from '../../basic/Typography';
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
      <FormItem
        selector="email"
        label={
          <Text fontSize={0}>{localization.email || 'Email address'}</Text>
        }
      >
        {formInput({ size: 'large' })}
      </FormItem>

      <FormItem
        selector="password"
        label={<Text fontSize={0}>{localization.password || 'Password'}</Text>}
      >
        {formInput({ size: 'large', type: 'password' })}
      </FormItem>
    </AuthFormBase>
  );
};

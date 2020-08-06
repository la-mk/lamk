import React, { useContext } from 'react';
import { formInput, formPassword } from '../FormHelpers';
import { FormItem, FormHandlers } from '../../basic/Form/Form';
import { LocalizationContext } from '../../basic/Provider';
import { AuthFormBase } from './AuthFormBase';

export interface SignupProps extends FormHandlers {
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
}: SignupProps) => {
  const localization = useContext(LocalizationContext);

  return (
    <AuthFormBase
      logoUrl={logoUrl}
      onPrimary={signup}
      primaryText={localization.signup || 'Sign up'}
      secondaryText={localization.login || 'Log in'}
      onSecondary={onLoginNowClick}
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

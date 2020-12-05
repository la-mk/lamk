import React, { useContext } from 'react';
import { Flex } from '../../basic/Flex';
import { Text } from '../../basic/Text';
import { Heading } from '../../basic/Heading';
import { PoweredBy } from '../PoweredBy';
import { Button } from '../../basic/Button';
import { Box } from '../../basic/Box';
import { LocalizationContext } from '../../basic/Provider';
import { BaseSection } from './BaseSection';
import { NewForm, FormProps } from '../../basic/NewForm/NewForm';

interface AuthFormBaseProps extends FormProps<any> {
  logoUrl?: string;
  onPrimary: (data?: any) => void;
  onSecondary: (data?: any) => void;
  onForgotPassword?: () => void;
  primaryText: string;
  secondaryText: string;
  forgotPasswordText?: string;
}

export const AuthFormBase = ({
  logoUrl,
  onPrimary,
  onSecondary,
  onForgotPassword,
  primaryText,
  secondaryText,
  forgotPasswordText,
  ...otherProps
}: AuthFormBaseProps) => {
  const localization = useContext(LocalizationContext);

  return (
    <BaseSection>
      <Heading as="h2" mb={3} size="lg">
        {primaryText}
      </Heading>
      {logoUrl && (
        <Text color="mutedText.dark" align="center" size={'md'}>
          {localization.authSameAccount} <PoweredBy logoUrl={logoUrl} />
        </Text>
      )}

      <Box mt={4} width="100%">
        <NewForm<any>
          {...otherProps}
          onSubmit={({ formData }) => onPrimary(formData)}
          uiSchema={{
            email: {
              'ui:title': localization.email || 'Email address',
              'ui:options': {
                emphasized: true,
              },
            },
            password: {
              'ui:title': localization.password || 'Password',
              'ui:widget': 'password',
              'ui:placeholder': '********',
              'ui:options': {
                emphasized: true,
              },
            },
          }}
        >
          <Button isFullWidth size="lg" type="submit">
            {primaryText}
          </Button>
        </NewForm>
      </Box>

      <Flex align="center" justify="center" my={3}>
        <Text color="mutedText.dark">{localization.or || 'or'}</Text>
      </Flex>

      <Button size="lg" isFullWidth variant="outline" onClick={onSecondary}>
        {secondaryText}
      </Button>

      {onForgotPassword && (
        <Button mt={4} variant="link" onClick={onForgotPassword}>
          {forgotPasswordText}
        </Button>
      )}
    </BaseSection>
  );
};

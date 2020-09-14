import React, { useContext } from 'react';
import { Flex } from '../../basic/Flex';
import { Text, Title } from '../../basic/Typography';
import { PoweredBy } from '../PoweredBy';
import { Button } from '../../basic/Button';
import { Form } from '../../basic/Form/Form';
import { LocalizationContext } from '../../basic/Provider';

interface AuthFormBaseProps {
  children: React.ReactNode;
  logoUrl?: string;
  onPrimary: (data?: any) => void;
  onSecondary: (data?: any) => void;
  onForgotPassword?: () => void;
  primaryText: string;
  secondaryText: string;
  forgotPasswordText?: string;
}

export const AuthFormBase = ({
  children,
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
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      width={'100%'}
      maxWidth={600}
      minWidth={200}
      mx="auto"
    >
      <Title level={2} mb={3} fontSize={6}>
        {primaryText}
      </Title>
      {logoUrl && (
        <Text color="mutedText.dark" textAlign="center" fontSize={1}>
          {localization.authSameAccount} <PoweredBy logoUrl={logoUrl} />
        </Text>
      )}

      <Form
        mt={3}
        width="100%"
        labelCol={{ xs: { span: 24 } }}
        wrapperCol={{ xs: { span: 24 } }}
        layout="vertical"
        colon={false}
        onFormCompleted={onPrimary}
        {...otherProps}
      >
        {children}

        <Flex mt={4} justifyContent="center" alignItems="center">
          <Button width="100%" type="primary" htmlType="submit" size="large">
            {primaryText}
          </Button>
        </Flex>
      </Form>

      <Flex alignItems="center" justifyContent="center" my={3}>
        <Text color="mutedText.dark" fontSize={1}>{localization.or || 'or'}</Text>
      </Flex>

      <Button size="large" width="100%" type="default" onClick={onSecondary}>
        {secondaryText}
      </Button>

      {onForgotPassword && <Button mt={3} type="link" onClick={onForgotPassword}>{forgotPasswordText}</Button>}
    </Flex>
  );
};

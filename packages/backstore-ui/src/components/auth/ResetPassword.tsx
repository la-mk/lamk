import {
  Flex,
  hooks,
  ResetPasswordForm,
  Spin,
  Title,
  Text,
  Box,
  Button,
  message,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { AuthBase } from './AuthBase';

export const ResetPassword = ({
  resetToken,
}: {
  resetToken: string | null;
}) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const dispatch = useDispatch();

  const handleResetPasswordSubmitted = async (data: any) => {
    caller(
      sdk.user.patch(
        null,
        { password: data.password },
        { query: { email: data.email.toLowerCase(), resetToken } },
      ),
      () => {
        message.success(t('auth.resetPasswordSuccess'));
        dispatch(goTo('/login'));
      },
    );
  };

  return (
    <Spin spinning={showSpinner}>
      <AuthBase>
        <Flex
          width='100%'
          mx='auto'
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          <Title textAlign='center' level={2} mb={3} fontSize={6}>
            {t('auth.resetPassword')}
          </Title>
          <Text color='mutedText.dark' textAlign='center' fontSize={1}>
            {t('auth.resetPasswordExplanation')}
          </Text>
          <Box width='100%' mt={3}>
            <ResetPasswordForm
              onFormCompleted={handleResetPasswordSubmitted}
              validate={(data: any) => sdk.user.validate(data, true)}
              validateSingle={sdk.user.validateSingle}
              getErrorMessage={(errorName, context) =>
                t(`errors.${errorName}`, context)
              }
            />
          </Box>

          <Button mt={3} type='link' onClick={() => dispatch(goTo('/login'))}>
            {t('actions.loginInstead')}
          </Button>
        </Flex>
      </AuthBase>
    </Spin>
  );
};

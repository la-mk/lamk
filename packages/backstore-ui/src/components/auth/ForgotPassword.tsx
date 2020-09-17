import {
  Button,
  Flex,
  ForgotPasswordForm,
  hooks,
  Spin,
  Title,
  Box,
  Text,
  Result,
} from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { AuthBase } from './AuthBase';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [caller, showSpinner] = hooks.useCall();
  const [submittedSuccessfully, setSubmitttedSuccessfully] = React.useState(
    false,
  );

  const handleForgotPasswordSubmitted = async (data: any) => {
    caller(sdk.authManagement.resetPassword(data.email.toLowerCase()), () =>
      setSubmitttedSuccessfully(true),
    );
  };

  return (
    <Spin spinning={showSpinner}>
      <AuthBase>
        {!submittedSuccessfully && (
          <Flex
            width='100%'
            mx='auto'
            alignItems='center'
            justifyContent='center'
            flexDirection='column'
          >
            <Title textAlign='center' level={2} mb={3} fontSize={6}>
              {t('auth.forgotPassword')}
            </Title>
            <Text color='mutedText.dark' textAlign='center' fontSize={1}>
              {t('auth.forgotPasswordExplanation')}
            </Text>
            <Box width='100%' mt={3}>
              <ForgotPasswordForm
                onFormCompleted={handleForgotPasswordSubmitted}
                validate={(data: any) =>
                  sdk.authManagement.validate(data, true)
                }
                validateSingle={sdk.authManagement.validateSingle}
                getErrorMessage={(errorName, context) =>
                  t(`errors.${errorName}`, context)
                }
              />
            </Box>

            <Button mt={3} type='link' onClick={() => dispatch(goTo('/login'))}>
              {t('actions.loginInstead')}
            </Button>
          </Flex>
        )}

        {submittedSuccessfully && (
          <Flex
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
          >
            <Result
              status='success'
              title={t('auth.forgotPasswordSuccess')}
              subTitle={t('auth.forgotPasswordSuccessExplanation')}
            />
          </Flex>
        )}
      </AuthBase>
    </Spin>
  );
};

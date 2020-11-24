import React from 'react';
import {
  Spinner,
  Flex,
  hooks,
  message,
  Box,
  NewForm,
  Button,
} from '@sradevski/blocks-ui';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { sdk } from '@sradevski/la-sdk';
import { patchUser } from '../../../state/modules/user/user.module';
import { TFunction } from 'i18next';

export const PersonalForm = ({ user, t }: { user: User; t: TFunction }) => {
  const [caller, showSpinner] = hooks.useCall();
  const [userFormData, setUserFormData] = hooks.useFormState<Partial<User>>(
    user,
    {},
    [user],
  );

  const handlePatchAccount = ({ formData }: { formData: Partial<User> }) => {
    caller(sdk.user.patch(user._id, formData), (user: User) => {
      message.success(t('auth.accountUpdateSuccess'));
      return patchUser(user);
    });
  };

  return (
    <Spinner isLoaded={!showSpinner}>
      {/* TODO: Add to blocks ui */}
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        width={'100%'}
        maxWidth={600}
        minWidth={200}
        mx='auto'
      >
        <Box width='100%'>
          <NewForm<Pick<User, 'firstName' | 'lastName' | 'phoneNumber'>>
            schema={sdk.utils.schema.pick(sdk.user.schema, [
              'firstName',
              'lastName',
              'phoneNumber',
            ])}
            uiSchema={{
              firstName: {
                'ui:title': t('common.firstName'),
                'ui:options': {
                  emphasized: true,
                },
              },
              lastName: {
                'ui:title': t('common.lastName'),
                'ui:options': {
                  emphasized: true,
                },
              },
              phoneNumber: {
                'ui:title': t('common.phoneNumber'),
                'ui:options': {
                  emphasized: true,
                },
              },
            }}
            onSubmit={handlePatchAccount}
            onChange={({ formData }) => setUserFormData(formData)}
            formData={userFormData}
            getErrorMessage={(errorName, context) =>
              t(`errors.${errorName}`, context)
            }
          >
            <Button isFullWidth type='submit' size='lg'>
              {t('actions.update')}
            </Button>
          </NewForm>
        </Box>
      </Flex>
    </Spinner>
  );
};

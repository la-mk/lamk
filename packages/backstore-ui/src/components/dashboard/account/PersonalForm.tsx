import React from 'react';
import { Spin, Flex, UserForm, hooks, message } from '@sradevski/blocks-ui';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { sdk } from '@sradevski/la-sdk';
import { patchUser } from '../../../state/modules/user/user.module';
import { TFunction } from 'i18next';
import { pickDiff } from '../../../common/utils';

export const PersonalForm = ({ user, t }: { user: User; t: TFunction }) => {
  const [caller, showSpinner] = hooks.useCall();

  const handlePatchAccount = (updatedUser: User) => {
    const updatedFields = pickDiff(user, updatedUser);
    caller(sdk.user.patch(user._id, updatedFields), (user: User) => {
      message.success(t('auth.accountUpdateSuccess'));
      return patchUser(user);
    });
  };

  return (
    <Spin spinning={showSpinner}>
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        width={'100%'}
        maxWidth={600}
        minWidth={200}
        mx='auto'
      >
        <UserForm
          size='large'
          onFormCompleted={handlePatchAccount}
          externalState={user}
          validate={(data: any) => sdk.user.validate(data, true)}
          validateSingle={sdk.user.validateSingle}
          getErrorMessage={(errorName: any, context: any) =>
            t(`errors.${errorName}`, context)
          }
        />
      </Flex>
    </Spin>
  );
};

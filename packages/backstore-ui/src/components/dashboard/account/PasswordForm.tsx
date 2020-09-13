import React from 'react';
import omit from 'lodash/omit';
import {
  Spin,
  Flex,
  hooks,
  message,
  ChangePasswordForm,
} from '@sradevski/blocks-ui';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { sdk } from '@sradevski/la-sdk';
import { patchUser } from '../../../state/modules/user/user.module';
import { TFunction } from 'i18next';
import { pickDiff } from '../../../common/utils';

export const PasswordForm = ({ user, t }: { user: User; t: TFunction }) => {
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
        <ChangePasswordForm
          size='large'
          onFormCompleted={handlePatchAccount}
          externalState={user}
          // We don't want to validate `currentPassword` as it is a special field that is only used for comparison
          validate={(data: any) =>
            sdk.user.validate(omit(data, ['currentPassword']) as User, true)
          }
          validateSingle={(val: any, selector: any) => {
            if (selector === 'currentPassword') {
              return;
            }
            return sdk.user.validateSingle(val, selector);
          }}
          getErrorMessage={(errorName: any, context: any) =>
            t(`errors.${errorName}`, context)
          }
        />
      </Flex>
    </Spin>
  );
};

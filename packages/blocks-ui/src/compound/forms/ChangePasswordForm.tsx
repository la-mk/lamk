import React, { useContext } from 'react';
import { Button } from '../../basic/Button';
import { Box } from '../../basic/Box';
import { LocalizationContext } from '../../basic/Provider';
import { BaseSection } from './BaseSection';
import { NewForm, FormProps } from '../../basic/NewForm/NewForm';

export interface ChangePasswordFormProps<T> extends FormProps<T> {
  emphasized?: boolean;
}

export const ChangePasswordForm = <T extends any>({
  emphasized,
  ...props
}: ChangePasswordFormProps<T>) => {
  const localization = useContext(LocalizationContext);

  return (
    <BaseSection>
      <Box width="100%">
        <NewForm<T>
          {...props}
          uiSchema={{
            currentPassword: {
              'ui:title': localization.currentPassword || 'Current password',
              'ui:placeholder': '********',
              'ui:widget': 'password',
              'ui:options': {
                emphasized,
              },
            },
            password: {
              'ui:title': localization.newPassword || 'New password',
              'ui:placeholder': '********',
              'ui:widget': 'password',
              'ui:options': {
                emphasized,
              },
            },
          }}
        >
          <Button width="100%" size="large" type="primary" htmlType="submit">
            {localization.update || 'Update'}
          </Button>
        </NewForm>
      </Box>
    </BaseSection>
  );
};

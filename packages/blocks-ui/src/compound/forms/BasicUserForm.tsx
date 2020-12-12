import React, { useContext } from 'react';
import { Button } from '../../basic/Button';
import { Box } from '../../basic/Box';
import { LocalizationContext } from '../../basic/Provider';
import { BaseSection } from './BaseSection';
import { NewForm, FormProps } from '../../basic/NewForm/NewForm';

export interface BasicUserFormProps<T> extends FormProps<T> {
  emphasized?: boolean;
}

export const BasicUserForm = <T extends any>({
  emphasized,
  ...props
}: BasicUserFormProps<T>) => {
  const localization = useContext(LocalizationContext);

  return (
    <BaseSection>
      <Box width="100%">
        <NewForm<T>
          {...props}
          uiSchema={{
            firstName: {
              'ui:title': localization.firstName || 'First name',
              'ui:options': {
                emphasized,
              },
            },
            lastName: {
              'ui:title': localization.lastName || 'Last name',
              'ui:options': {
                emphasized,
              },
            },
            phoneNumber: {
              'ui:title': localization.phoneNumber || 'Phone number',
              'ui:options': {
                emphasized,
              },
            },
          }}
        >
          <Button isFullWidth size="lg" type="submit">
            {localization.update || 'Update'}
          </Button>
        </NewForm>
      </Box>
    </BaseSection>
  );
};

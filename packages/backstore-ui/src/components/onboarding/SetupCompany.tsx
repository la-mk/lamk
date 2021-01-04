import * as React from 'react';
import { Flex, Heading, Text, Box, Button } from '@la-mk/blocks-ui';
import { useTranslation } from 'react-i18next';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { CompanyForm } from '../shared/forms/CompanyForm';

interface SetupCompanyProps {
  onDone: ({ formData }: { formData: Partial<Store> | null }) => void;
  store: Partial<Store> | null;
}

export const SetupCompany = ({ onDone, store }: SetupCompanyProps) => {
  const { t } = useTranslation();

  if (!store) {
    return (
      <span>
        It seems you haven't set up the store yet, let's do that first.
      </span>
    );
  }

  return (
    <>
      <Flex mb={6} align='center' direction='column'>
        <Heading as='h3' align='center'>
          {t('onboarding.setupCompanyTitle')}
          <Button
            mx={3}
            variant='outline'
            onClick={() => onDone({ formData: null })}
          >
            {t('actions.continue')}
          </Button>
        </Heading>
        <Text align='center' color='secondary'>
          {t('onboarding.setupCompanySubtitle')}
        </Text>
      </Flex>
      <Flex
        align='center'
        justify='center'
        direction='column'
        width={'100%'}
        maxWidth={800}
        minWidth={300}
        mx='auto'
      >
        <Box width='100%'>
          <CompanyForm store={store} onDone={onDone} />
        </Box>
      </Flex>
    </>
  );
};

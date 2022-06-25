import { Box, Flex, Result } from '@la-mk/blocks-ui';
import React from 'react';
import { useTheme } from '@chakra-ui/react';
import { PersonalInfo } from '../shared/icons/PersonalInfo';
import { AccountMenu } from './AccountMenu';
import { useTranslation } from '../../common/i18n';

export const Account = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Flex>
      <Box display={['block', 'none', 'none']} width='100%'>
        <AccountMenu />
      </Box>
      <Flex
        align='center'
        justify='center'
        mx='auto'
        mt={8}
        display={['none', 'flex', 'flex']}
        width='100%'
      >
        <Result
          status='success'
          icon={
            <PersonalInfo
              primary={theme.colors.primary['500']}
              backgroundLight={theme.colors.background.light}
              backgroundDark={theme.colors.background.dark}
              muted={theme.colors.mutedText.dark}
            />
          }
          title={t('auth.welcomeToAccount')}
          description={t('auth.welcomeToAccountExplanation')}
        />
      </Flex>
    </Flex>
  );
};

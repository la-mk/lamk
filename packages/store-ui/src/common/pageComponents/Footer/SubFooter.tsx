import React from 'react';
import {
  Flex,
  Text,
  Box,
  PoweredBy,
  Image,
  LanguagePicker,
} from '@sradevski/blocks-ui';
import { withTheme } from 'styled-components';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';
import { useTranslation } from '../../i18n';

export const SubFooter = withTheme(({ theme }: { theme: BlocksTheme }) => {
  const { t, i18n } = useTranslation();
  return (
    <Flex
      justify={['center', 'space-between', 'space-between']}
      align='center'
      px={[4, 5, 6]}
      my={2}
      direction={['column', 'row', 'row']}
    >
      <Text color='text.light' size='sm' mr={[0, 3, 3]} mb={[3, 0, 0]}>
        © 2020 All rights reserved
      </Text>

      <PoweredBy logoUrl={'/images/lamk-logo/horizontal-inverse.svg'} inverse />

      <Flex mt={[4, 0, 0]} ml={[0, 4, 4]} justify='center' align='center'>
        <Flex mr={5} align='center' justify='center'>
          <Text color='text.light'>
            <LanguagePicker
              darkMode
              languageCode={i18n.language}
              onChangeLanguageCode={key => i18n.changeLanguage(key)}
            />
          </Text>
        </Flex>
        <Box mr={2} p={2} bg='background.light'>
          <Box height={'22px'}>
            <Image
              height={22}
              src={'/images/mastercard.svg'}
              alt='mastercard logo'
            />
          </Box>
        </Box>
        <Box ml={2} p={2} bg='background.light'>
          <Box height={'22px'}>
            <Image height={22} src={'/images/visa.svg'} alt='visa logo' />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
});

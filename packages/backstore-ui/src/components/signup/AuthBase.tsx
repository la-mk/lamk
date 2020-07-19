import React from 'react';
import { Flex, LanguagePicker, Box } from '@sradevski/blocks-ui';
import { CustomCard } from '../shared/components/CustomCard';
import { useTranslation } from 'react-i18next';

export const AuthBase = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();

  return (
    <Flex
      width='100vw'
      height='100vh'
      alignItems='center'
      justifyContent='center'
      bg='background.light'
    >
      <Box
        style={{
          position: 'absolute',
          top: 32,
          right: 32,
        }}
      >
        <LanguagePicker
          languageCode={i18n.language}
          onChangeLanguageCode={key => i18n.changeLanguage(key)}
        />
      </Box>
      <CustomCard
        bg='#fff'
        width={460}
        minWidth={320}
        flexDirection='column'
        alignItems='center'
        p={4}
      >
        {children}
      </CustomCard>
    </Flex>
  );
};

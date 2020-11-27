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
      align='center'
      justify='center'
      bg='background.light'
    >
      {/* TODO: Add Fixed component that allows you to pass the below as props */}
      <Box
        // @ts-ignore
        style={{
          position: 'absolute',
          top: 16,
          right: 32,
          zIndex: 2,
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
        direction='column'
        align='center'
        p={4}
      >
        {children}
      </CustomCard>
    </Flex>
  );
};

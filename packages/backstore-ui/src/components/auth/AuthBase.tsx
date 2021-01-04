import React from 'react';
import { Flex, LanguagePicker, Box, Card } from '@la-mk/blocks-ui';
import { useTranslation } from 'react-i18next';

export const AuthBase = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();

  return (
    <Flex
      width='100vw'
      height='100vh'
      align='center'
      justify='center'
      bg='#F6F8FF'
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
      <Card bg='#fff' width={460} minWidth={320}>
        {children}
      </Card>
    </Flex>
  );
};

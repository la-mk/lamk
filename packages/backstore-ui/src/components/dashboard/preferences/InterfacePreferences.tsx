import React from 'react';
import { Col, Button } from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';

export const InterfacePreferences = () => {
  const { i18n } = useTranslation();

  return (
    <Col>
      <Button
        mr={2}
        type={i18n.language === 'mk' ? 'primary' : undefined}
        onClick={() => i18n.changeLanguage('mk')}
      >
        mk
      </Button>
      <Button
        ml={2}
        type={i18n.language === 'en' ? 'primary' : undefined}
        onClick={() => i18n.changeLanguage('en')}
      >
        en
      </Button>
    </Col>
  );
};

import React from 'react';
import { FocusCard } from './FocusCard';
import { useTranslation } from '../common/i18n';

export const WarmingUpCard = () => {
  const { t } = useTranslation();

  return (
    <FocusCard
      mt={[80, 100, 120]}
      icon={'/warming-up-icon.svg'}
      title={t('landing.warmingUp')}
      description={t('landing.warmingUpDetails')}
    />
  );
};

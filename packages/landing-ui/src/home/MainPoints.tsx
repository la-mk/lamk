import React from 'react';
import { MainPointCard } from './MainPointCard';
import { useTranslation } from '../common/i18n';

export const MainPoints = () => {
  const { t } = useTranslation();
  return (
    <>
      <MainPointCard
        side='right'
        mt={[8, '8rem', '10rem']}
        image='/responsive-store-girl.svg'
        overflow='top'
        title={t('landing.corePointsStore')}
        description={t('landing.corePointsStoreDetails')}
      />

      <MainPointCard
        side='left'
        mt={[8, '8rem', '10rem']}
        image='/admin-panel-guy.svg'
        overflow='both'
        title={t('landing.corePointsAdmin')}
        description={t('landing.corePointsAdminDetails')}
      />
      <MainPointCard
        side='right'
        mt={[8, '8rem', '10rem']}
        image='/warming-up-people.svg'
        overflow='top'
        title={t('landing.corePointsSupport')}
        description={t('landing.corePointsSupportDetails')}
      />
    </>
  );
};

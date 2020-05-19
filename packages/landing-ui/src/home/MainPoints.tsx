import React from 'react';
import { MainPointCard } from './MainPointCard';
import { useTranslation } from '../common/i18n';

export const MainPoints = () => {
  const { t } = useTranslation();
  return (
    <>
      <MainPointCard
        side='right'
        mt={[50, 80, 160]}
        image='/responsive-store-girl.svg'
        overflow='top'
        title={t('landing.corePointsStore')}
        description={t('landing.corePointsStoreDetails')}
      />

      <MainPointCard
        side='left'
        mt={[50, 80, 160]}
        image='/admin-panel-guy.svg'
        overflow='both'
        title={t('landing.corePointsAdmin')}
        description={t('landing.corePointsAdminDetails')}
      />
      <MainPointCard
        side='right'
        mt={[50, 80, 160]}
        image='/warming-up-people.svg'
        overflow='top'
        title='We are just warming up'
        description='We are building the best platform around, and we want to do it together. '
      />
    </>
  );
};

import React from 'react';
import { Hero } from './Hero';
import { FeaturesHorizontal } from './FeaturesHorizontal';
import { Box } from '@sradevski/blocks-ui';
import { StepCards } from './StepCards';
import { MainPoints } from './MainPoints';
import { FocusCard } from './FocusCard';
import { ContactUsFooter } from './ContactUsFooter';

export const Home = () => {
  return (
    <Box>
      <Hero />
      <StepCards />
      <FeaturesHorizontal mt={[80, 100, 120]} />
      <MainPoints />

      <FocusCard
        mt={[80, 100, 120]}
        icon={'/warming-up-icon.svg'}
        title='We are warming up'
        description='Blaadsd asd asd asd asd sdsdsad asd asd as sdsdsad asd asd as sdsdsad asd asd as'
      />

      <ContactUsFooter />
    </Box>
  );
};

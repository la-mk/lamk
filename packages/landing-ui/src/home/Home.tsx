import React from 'react';
import { Hero } from './Hero';
import { FeaturesHorizontal } from './FeaturesHorizontal';
import { Box } from '@la-mk/blocks-ui';
import { StepCards } from './StepCards';
import { MainPoints } from './MainPoints';
import { ContactUsFooter } from '../common/ContactUsFooter';
import { WarmingUpCard } from './WarmingUpCard';

export const Home = () => {
  return (
    <Box>
      <Hero />
      <StepCards />
      <FeaturesHorizontal />
      <MainPoints />
      <WarmingUpCard />
      <ContactUsFooter />
    </Box>
  );
};

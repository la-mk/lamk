import React from 'react';
import { Hero } from './Hero';
import { SideSection } from './SideSection';
import { FeatureCards } from './FeatureCards';
import { Title, Box } from '@sradevski/blocks-ui';
import { CurvedSection } from './CurvedSection';
import { Contact } from './Contact';

export const Home = () => {
  return (
    <Box>
      <Hero />
      <SideSection side='left' mt={[50, 150, 200]} />
      <SideSection side='right' mt={[50, 150, 200]} />
      <SideSection side='left' mt={[50, 150, 200]} />
      <Title mt={150} mx={'auto'} style={{ textAlign: 'center' }} level={2}>
        And so much more
      </Title>
      <FeatureCards mt={50} />
      <CurvedSection backgroundColor={'orange'}>
        <Contact />
      </CurvedSection>
    </Box>
  );
};

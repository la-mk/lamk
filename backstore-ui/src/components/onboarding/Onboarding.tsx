import * as React from 'react';
import { Steps, Step } from '../../component-lib/basic/Steps';

export const Onboarding = () => {
  return (
    <Steps p={3}>
      <Step title='first step' />
      <Step title='second step' />
      <Step title='third step' />
    </Steps>
  );
};

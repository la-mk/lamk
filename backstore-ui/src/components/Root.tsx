import React from 'react';
import { Steps, Step } from '../component-lib/basic/Steps';

export const Root = () => (
  <div>
    <Steps>
      <Step title='first step' />
      <Step title='second step' />
      <Step title='third step' />
    </Steps>
  </div>
);

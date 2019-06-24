import React from 'react';
import { Button } from '../component-lib/basic/Button';
import { Steps, Step } from '../component-lib/compound/Steps';

export const Root = () => (
  <div>
    <Steps>
      <Step title='first step' />
      <Step title='second step' />
      <Step title='third step' />
    </Steps>
  </div>
);

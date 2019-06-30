import * as React from 'react';
import { SetupStore } from './SetupStore';
import { AddProducts } from './AddProducts';
import { SetupDelivery } from './SetupDelivery';

import { Steps, Step } from '../../component-lib/basic/Steps';
import { Container } from '../../component-lib/basic/Container';

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  return (
    <Container p={[3, 3, 4]}>
      <Steps mb={5} current={currentStep} onChange={setCurrentStep}>
        <Step title='Store' />
        <Step title='Products' />
        <Step title='Delivery' />
      </Steps>

      {currentStep === 0 && <SetupStore onDone={() => setCurrentStep(1)} />}
      {currentStep === 1 && <AddProducts onDone={() => setCurrentStep(2)} />}
      {currentStep === 2 && <SetupDelivery onDone={() => null} />}
    </Container>
  );
};

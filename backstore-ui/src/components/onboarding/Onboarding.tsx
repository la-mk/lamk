import * as React from 'react';
import styled from 'styled-components';
import { SetupStore } from './SetupStore';
import { AddProducts } from './AddProducts';
import { SetupDelivery } from './SetupDelivery';

import { Steps, Step } from '../../component-lib/basic/Steps';
import { Flex } from '../../component-lib/basic/Flex';
import { Publish } from './Publish';

const StickySteps = styled(Steps)`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  margin-bottom: ${props => props.theme.space[4]}px !important;
`;

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = React.useState(3);
  const [finishedSetup, setFinishedSetup] = React.useState(true);

  return (
    <Flex flexDirection='column' px={[3, 3, 4]} pb={4}>
      {!finishedSetup && (
        <StickySteps
          py={[2, 2, 3]}
          mb={5}
          current={currentStep}
          onChange={setCurrentStep}
        >
          <Step title='Store' />
          <Step title='Products' />
          <Step title='Delivery' />
        </StickySteps>
      )}

      {currentStep === 0 && <SetupStore onDone={() => setCurrentStep(1)} />}
      {currentStep === 1 && <AddProducts onDone={() => setCurrentStep(2)} />}
      {currentStep === 2 && (
        <SetupDelivery
          onDone={() => {
            setCurrentStep(3);
            setFinishedSetup(true);
          }}
        />
      )}
      {finishedSetup && <Publish />}
    </Flex>
  );
};

import React from 'react';
import styled from 'styled-components';
import { SetupStore } from './SetupStore';
import { AddProducts } from './AddProducts';
import { SetupDelivery } from './SetupDelivery';

import { Steps, Step } from '../../component-lib/basic/Steps';
import { Flex } from '../../component-lib/basic/Flex';
import { Publish } from './Publish';
import { Product } from '../../sdk/models/product';
import { Store } from '../../sdk/models/store';
import { Delivery } from '../../sdk/models/delivery';
import { sdk } from '../../sdk';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { setStore } from '../../state/modules/store/store.module';

const StickySteps = styled(Steps)`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  margin-bottom: ${props => props.theme.space[4]}px !important;
`;

interface OnboardingProps {
  step: number;
  setStep: (step: number) => void;
}

export const Onboarding = ({ step, setStep }: OnboardingProps) => {
  const store = useSelector(getStore);
  const dispatch = useDispatch();

  const handleSetupStoreDone = (newStore: Store) => {
    sdk.store
      .create(newStore)
      .then(store => {
        dispatch(setStore(store));
      })
      .then(() => setStep(1));
  };

  const handleAddProduct = (product: Product) => {
    sdk.product.create(product);
  };

  const handleAddProductsDone = () => {
    setStep(2);
  };

  const handleSetupDeliveryDone = (delivery: Delivery) => {
    setStep(3);
  };

  return (
    <Flex flexDirection='column' px={[3, 3, 4]} pb={4}>
      {step !== 3 && (
        <StickySteps py={[2, 2, 3]} mb={5} current={step} onChange={setStep}>
          <Step title='Store' />
          <Step title='Products' />
          <Step title='Delivery' />
        </StickySteps>
      )}

      {step === 0 && <SetupStore onDone={handleSetupStoreDone} store={store} />}
      {step === 1 && (
        <AddProducts
          onAddProduct={handleAddProduct}
          onDone={handleAddProductsDone}
        />
      )}
      {step === 2 && <SetupDelivery onDone={handleSetupDeliveryDone} />}
      {step === 3 && <Publish />}
    </Flex>
  );
};

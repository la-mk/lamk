import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { SetupStore } from './SetupStore';
import { SetupProducts } from './SetupProducts';
import { SetupDelivery } from './SetupDelivery';

import { Steps, Step, Flex, message } from 'blocks-ui';
import { Publish } from './Publish';
import { Product } from 'la-sdk/dist/models/product';
import { Store } from 'la-sdk/dist/models/store';
import { Delivery } from 'la-sdk/dist/models/delivery';
import { sdk } from 'la-sdk';
import { getStore } from '../../state/modules/store/store.selector';
import { setStore } from '../../state/modules/store/store.module';
import {
  setProducts,
  addProduct,
  removeProduct,
  patchProduct,
} from '../../state/modules/products/products.module';
import { getProducts } from '../../state/modules/products/products.selector';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { setDelivery } from '../../state/modules/delivery/delivery.module';
import { Redirect } from 'react-router';

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
  const [isFinished, setIsFinished] = useState(false);
  const store: Store = useSelector(getStore);
  const products: Product[] = useSelector(getProducts);
  const delivery: Delivery = useSelector(getDelivery);

  const dispatch = useDispatch();
  const userId = '123';

  useEffect(() => {
    sdk.store
      .findForUser(userId)
      .then(stores => {
        if (stores.total > 0) {
          dispatch(setStore(stores.data[0]));
        }
      })
      .catch(err => message.error(err.message));
  }, [dispatch]);

  useEffect(() => {
    if (store._id) {
      sdk.product
        .findForStore(store._id)
        .then(products => {
          dispatch(setProducts(products.data));
        })
        .catch(err => message.error(err.message));
    }
  }, [store, dispatch]);

  const handleSetupStoreDone = (newStore?: Store) => {
    if (!newStore || isEqual(store, newStore)) {
      return setStep(1);
    }

    (newStore._id
      ? sdk.store.patch(newStore._id, newStore)
      : sdk.store.create({ ...newStore, ownedBy: userId, isPublished: false })
    )
      .then(store => {
        dispatch(setStore(store));
      })
      .then(() => setStep(1))
      .catch(err => message.error(err.message));
  };

  const handleAddProduct = (newProduct: Product) => {
    sdk.product
      .create({ ...newProduct, soldBy: store._id })
      .then(product => dispatch(addProduct(product)))
      .catch(err => message.error(err.message));
  };

  const handlePatchProduct = (newProduct: Product) => {
    const storeProduct = products.find(
      product => product._id === newProduct._id,
    );

    if (!storeProduct || isEqual(storeProduct, newProduct)) {
      return;
    }

    sdk.product
      .patch(newProduct._id, newProduct)
      .then(product => dispatch(patchProduct(product)))
      .catch(err => message.error(err.message));
  };

  const handleRemoveProduct = (id: string) => {
    sdk.product
      .remove(id)
      .then(() => dispatch(removeProduct(id)))
      .catch(err => message.error(err.message));
  };

  const handleAddProductsDone = () => {
    setStep(2);
  };

  const handleSetupDeliveryDone = (newDelivery?: Delivery) => {
    if (!newDelivery || isEqual(delivery, newDelivery)) {
      return setStep(3);
    }

    (newDelivery._id
      ? sdk.delivery.patch(newDelivery._id, newDelivery)
      : sdk.delivery.create({ ...newDelivery, forStore: store._id })
    )
      .then(delivery => {
        dispatch(setDelivery(delivery));
      })
      .then(() => setStep(3))
      .catch(err => message.error(err.message));
  };

  const handlePublishDone = (shouldPublish: boolean) => {
    if (!shouldPublish) {
      setIsFinished(true);
      return;
    }

    sdk.store
      .patch(store._id, { isPublished: true })
      .then(() => setIsFinished(true))
      .catch(err => message.error(err.message));
  };

  return (
    <Flex flexDirection='column' px={[3, 3, 3, 4]} pb={4}>
      {step !== 3 && (
        <StickySteps py={[2, 2, 3]} mb={5} current={step} onChange={setStep}>
          <Step title='Store' />
          <Step title='Products' />
          <Step title='Delivery' />
        </StickySteps>
      )}

      {step === 0 && <SetupStore onDone={handleSetupStoreDone} store={store} />}
      {step === 1 && (
        <SetupProducts
          products={products}
          onAddProduct={handleAddProduct}
          onPatchProduct={handlePatchProduct}
          onRemoveProduct={handleRemoveProduct}
          onDone={handleAddProductsDone}
        />
      )}
      {step === 2 && (
        <SetupDelivery delivery={delivery} onDone={handleSetupDeliveryDone} />
      )}
      {step === 3 && <Publish onDone={handlePublishDone} />}
      {isFinished && <Redirect push to='/dashboard' />}
    </Flex>
  );
};

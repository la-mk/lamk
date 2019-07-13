import isEqual from 'lodash/isEqual';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
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
import { getStore } from '../../state/modules/store/store.selector';
import { setStore } from '../../state/modules/store/store.module';
import { message } from '../../component-lib/static/message';
import {
  setProducts,
  addProduct,
  removeProduct,
  patchProduct,
} from '../../state/modules/products/products.module';
import { getProducts } from '../../state/modules/products/products.selector';

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
  const store: Store = useSelector(getStore);
  const products: Product[] = useSelector(getProducts);
  const dispatch = useDispatch();
  const userId = 1;

  useEffect(() => {
    sdk.store
      .find({
        query: {
          ownedBy: userId,
        },
      })
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
        .find({ query: { soldBy: store._id } })
        .then(products => {
          if (products.total > 0) {
            dispatch(setProducts(products.data));
          }
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
      : sdk.store.create({ ...newStore, ownedBy: userId })
    )
      .then(store => {
        dispatch(setStore(store));
      })
      .then(() => setStep(1))
      .catch(err => message.error(err.message));
  };

  const handleAddProduct = (newProduct: Product) => {
    sdk.product
      .create(newProduct)
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
          products={products}
          onAddProduct={handleAddProduct}
          onPatchProduct={handlePatchProduct}
          onRemoveProduct={handleRemoveProduct}
          onDone={handleAddProductsDone}
        />
      )}
      {step === 2 && <SetupDelivery onDone={handleSetupDeliveryDone} />}
      {step === 3 && <Publish />}
    </Flex>
  );
};

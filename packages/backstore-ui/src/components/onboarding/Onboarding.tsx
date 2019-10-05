import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SetupStore } from './SetupStore';
import { SetupProducts } from './SetupProducts';
import { SetupDelivery } from './SetupDelivery';

import { Step, Flex, Spin } from '@lamk/blocks-ui';
import { Publish } from './Publish';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { Store } from '@lamk/la-sdk/dist/models/store';
import { Delivery } from '@lamk/la-sdk/dist/models/delivery';
import { sdk } from '@lamk/la-sdk';
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
import { StickySteps } from '../shared/components/StickySteps';
import { useCall } from '../shared/hooks/useCall';
import { FindResult } from '@lamk/la-sdk/dist/setup';

interface OnboardingProps {
  step: number;
  setStep: (step: number) => void;
}

export const Onboarding = ({ step, setStep }: OnboardingProps) => {
  const [isFinished, setIsFinished] = useState(false);
  const [caller, showSpinner] = useCall();
  const store: Store = useSelector(getStore);
  const products: Product[] = useSelector(getProducts);
  const delivery: Delivery = useSelector(getDelivery);

  useEffect(() => {
    if (store) {
      caller(
        sdk.product.findForStore(store._id),
        (products: FindResult<Product>) => setProducts(products.data),
      );

      caller(
        sdk.delivery.findForStore(store._id),
        (deliveries: FindResult<Delivery>) => {
          if (deliveries.total > 0) {
            return setDelivery(deliveries.data[0]);
          }
        },
      );
    }
  }, [store]);

  const handleSetupStoreDone = (newStore?: Store) => {
    if (!newStore || isEqual(store, newStore)) {
      return setStep(1);
    }
    const handler = newStore._id
      ? sdk.store.patch(newStore._id, newStore)
      : sdk.store.create({ ...newStore, isPublished: false });

    caller(handler, (store: Store) => {
      setStep(1);
      return setStore(store);
    });
  };

  const handleAddProduct = (newProduct: Product) => {
    caller(
      sdk.product.create({ ...newProduct, soldBy: store._id }),
      addProduct,
    );
  };

  const handlePatchProduct = (newProduct: Product) => {
    const storeProduct = products.find(
      product => product._id === newProduct._id,
    );

    if (!storeProduct || isEqual(storeProduct, newProduct)) {
      return;
    }

    caller(sdk.product.patch(newProduct._id, newProduct), patchProduct);
  };

  const handleRemoveProduct = (id: string) => {
    caller(sdk.product.remove(id), () => removeProduct(id));
  };

  const handleAddProductsDone = () => {
    setStep(2);
  };

  const handleSetupDeliveryDone = (newDelivery?: Delivery) => {
    if (!newDelivery || isEqual(delivery, newDelivery)) {
      return setStep(3);
    }

    const handler = newDelivery._id
      ? sdk.delivery.patch(newDelivery._id, newDelivery)
      : sdk.delivery.create({ ...newDelivery, forStore: store._id });

    caller(handler, (delivery: Delivery) => {
      setStep(3);
      return setDelivery(delivery);
    });
  };

  const handlePublishDone = (shouldPublish: boolean) => {
    if (!shouldPublish) {
      setIsFinished(true);
      return;
    }

    caller(sdk.store.patch(store._id, { isPublished: true }), () => {
      setIsFinished(true);
    });
  };

  return (
    <Spin spinning={showSpinner}>
      <Flex flexDirection='column'>
        {step !== 3 && (
          <Flex px={[3, 3, 3, 4]} pb={4} flexDirection='column'>
            <StickySteps
              py={[2, 2, 3]}
              mb={5}
              current={step}
              onChange={setStep}
            >
              <Step title='Store' />
              <Step title='Products' />
              <Step title='Delivery' />
            </StickySteps>

            {step === 0 && (
              <SetupStore onDone={handleSetupStoreDone} store={store} />
            )}
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
              <SetupDelivery
                delivery={delivery}
                onDone={handleSetupDeliveryDone}
              />
            )}
          </Flex>
        )}
        {step === 3 && (
          <Publish storeSlug={store.slug} onDone={handlePublishDone} />
        )}
        {isFinished && <Redirect push to='/dashboard' />}
      </Flex>
    </Spin>
  );
};

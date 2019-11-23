import isEqual from "lodash/isEqual";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { SetupStore } from "./SetupStore";
import { SetupProducts } from "./SetupProducts";
import { SetupDelivery } from "./SetupDelivery";

import { Step, Flex, Spin } from "@lamk/blocks-ui";
import { Publish } from "./Publish";
import { Product } from "@lamk/la-sdk/dist/models/product";
import { Store } from "@lamk/la-sdk/dist/models/store";
import { Delivery } from "@lamk/la-sdk/dist/models/delivery";
import { sdk } from "@lamk/la-sdk";
import { getStore } from "../../state/modules/store/store.selector";
import { setStore } from "../../state/modules/store/store.module";
import {
  setProducts,
  addProduct,
  removeProduct,
  patchProduct
} from "../../state/modules/products/products.module";
import { getProducts } from "../../state/modules/products/products.selector";
import { getDelivery } from "../../state/modules/delivery/delivery.selector";
import { setDelivery } from "../../state/modules/delivery/delivery.module";
import { Redirect } from "react-router";
import { StickySteps } from "../shared/components/StickySteps";
import { useCall } from "../shared/hooks/useCall";
import { FindResult } from "@lamk/la-sdk/dist/setup";
import { Category } from "@lamk/la-sdk/dist/models/category";
import { setCategories } from "../../state/modules/categories/categories.module";
import { useTranslation } from "react-i18next";
import { User } from "@lamk/la-sdk/dist/models/user";
import { getUser } from "../../state/modules/user/user.selector";
import { useCategories } from "../shared/hooks/useCategories";

interface OnboardingProps {
  step: number;
  setStep: (step: number) => void;
}

export const Onboarding = ({ step, setStep }: OnboardingProps) => {
  const { t } = useTranslation();
  const [isFinished, setIsFinished] = useState(false);
  const [caller, showSpinner] = useCall();
  const user: User | null = useSelector(getUser);
  const store: Store | null = useSelector(getStore);
  const products: Product[] = useSelector(getProducts);
  const delivery: Delivery | null = useSelector(getDelivery);
  const [categories, groupedCategories] = useCategories(t);
  
  const storeId = store ? store._id : undefined;
  const userId = user ? user._id : undefined;
  
  useEffect(() => {
    if (storeId) {
      caller<FindResult<Product>>(
        sdk.product.findForStore(storeId),
        (products) => setProducts(products.data)
      );

      caller<FindResult<Delivery>>(
        sdk.delivery.findForStore(storeId),
        (deliveries) => {
          if (deliveries.total > 0) {
            return setDelivery(deliveries.data[0]);
          }
        }
      );
    }
  }, [caller, storeId]);

  useEffect(() => {
    if (categories) {
      return;
    }

    caller<FindResult<Category>>(sdk.category.find(), (categories) =>
      setCategories(categories.data)
    );
  }, [caller, categories]);

  const handleSetupStoreDone = (newStore?: Store) => {
    if (!newStore || isEqual(store, newStore)) {
      return setStep(1);
    }
    const handler = newStore._id
      ? sdk.store.patch(newStore._id, newStore)
      : sdk.store.create(newStore);

    caller<Store>(handler, (store) => {
      setStep(1);
      return setStore(store);
    });
  };

  const handleAddProduct = (newProduct: Product) => {
    caller<Product>(
      sdk.product.create(newProduct),
      addProduct
    );
  };

  const handlePatchProduct = (newProduct: Product) => {
    const storeProduct = products.find(
      product => product._id === newProduct._id
    );

    if (!storeProduct || isEqual(storeProduct, newProduct)) {
      return;
    }

    caller<Product>(sdk.product.patch(newProduct._id, newProduct), patchProduct);
  };

  const handleRemoveProduct = (id: string) => {
    caller<Product>(sdk.product.remove(id), () => removeProduct(id));
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
      : sdk.delivery.create(newDelivery);

    caller<Delivery>(handler, (delivery) => {
      setStep(3);
      return setDelivery(delivery);
    });
  };

  const handlePublishDone = (shouldPublish: boolean) => {
    if (!shouldPublish) {
      setIsFinished(true);
      return;
    }

    if(!storeId){
      return;
    }

    caller<Store>(sdk.store.patch(storeId, { isPublished: true }), () => {
      setIsFinished(true);
    });
  };

  return (
    <Spin spinning={showSpinner}>
      <Flex flexDirection="column">
        {step !== 3 && (
          <Flex px={[3, 3, 3, 4]} pb={4} flexDirection="column">
            <StickySteps
              py={[2, 2, 3]}
              mb={5}
              current={step}
              onChange={setStep}
            >
              <Step title={t('commerce.store')} />
              <Step title={t('commerce.product_plural')} />
              <Step title={t('commerce.delivery')} />
            </StickySteps>

            {step === 0 && (
              <SetupStore onDone={handleSetupStoreDone} store={store} userId={userId} />
            )}
            {step === 1 && (
              <SetupProducts
                storeId={storeId }
                products={products}
                categories={categories}
                groupedCategories={groupedCategories}
                onAddProduct={handleAddProduct}
                onPatchProduct={handlePatchProduct}
                onRemoveProduct={handleRemoveProduct}
                onDone={handleAddProductsDone}
              />
            )}
            {step === 2 && (
              <SetupDelivery
                storeId={storeId}
                delivery={delivery}
                onDone={handleSetupDeliveryDone}
              />
            )}
          </Flex>
        )}
        {step === 3 && store && (
          <Publish storeSlug={store.slug} onDone={handlePublishDone} />
        )}
        {isFinished && <Redirect push to="/dashboard" />}
      </Flex>
    </Spin>
  );
};

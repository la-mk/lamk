import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SetupStore } from './SetupStore';
import { SetupCompany } from './SetupCompany';
import { SetupDelivery } from './SetupDelivery';

import { Flex, Spinner, hooks, Box, Steps } from '@la-mk/blocks-ui';
// import { Publish } from './Publish';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { Delivery } from '@la-mk/la-sdk/dist/models/delivery';
import { sdk } from '@la-mk/la-sdk';
import { getStore } from '../../state/modules/store/store.selector';
import { setStore } from '../../state/modules/store/store.module';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { setDelivery } from '../../state/modules/delivery/delivery.module';
import { Redirect } from 'react-router';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { useTranslation } from 'react-i18next';
import { User } from '@la-mk/la-sdk/dist/models/user';
import { getUser } from '../../state/modules/user/user.selector';

interface OnboardingProps {
  step: number;
  setStep: (step: number) => void;
}

export const Onboarding = ({ step, setStep }: OnboardingProps) => {
  const { t } = useTranslation();
  const displaySteps = hooks.useBreakpoint<string>([
    'none',
    'initial',
    'initial',
  ]);
  const [isFinished, setIsFinished] = useState(false);
  const [caller, showSpinner] = hooks.useCall();
  const user: User | null = useSelector(getUser);
  const store: Store | null = useSelector(getStore);
  const delivery: Delivery | null = useSelector(getDelivery);

  const storeId = store ? store._id : undefined;
  const userId = user ? user._id : undefined;

  useEffect(() => {
    if (storeId) {
      caller<FindResult<Delivery>>(
        sdk.delivery.findForStore(storeId),
        deliveries => {
          if (deliveries.total > 0) {
            return setDelivery(deliveries.data[0]);
          }
        },
      );
    }
  }, [caller, storeId]);

  const handleSetupStoreDone = ({ formData }: { formData: Store }) => {
    if (!formData) {
      return setStep(1);
    }
    const handler = store?._id
      ? sdk.store.patch(store._id, formData)
      : sdk.store.create(formData);

    caller<Store>(handler, store => {
      setStep(1);
      return setStore(store);
    });
  };

  const handleSetupCompanyDone = ({
    formData,
  }: {
    formData: Pick<Store, 'company' | 'contact'> | null;
  }) => {
    if (!store?._id) {
      return;
    }

    if (!formData) {
      return setStep(2);
    }

    caller<Store>(sdk.store.patch(store?._id, formData), updatedStore => {
      setStep(2);
      return setStore(updatedStore);
    });
  };

  const handleSetupDeliveryDone = ({ formData }: { formData: Delivery }) => {
    if (!formData) {
      handlePublishDone(true);
      return setStep(3);
    }

    const handler = delivery?._id
      ? sdk.delivery.patch(delivery._id, formData)
      : sdk.delivery.create(formData);

    caller<Delivery>(handler, delivery => {
      handlePublishDone(true);
      // setStep(3);
      return setDelivery(delivery);
    });
  };

  const handlePublishDone = (shouldPublish: boolean) => {
    if (!shouldPublish) {
      setIsFinished(true);
      return;
    }

    if (!storeId) {
      return;
    }

    caller<Store>(sdk.store.patch(storeId, { isPublished: true }), () => {
      setIsFinished(true);
    });
  };

  return (
    <Spinner isLoaded={!showSpinner}>
      <Flex direction='column' bg='white' minHeight='100vh'>
        {step !== 3 && (
          <Flex px={[3, 3, 4]} pb={6} pt={2} direction='column'>
            <Box
              // @ts-ignore
              style={{
                display: displaySteps,
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: 'white',
                width: '100%',
              }}
              py={[2, 2, 3]}
              mb={4}
            >
              <Steps
                orientation={'horizontal'}
                steps={[
                  {
                    status: 'success',
                    title: t('commerce.store'),
                    description: '',
                    key: 'first',
                  },
                  {
                    status: step > 0 ? 'success' : 'pending',
                    title: t('common.company'),
                    description: '',
                    key: 'second',
                  },
                  {
                    status: step > 1 ? 'success' : 'pending',
                    title: t('commerce.delivery'),
                    description: '',
                    key: 'third',
                  },
                ]}
              />
            </Box>

            {step === 0 && (
              <SetupStore
                onDone={handleSetupStoreDone}
                store={store}
                userId={userId}
              />
            )}
            {step === 1 && (
              <SetupCompany store={store} onDone={handleSetupCompanyDone} />
            )}
            {step === 2 && (
              <SetupDelivery
                delivery={delivery}
                onDone={handleSetupDeliveryDone}
              />
            )}
          </Flex>
        )}
        {/* {step === 3 && store && (
          <Publish storeSlug={store.slug} onDone={handlePublishDone} />
        )} */}
        {isFinished && <Redirect push to='/dashboard' />}
      </Flex>
    </Spinner>
  );
};

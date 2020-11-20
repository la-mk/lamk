import React, { useEffect } from 'react';
import { Flex, Paragraph, hooks, Label, Heading } from '@sradevski/blocks-ui';
import { useSelector } from 'react-redux';
import { DeliveryTruck } from '../shared/icons/DeliveryTruck';
import { SecurePayment } from '../shared/icons/SecurePayment';
import { ReturnPolicy } from '../shared/icons/ReturnPolicy';
import { TFunction } from 'next-i18next';
import { useTranslation } from '../../common/i18n';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { getStore } from '../../state/modules/store/store.selector';
import { sdk } from '@sradevski/la-sdk';
import { setDelivery } from '../../state/modules/delivery/delivery.module';
import { Delivery } from '@sradevski/la-sdk/dist/models/delivery';

interface Service {
  icon?: React.ReactElement;
  title: string;
  subtitle: string;
}

const getServices = (t: TFunction, freeDeliveryPrice: number): Service[] => [
  {
    title: t('services.freeDelivery'),
    subtitle: `${t('services.freeDeliveryExplanation', {
      freeDeliveryPrice,
    })} ден`,
    icon: <DeliveryTruck />,
  },
  {
    title: t('services.securePayments'),
    subtitle: t('services.securePaymentsExplanation'),
    icon: <SecurePayment />,
  },
  {
    title: t('services.returnPolicy'),
    subtitle: t('services.returnPolicyExplanation'),
    icon: <ReturnPolicy />,
  },
];

export const ServicesSet = () => {
  const { t } = useTranslation();
  const [caller] = hooks.useCall(true);
  const delivery: Delivery = useSelector(getDelivery);
  const store = useSelector(getStore);

  useEffect(() => {
    if (!delivery) {
      caller(sdk.delivery.findForStore(store._id), deliveries => {
        return setDelivery(deliveries.data[0] ?? null);
      });
    }
  }, [delivery, store._id]);

  return (
    <Flex
      py={[1, 2, 3]}
      alignItems='center'
      justifyContent='center'
      flexWrap='wrap'
    >
      {getServices(t, delivery?.freeDeliveryOver).map(service => {
        return (
          <Flex
            key={service.title}
            flex={1}
            minWidth={320}
            maxWidth={420}
            height={160}
            my={[3, 3, 2]}
            mx={[2, 3, 4]}
            bg='background.dark'
            borderRadius={0}
            alignItems='center'
            justifyContent='center'
            px={[3, 4, 4]}
          >
            <Paragraph
              $style={{ lineHeight: 1 }}
              mr={3}
              color='contentInversePrimary'
            >
              {!!service.icon && service.icon}
            </Paragraph>
            <Flex ml={2} py={4} flexDirection='column'>
              <Heading
                textAlign='center'
                $style={{ lineHeight: 1 }}
                as='p'
                mb={2}
                size={['small', 'small', 'medium']}
                color='contentInversePrimary'
              >
                {service.title}
              </Heading>
              <Paragraph
                textAlign='center'
                size={['small', 'small', 'medium']}
                color='contentInverseSecondary'
              >
                {service.subtitle}
              </Paragraph>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};

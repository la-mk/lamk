import React from 'react';
import { Flex, Text } from '@sradevski/blocks-ui';
import { DeliveryTruck } from '../shared/icons/DeliveryTruck';
import { TFunction } from 'next-i18next';
import { useTranslation } from '../../common/i18n';

interface Service {
  icon?: React.ReactElement;
  title: string;
  subtitle: string;
}

const getServices = (t: TFunction, freeDeliveryPrice: number) => [
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
  },
  {
    title: t('services.returnPolicy'),
    subtitle: t('services.returnPolicyExplanation'),
  },
];

export const ServicesSet = () => {
  const { t } = useTranslation();
  return (
    <Flex
      py={[1, 2, 3]}
      alignItems='center'
      justifyContent='center'
      flexWrap='wrap'
    >
      {getServices(t, 1200).map(service => {
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
            <Text mr={2} color='text.light'>
              {!!service.icon && service.icon}
            </Text>
            <Flex ml={2} py={4} flexDirection='column'>
              <Text fontSize={[3, 3, 4]} color='text.light'>
                {service.title}
              </Text>
              <Text fontSize={[0, 0, 1]} color='mutedText.light'>
                {service.subtitle}
              </Text>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};

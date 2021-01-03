import React, { useEffect } from 'react';
import { Flex, Text, hooks, Divider } from '@sradevski/blocks-ui';
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
import { useTheme } from '@chakra-ui/react';
import { CustomerServiceOutlined } from '@ant-design/icons';

interface Service {
  icon?: React.ReactElement;
  title: string;
  subtitle: string;
}

const variantColors = {
  rainbow: {
    background: [
      'primary.500',
      'background.light',
      'background.dark',
      'background.light',
    ],
    text: ['text.light', 'text.dark', 'text.light', 'text.dark'],
  },
  dark: {
    background: [
      'background.dark',
      'background.dark',
      'background.dark',
      'background.dark',
    ],
    text: ['text.light', 'text.light', 'text.light', 'text.light'],
  },
};

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
  {
    title: t('services.support'),
    subtitle: t('services.supportExplanation'),
    icon: <CustomerServiceOutlined />,
  },
];

export const ServicesSet = () => {
  const theme = useTheme();
  const ownTheme = theme.sections.Services;
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

  const colors = variantColors[ownTheme.variant];
  const minWidth = Math.round(48 / ownTheme.count);
  const maxWidth = Math.round(70 / ownTheme.count);

  return (
    <Flex py={[1, 2, 3]} align='center' justify='center' wrap='wrap'>
      {getServices(t, delivery?.freeDeliveryOver)
        .slice(0, ownTheme.count)
        .map((service, idx) => {
          return (
            <Flex
              key={service.title}
              flex={1}
              minWidth={`${minWidth}rem`}
              maxWidth={`${maxWidth}rem`}
              height={'10rem'}
              my={[3, 3, 2]}
              mx={[2, 3, 5]}
              bg={colors.background[idx]}
              // @ts-ignore
              borderRadius='md'
              align='center'
              justify='center'
              px={[3, 4, 4]}
            >
              {ownTheme.decoration === 'icon' && (
                <Text lineHeight='none' mr={3} color={colors.text[idx]}>
                  {!!service.icon && service.icon}
                </Text>
              )}
              <Flex ml={2} py={4} direction='column'>
                <Text
                  size={'2xl'}
                  color={colors.text[idx]}
                  // @ts-ignore
                  textTransform={ownTheme.textTransform}
                >
                  {service.title}
                </Text>
                {ownTheme.decoration === 'divider' && <Divider my={2} />}
                <Text
                  size={'sm'}
                  color={colors.text[idx]}
                  // @ts-ignore
                  textTransform={ownTheme.textTransform}
                  noOfLines={2}
                >
                  {service.subtitle}
                </Text>
              </Flex>
            </Flex>
          );
        })}
    </Flex>
  );
};

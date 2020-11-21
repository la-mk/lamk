import React from 'react';
import { Button, Flex, Title, Text } from '@sradevski/blocks-ui';
import Link from 'next/link';
import { useTranslation } from '../../common/i18n';
import { OrderSuccess } from '../shared/icons/OrderSuccess';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';
import { withTheme } from 'styled-components';

export const Success = withTheme(
  ({
    order,
    theme,
    ...otherProps
  }: { order: Order; theme: BlocksTheme } & React.ComponentProps<
    typeof Flex
  >) => {
    const { t } = useTranslation();

    return (
      <Flex
        maxWidth={500}
        mx='auto'
        px={3}
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        {...otherProps}
      >
        <OrderSuccess
          primary={theme.colors.primary}
          background={theme.colors.background.dark}
          muted={theme.colors.mutedText.light}
        />

        <Title textAlign='center' mt={4} level={2} fontSize={4}>
          {t('cart.orderSuccess')}
        </Title>
        <Text textAlign='center' fontSize={0}>
          {t('cart.orderSuccessExplanation')}
        </Text>

        <Link passHref replace href='/products'>
          <Button as='a' size='lg' mt={4} isFullWidth>
            {t('product.seeOtherProducts')}
          </Button>
        </Link>

        <Link passHref replace href='/orders/[pid]' as={`/orders/${order._id}`}>
          <Button variant='outline' as='a' size='lg' mt={3} isFullWidth>
            {t('order.seeOrder')}
          </Button>
        </Link>
      </Flex>
    );
  },
);

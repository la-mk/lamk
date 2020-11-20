import React from 'react';
import { Button, Flex, Heading, Label, Paragraph } from '@sradevski/blocks-ui';
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

        <Heading textAlign='center' mt={4} as='h2' size='large'>
          {t('cart.orderSuccess')}
        </Heading>
        <Paragraph color='contentSecondary' textAlign='center' size='small'>
          {t('cart.orderSuccessExplanation')}
        </Paragraph>

        <Button size='large' mt={4} width='100%'>
          <Link replace href='/products'>
            {t('product.seeOtherProducts')}
          </Link>
        </Button>

        <Button size='large' kind='secondary' mt={3} width='100%'>
          <Link replace href='/orders/[pid]' as={`/orders/${order._id}`}>
            {t('order.seeOrder')}
          </Link>
        </Button>
      </Flex>
    );
  },
);

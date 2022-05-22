import React from "react";
import { Button, Flex, Result } from "@la-mk/blocks-ui";
import Link from "next/link";
import { FinalBlocksTheme } from "@la-mk/blocks-ui/dist/theme";
import { withTheme } from "@emotion/react";
import { Order } from "../../domain/order";
import { useTranslation } from "next-i18next";
import { OrderSuccess } from "../../components/icons/OrderSuccess";

export const Success = withTheme(
  ({
    order,
    theme,
    ...otherProps
  }: { order: Order; theme: FinalBlocksTheme } & Omit<
    React.ComponentProps<typeof Flex>,
    "order"
  >) => {
    const { t } = useTranslation("translation");

    return (
      <Flex
        maxWidth={"38rem"}
        mx="auto"
        px={3}
        align="center"
        justify="center"
        direction="column"
        {...otherProps}
      >
        <Result
          mb={4}
          status="success"
          icon={
            <OrderSuccess
              primary={theme.colors.primary["500"]}
              background={theme.colors.background.dark}
              muted={theme.colors.mutedText.light}
            />
          }
          title={t("cart.orderSuccess")}
          description={t("cart.orderSuccessExplanation")}
        />

        <Link passHref replace href="/products">
          <Button as="a" size="lg" mt={4} isFullWidth>
            {t("product.seeOtherProducts")}
          </Button>
        </Link>

        <Link
          passHref
          replace
          href="/account/orders/[pid]"
          as={`/account/orders/${order._id}`}
        >
          <Button variant="outline" as="a" size="lg" mt={3} isFullWidth>
            {t("order.seeOrder")}
          </Button>
        </Link>
      </Flex>
    );
  }
);

import { Box, Button, Flex, hooks, Text } from "@la-mk/blocks-ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "@chakra-ui/react";
import React from "react";
import {
  ArrowRight,
  Home,
  Lock,
  ShoppingBag,
  User as UserIcon,
} from "react-feather";
import { TFunction, useTranslation } from "next-i18next";
import { BlocksTheme } from "@la-mk/blocks-ui/dist/theme";
import { User } from "../../../domain/user";
import { urls } from "../../../tooling/url";
import { ClickableCard } from "../../../components/ClickableCard";

const getAccountMenu = (t: TFunction) => [
  {
    title: t("pages.personalDetails"),
    icon: <UserIcon size="1.2rem" />,
    href: urls.accountPersonal,
  },
  {
    title: t("pages.changePassword"),
    icon: <Lock size="1.2rem" />,
    href: urls.accountChangePassword,
  },
  {
    title: t("pages.myAddresses"),
    icon: <Home size="1.2rem" />,
    href: urls.accountAddresses,
  },
  {
    title: t("pages.myOrders"),
    icon: <ShoppingBag size="1.2rem" />,
    href: urls.accountOrders,
  },
];

const MenuButton = ({
  item,
  isCurrent,
  theme,
}: {
  item: ReturnType<typeof getAccountMenu>[0];
  isCurrent?: boolean;
  theme: BlocksTheme;
}) => {
  return (
    <Link href={item.href} passHref>
      <Button
        size="md"
        isFullWidth
        variant="ghost"
        // @ts-ignore
        borderRadius="none"
        // @ts-ignore
        bg={isCurrent ? "background.light" : undefined}
        borderLeft={
          isCurrent ? `2px solid ${theme.colors?.primary?.["500"]}` : undefined
        }
        my={2}
        as="a"
        leftIcon={item.icon}
      >
        <Flex align="center" justify="space-between" width="100%">
          {item.title}
          <Text as="div" size="xs" ml="auto">
            <ArrowRight size="1.2rem" />
          </Text>
        </Flex>
      </Button>
    </Link>
  );
};

export const AccountMenu = ({ user }: { user: User | undefined }) => {
  const { t } = useTranslation("translation");
  const { pathname } = useRouter();
  // TODO: Remove gray when blocks-ui is updated to contain the typings for it
  const theme = useTheme<BlocksTheme & { colors: { gray: any } }>();
  const isMobile = hooks.useBreakpoint([true, false, false]);

  return (
    <Flex
      direction="column"
      align="center"
      // @ts-ignore
      borderRight={[
        undefined,
        `1px solid ${theme.colors.gray["200"]}`,
        `1px solid ${theme.colors.gray["200"]}`,
      ]}
      height="100%"
      width={"100%"}
    >
      <Flex align="center" direction="column" p={4}>
        <Text color="mutedText.dark">{t("common.welcomeBack")},</Text>
        <Text size="lg">{user?.firstName ?? t("common.guest")}</Text>
      </Flex>

      <Flex direction="column" align="center" width="100%">
        {getAccountMenu(t).map((item) => {
          const isCurrent = pathname.startsWith(item.href);
          if (isMobile) {
            return (
              <Box m={3}>
                <ClickableCard
                  href={item.href}
                  title={item.title}
                  icon={item.icon}
                />
              </Box>
            );
          }
          return (
            <MenuButton
              key={item.title}
              item={item}
              isCurrent={isCurrent}
              theme={theme}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};

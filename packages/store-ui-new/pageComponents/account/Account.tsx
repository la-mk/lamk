import { Box, Flex, Result } from "@la-mk/blocks-ui";
import React from "react";
import { useTheme } from "@chakra-ui/react";
import { AccountMenu } from "../../layout/Account/AccountMenu";
import { User } from "../../domain/user";
import { useTranslation } from "next-i18next";
import { PersonalInfo } from "../../components/icons/PersonalInfo";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";

export const Account = () => {
  const theme = useTheme();
  const { t } = useTranslation("translation");
  useBreadcrumbs([{ url: "/", title: t("pages.home") }]);

  return (
    <Flex
      align="center"
      justify="center"
      mx="auto"
      mt={8}
      display={["none", "flex", "flex"]}
      width="100%"
    >
      <Result
        status="success"
        icon={
          <PersonalInfo
            primary={theme.colors.primary["500"]}
            backgroundLight={theme.colors.background.light}
            backgroundDark={theme.colors.background.dark}
            muted={theme.colors.mutedText.dark}
          />
        }
        title={t("auth.welcomeToAccount")}
        description={t("auth.welcomeToAccountExplanation")}
      />
    </Flex>
  );
};

import React from "react";
import { useTranslation } from "next-i18next";
import { AccountProps } from "../../../containers/account";
import { useAuth } from "../../../hooks/useAuth";
import { Button, Flex, Spinner } from "@la-mk/blocks-ui";
import { useRouter } from "next/router";
import { urls } from "../../../tooling/url";

export const Account = ({ user }: AccountProps) => {
  const { t } = useTranslation("translation");
  const router = useRouter();
  const { logout } = useAuth();

  if (!user) {
    return <Spinner mx="auto" isLoaded={false} />;
  }

  return (
    <Flex>
      <Button
        onClick={() => {
          logout();
          router.replace(urls.home);
        }}
      >
        Logout
      </Button>
    </Flex>
  );
};

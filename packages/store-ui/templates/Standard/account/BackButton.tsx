import { ArrowLeft } from "react-feather";
import { Button, hooks } from "@la-mk/blocks-ui";
import Link from "next/link";
import React from "react";
import { useTranslation } from "next-i18next";
import { urls } from "../../../tooling/url";

export const BackButton = () => {
  const { t } = useTranslation("translation");
  const isMobile = hooks.useBreakpoint([true, false, false]);
  if (!isMobile) {
    return null;
  }

  return (
    <Link href={urls.account} passHref>
      <Button
        mt={1}
        mb={5}
        mr="auto"
        as="a"
        variant="link"
        leftIcon={<ArrowLeft size={"1.2rem"} />}
      >
        {t("actions.goToAccount")}
      </Button>
    </Link>
  );
};

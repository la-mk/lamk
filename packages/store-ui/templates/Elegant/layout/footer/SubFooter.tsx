import React from "react";
import {
  Flex,
  Text,
  Box,
  PoweredBy,
  Image,
  LanguagePicker,
  Button,
} from "@la-mk/blocks-ui";
import { useRouter } from "next/router";
import { Store } from "../../../../domain/store";
import Link from "next/link";
import { urls } from "../../../../tooling/url";
import { useTranslation } from "next-i18next";

export const SubFooter = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const changeLanguage = (target: string) => {
    if (!!document) {
      const now = new Date();
      now.setUTCFullYear(now.getFullYear() + 2, now.getMonth(), now.getDate());
      document.cookie = `NEXT_LOCALE=${target}; expires=${now.toUTCString()}; path=/`;
    }
    router.push({ pathname, query }, asPath, { locale: target });
  };

  return (
    <Flex
      justify={["center", "space-between", "space-between"]}
      align="center"
      my={2}
      direction={["column", "row", "row"]}
    >
      <Box display={"inline"}>
        <Text color="mutedText.light" size="sm" mr={1}>
          {store.company?.companyName} |
        </Text>

        <Link href={urls.privacyPolicy} passHref>
          <Button as="a" my={3} variant="link" mr={1}>
            <Text size="sm" color="mutedText.light">
              {t("pages.privacy")} |
            </Text>
          </Button>
        </Link>

        <Link href={urls.legal} passHref>
          <Button as="a" my={3} variant="link">
            <Text size="sm" color="mutedText.light">
              {t("pages.legal")}
            </Text>
          </Button>
        </Link>
      </Box>

      <PoweredBy logoUrl={"/images/lamk-logo/horizontal-inverse.svg"} inverse />

      <Flex mt={[4, 0, 0]} ml={[0, 4, 4]} justify="center" align="center">
        <Flex mr={5} align="center" justify="center">
          <Text color="mutedText.light">
            <LanguagePicker
              darkMode
              languageCode={locale ?? "mk"}
              onChangeLanguageCode={changeLanguage}
            />
          </Text>
        </Flex>
        <Box mr={2} p={2} bg="background.light">
          <Box height={"16px"}>
            <Image
              style={{ filter: "grayscale(100%)" }}
              height={16}
              src={"/images/mastercard.svg"}
              alt="mastercard logo"
            />
          </Box>
        </Box>
        <Box ml={2} p={2} bg="background.light">
          <Box height={"16px"}>
            <Image
              style={{ filter: "grayscale(100%)" }}
              height={16}
              src={"/images/visa.svg"}
              alt="visa logo"
            />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

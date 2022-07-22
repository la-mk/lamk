import React from "react";
import {
  Flex,
  Text,
  Box,
  PoweredBy,
  Image,
  LanguagePicker,
} from "@la-mk/blocks-ui";
import { useRouter } from "next/router";

export const SubFooter = () => {
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
      px={[4, 5, 6]}
      my={2}
      direction={["column", "row", "row"]}
    >
      <Text color="text.light" size="sm" mr={[0, 3, 3]} mb={[3, 0, 0]}>
        © 2021 All rights reserved
      </Text>

      <PoweredBy logoUrl={"/images/lamk-logo/horizontal-inverse.svg"} inverse />

      <Flex mt={[4, 0, 0]} ml={[0, 4, 4]} justify="center" align="center">
        <Flex mr={5} align="center" justify="center">
          <Text color="text.light">
            <LanguagePicker
              darkMode
              languageCode={locale ?? "mk"}
              onChangeLanguageCode={changeLanguage}
            />
          </Text>
        </Flex>
        <Box mr={2} p={2} bg="background.light">
          <Box height={"22px"}>
            <Image
              height={22}
              src={"/images/mastercard.svg"}
              alt="mastercard logo"
            />
          </Box>
        </Box>
        <Box ml={2} p={2} bg="background.light">
          <Box height={"22px"}>
            <Image height={22} src={"/images/visa.svg"} alt="visa logo" />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

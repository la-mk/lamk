import React from "react";
import { Flex, Box, Heading } from "@la-mk/blocks-ui";
import { Facebook, Twitter, Instagram, Youtube } from "react-feather";

import { useTheme } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { Store } from "../../../../domain/store";
import { Contact } from "./Contact";
import { HoverableLink } from "../../../../components/HoverableLink";

const SocialButton = ({ link, icon }: { link: string; icon: any }) => {
  return (
    <Box mr={5}>
      <HoverableLink href={link}>{icon}</HoverableLink>
    </Box>
  );
};

export const StoreFooterSection = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");
  const theme = useTheme();
  if (!store) {
    return null;
  }

  return (
    <Flex direction="column" align={"flex-start"}>
      <Heading
        textTransform={"uppercase"}
        mb={4}
        size="sm"
        color="mutedText.dark"
        as="h4"
      >
        Stay connected
      </Heading>

      <Contact darkMode contact={store.contact} />

      <Heading
        textTransform={"uppercase"}
        mt={7}
        mb={4}
        size="sm"
        color="mutedText.dark"
        as="h4"
      >
        Follow us!
      </Heading>

      <Flex direction={"row"}>
        <SocialButton
          link="something"
          icon={
            <Facebook color={theme?.colors?.mutedText?.dark} size="1.6rem" />
          }
        />
        <SocialButton
          link="something"
          icon={
            <Instagram color={theme?.colors?.mutedText?.dark} size="1.6rem" />
          }
        />
        <SocialButton
          link="something"
          icon={
            <Youtube color={theme?.colors?.mutedText?.dark} size="1.6rem" />
          }
        />
        <SocialButton
          link="something"
          icon={
            <Twitter color={theme?.colors?.mutedText?.dark} size="1.6rem" />
          }
        />
      </Flex>
    </Flex>
  );
};

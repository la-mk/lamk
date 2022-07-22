import React from "react";
import { Flex, Box, Heading, Image } from "@la-mk/blocks-ui";

import { useTranslation } from "next-i18next";
import { getImageURL } from "../../../../hacks/imageUrl";
import { Store } from "../../../../domain/store";
import { Contact } from "./Contact";

export const StoreFooterSection = ({
  store,
}: {
  store: Pick<Store, "logo" | "contact" | "_id">;
}) => {
  const { t } = useTranslation("translation");
  if (!store) {
    return null;
  }

  return (
    <Flex direction="column" align={"flex-start"}>
      <Box height={"6rem"} mb={5} bg="background.light">
        <Image
          getSrc={(params) =>
            getImageURL(store.logo?._id ?? "", store._id, params)
          }
          height={84}
          alt="logo"
        />
      </Box>

      <Heading mb={3} color="heading.light" as="h4" size={"xs"}>
        {t("common.contactDetails").toUpperCase()}
      </Heading>

      <Contact darkMode contact={store.contact} />
    </Flex>
  );
};

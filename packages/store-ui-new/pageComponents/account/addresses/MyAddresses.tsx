import React, { useState } from "react";
import { Button, Flex } from "@la-mk/blocks-ui";
import { Addresses } from "./Addresses";
import { useTranslation } from "next-i18next";
import { useBreadcrumbs } from "../../../hooks/useBreadcrumbs";
import { Page } from "../../../layout/Page";
import { BackButton } from "../BackButton";
import { User } from "../../../domain/user";
import { Store } from "../../../domain/store";

export const MyAddresses = ({ user, store }: { user: User; store: Store }) => {
  const { t } = useTranslation("translation");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  useBreadcrumbs([
    { url: "/", title: t("pages.home") },
    { url: "/account/addresses", title: t("pages.myAddresses") },
  ]);

  return (
    <Page maxWidth={"86rem"}>
      <BackButton />
      <Flex mb={6} align="center" justify="center">
        <Button onClick={() => setShowAddAddressModal(true)}>
          {t("address.addNewAddress")}
        </Button>
      </Flex>
      <Addresses
        storeId={store._id}
        user={user}
        showAddModal={showAddAddressModal}
        setShowAddModal={setShowAddAddressModal}
      />
    </Page>
  );
};

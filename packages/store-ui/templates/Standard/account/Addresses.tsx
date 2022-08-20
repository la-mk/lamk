import React, { useState } from "react";
import { Button, Flex, Spinner } from "@la-mk/blocks-ui";
import { Addresses as AddressesList } from "../components/addresses/Addresses";
import { useTranslation } from "next-i18next";
import { Page } from "../Page";
import { BackButton } from "./BackButton";
import { urls } from "../../../tooling/url";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { AddressesProps } from "../../../containers/account/Addresses";

export const Addresses = ({ user, store }: AddressesProps) => {
  const { t } = useTranslation("translation");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  if (!user) {
    return <Spinner mx="auto" mt={5} isLoaded={false} />;
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { url: urls.home, title: t("pages.home") },
          { url: urls.accountAddresses, title: t("pages.myAddresses") },
        ]}
      />
      <Page maxWidth={"86rem"}>
        <BackButton />
        <Flex mb={6} align="center" justify="center">
          <Button onClick={() => setShowAddAddressModal(true)}>
            {t("address.addNewAddress")}
          </Button>
        </Flex>
        <AddressesList
          storeId={store._id}
          user={user}
          showAddModal={showAddAddressModal}
          setShowAddModal={setShowAddAddressModal}
          selectedAddress={undefined}
          onSelected={undefined}
        />
      </Page>
    </>
  );
};

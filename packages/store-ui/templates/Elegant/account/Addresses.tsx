import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { AddressesProps } from "../../../containers/account/Addresses";
import { Button, Flex, Spinner } from "@la-mk/blocks-ui";
import { ManageAddresses } from "../components/addresses/ManageAddresses";

export const Addresses = ({ user, store }: AddressesProps) => {
  const { t } = useTranslation("translation");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  if (!user) {
    return <Spinner mx="auto" isLoaded={false} />;
  }

  return (
    <>
      <Flex mb={6} align="center" justify="center">
        <Button variant="outline" onClick={() => setShowAddAddressModal(true)}>
          {t("address.addNewAddress")}
        </Button>
      </Flex>

      <ManageAddresses
        storeId={store._id}
        user={user}
        showAddModal={showAddAddressModal}
        setShowAddModal={setShowAddAddressModal}
        selectedAddress={undefined}
        onSelected={undefined}
      />
    </>
  );
};

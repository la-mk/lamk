import React, { useState } from "react";
import { Button, Flex, Spinner } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Page } from "../Page";
import { BackButton } from "./BackButton";
import { urls } from "../../../tooling/url";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { useAddresses } from "../../../hooks/useAddresses";
import { User } from "../../../domain/user";
import { Address } from "../../../domain/address";
import { AddressesList } from "../components/addresses/AddressesList";
import { AddressModal } from "../components/addresses/AddressModal";
import { useTheme } from "@chakra-ui/react";
import { FinalBlocksTheme } from "@la-mk/blocks-ui/dist/theme";
import { AddressesProps } from "../../../containers/account/Addresses";

interface LocalAddressesProps {
  storeId: string;
  user: User;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  selectedAddress: Address | undefined;
  onSelected?: (address: Address) => void;
}

export const LocalAddresses = ({
  storeId,
  user,
  showAddModal,
  setShowAddModal,
  selectedAddress,
  onSelected,
}: LocalAddressesProps) => {
  const {
    handleAddAddress,
    handlePatchAddress,
    handleRemoveAddress,
    addresses,
    addressToEdit,
    setAddressToEdit,
    areAddressesLoading,
  } = useAddresses({
    storeId,
    user,
    showAddModal,
    setShowAddModal,
    selectedAddress,
    onSelected,
  });
  const theme: FinalBlocksTheme = useTheme();

  return (
    <>
      <AddressesList
        theme={theme}
        handleRemoveAddress={handleRemoveAddress}
        addresses={addresses ?? []}
        isLoadingAddresses={areAddressesLoading}
        selectedAddress={selectedAddress}
        setSelectedAddress={onSelected}
        setAddressToEdit={setAddressToEdit}
        setShowAddModal={setShowAddModal}
      />

      <AddressModal
        user={user}
        address={addressToEdit}
        visible={showAddModal}
        onAddAddress={handleAddAddress}
        onPatchAddress={handlePatchAddress}
        onClose={() => {
          setShowAddModal(false);
          setAddressToEdit(undefined);
        }}
      />
    </>
  );
};

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
        <LocalAddresses
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

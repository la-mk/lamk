import React from "react";
import { FinalBlocksTheme } from "@la-mk/blocks-ui/dist/theme";
import { useTheme } from "@chakra-ui/react";
import { AddressModal } from "./AddressModal";
import { AddressesList } from "./AddressesList";
import { useAddresses } from "../../../../hooks/useAddresses";
import { User } from "../../../../domain/user";
import { Address } from "../../../../domain/address";

interface AddressesProps {
  storeId: string;
  user: User;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  selectedAddress: Address | undefined;
  onSelected: (address: Address) => void;
}

export const Addresses = ({
  storeId,
  user,
  showAddModal,
  setShowAddModal,
  selectedAddress,
  onSelected,
}: AddressesProps) => {
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
        handleRemoveAddress={handleRemoveAddress}
        addresses={addresses ?? []}
        isLoadingAddresses={areAddressesLoading}
        selectedAddress={selectedAddress}
        setSelectedAddress={onSelected}
        theme={theme}
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

import { FinalBlocksTheme } from "@la-mk/blocks-ui/dist/theme";
import { Address } from "../../../../domain/address";
import { User } from "../../../../domain/user";
import { useAddresses } from "../../../../hooks/useAddresses";
import { AddressesList } from "./AddressesList";
import { AddressModal } from "./AddressModal";
import { useTheme } from "@chakra-ui/react";

interface ManageAddressesProps {
  storeId: string;
  user: User;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  selectedAddress: Address | undefined;
  onSelected?: (address: Address) => void;
}

export const ManageAddresses = ({
  storeId,
  user,
  showAddModal,
  setShowAddModal,
  selectedAddress,
  onSelected,
}: ManageAddressesProps) => {
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

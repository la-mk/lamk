import React, { useState } from "react";
import { FinalBlocksTheme } from "@la-mk/blocks-ui/dist/theme";
import { useTheme } from "@chakra-ui/react";
// import { AnalyticsEvents } from "@la-mk/analytics";
import { toast } from "@la-mk/blocks-ui";
import { AddressModal } from "./AddressModal";
import { AddressesList } from "./AddressesList";
import { User } from "../../../domain/user";
import { useQuery } from "../../../sdk/useQuery";
import { useTranslation } from "next-i18next";
import { useMutation } from "../../../sdk/useMutation";
import { Address } from "../../../domain/address";
import { useQueryClient } from "../../../sdk/useQueryClient";

const pickDiff = <T extends any>(oldObj: Partial<T>, newObj: Partial<T>) => {
  return Object.keys(newObj).reduce((diff: Partial<T>, newKey) => {
    if (oldObj[newKey as keyof T] !== newObj[newKey as keyof T]) {
      diff[newKey as keyof T] = newObj[newKey as keyof T];
    }

    return diff;
  }, {});
};

interface AddressesProps {
  user: User;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  onSelected?: (address: Address) => void;
  selectedAddress?: Address;
}

export const Addresses = ({
  user,
  showAddModal,
  setShowAddModal,
  onSelected,
  selectedAddress,
}: AddressesProps) => {
  const theme: FinalBlocksTheme = useTheme();
  const { t } = useTranslation("translation");
  const queryClient = useQueryClient();
  const [addressToEdit, setAddressToEdit] = useState<Address | undefined>();
  const [addresses, areAddressesLoading] = useQuery("address", "findForUser", [
    user._id,
  ]);

  const [removeAddress] = useMutation("address", "remove", {
    onSuccess: (removedAddress) => {
      const existing = queryClient.getQueryData("address", "findForUser", [
        user._id,
      ]);
      if (!existing) {
        // Can't remove empty results
        return;
      }
      queryClient.setQueryData("address", "findForUser", [user._id], {
        ...existing,
        data: existing.data.filter((addr) => addr._id !== removedAddress._id),
      });
    },
  });

  const [createAddress] = useMutation("address", "create", {
    onSuccess: (newAddress) => {
      const existing = queryClient.getQueryData("address", "findForUser", [
        user._id,
      ]);
      if (!existing) {
        queryClient.setQueryData("address", "findForUser", [user._id], {
          total: 1,
          limit: 20,
          skip: 0,
          data: [newAddress],
        });
      } else {
        queryClient.setQueryData("address", "findForUser", [user._id], {
          ...existing,
          data: [...existing.data, newAddress],
        });
      }
    },
  });

  const [patchAddress] = useMutation("address", "patch", {
    onSuccess: (updatedAddress) => {
      const existing = queryClient.getQueryData("address", "findForUser", [
        user._id,
      ]);
      if (!existing) {
        return;
      } else {
        queryClient.setQueryData("address", "findForUser", [user._id], {
          ...existing,
          data: existing.data.map((addr) => {
            if (addr._id === updatedAddress._id) {
              return updatedAddress;
            }

            return addr;
          }),
        });
      }
    },
  });

  const handleAddAddress = async (address: Address) => {
    try {
      await createAddress([address]);
      toast.success(t("address.createAddressSuccess"));
      setShowAddModal(false);
      // trackEvent({
      //   eventName: AnalyticsEvents.addAddress,
      //   numberOfAddresses: addresses.length + 1,
      // })
    } catch (err) {
      toast.error(t("results.genericError"));
    }
  };

  const handlePatchAddress = async (patchedAddress: Address) => {
    const originalAddress = addresses?.data?.find(
      (address) => address._id === patchedAddress._id
    );

    if (!originalAddress) {
      return;
    }

    const updatedFields = pickDiff(originalAddress, patchedAddress);
    try {
      await patchAddress([patchedAddress._id, updatedFields]);
      toast.success(t("address.updateAddressSuccess"));
      setShowAddModal(false);
      setAddressToEdit(undefined);
    } catch (err) {
      toast.error(t("results.genericError"));
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    try {
      await removeAddress([addressId]);
      toast.success(t("address.removeAddressSuccess"));
    } catch (err) {
      toast.error(t("results.genericError"));
    }
  };

  return (
    <>
      <AddressesList
        handleRemoveAddress={handleRemoveAddress}
        addresses={addresses?.data ?? []}
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

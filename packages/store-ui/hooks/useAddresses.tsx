import { AnalyticsEvents } from "@la-mk/analytics";
import { toast } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { Templates } from "../containers";
import { Address } from "../domain/address";
import { User } from "../domain/user";
import { useAnalytics } from "./useAnalytics";
import { useMutation } from "../sdk/useMutation";
import { useQuery } from "../sdk/useQuery";
import { useQueryClient } from "../sdk/useQueryClient";
import { Addresses as StandardAddresses } from "../templates/Standard/components/addresses/Addresses";

const pickDiff = <T extends any>(oldObj: Partial<T>, newObj: Partial<T>) => {
  return Object.keys(newObj).reduce((diff: Partial<T>, newKey) => {
    if (oldObj[newKey as keyof T] !== newObj[newKey as keyof T]) {
      diff[newKey as keyof T] = newObj[newKey as keyof T];
    }

    return diff;
  }, {});
};

export interface AddressesProps {
  user: User;
  areAddressesLoading: boolean;
  setAddressToEdit: (address: Address | undefined) => void;
  addressToEdit: Address | undefined;
  handleAddAddress: (address: Address) => void;
  handlePatchAddress: (address: Address) => void;
  handleRemoveAddress: (addressId: string) => void;
  addresses?: Address[];
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  onSelected?: (address: Address) => void;
  selectedAddress?: Address;
}

export const useAddresses = ({
  storeId,
  user,
  showAddModal,
  setShowAddModal,
  onSelected,
  selectedAddress,
}: {
  user: User;
  storeId: string;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  onSelected?: (address: Address) => void;
  selectedAddress?: Address;
}) => {
  const { t } = useTranslation("translation");
  const queryClient = useQueryClient();
  const { trackEvent } = useAnalytics(storeId);
  const [addressToEdit, setAddressToEdit] = useState<Address | undefined>();
  const [addresses, areAddressesLoading] = useQuery("address", "findForUser", [
    user._id,
  ]);

  const [removeAddress] = useMutation("address", "remove", {
    onSuccess: (removedAddress) => {
      const existing = queryClient.getQueryData("address", "findForUser", [
        user._id,
      ]);
      // Can't remove empty results
      if (!existing) {
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
      }

      queryClient.setQueryData("address", "findForUser", [user._id], {
        ...existing,
        data: existing.data.map((addr) => {
          if (addr._id === updatedAddress._id) {
            return updatedAddress;
          }

          return addr;
        }),
      });
    },
  });

  const handleAddAddress = async (address: Address) => {
    try {
      await createAddress([address]);
      toast.success(t("address.createAddressSuccess"));
      setShowAddModal(false);
      trackEvent(AnalyticsEvents.addAddress, {
        numberOfAddresses: (addresses?.total ?? 0) + 1,
      });
    } catch (err) {
      console.error(err);
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
      console.error(err);
      toast.error(t("results.genericError"));
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    try {
      await removeAddress([addressId]);
      toast.success(t("address.removeAddressSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("results.genericError"));
    }
  };

  const props: AddressesProps = {
    user,
    areAddressesLoading,
    setAddressToEdit,
    addressToEdit,
    handleAddAddress,
    handlePatchAddress,
    handleRemoveAddress,
    addresses: addresses?.data ?? [],
    showAddModal,
    setShowAddModal,
    onSelected,
    selectedAddress,
  };

  return props;
};

import { Button, Flex, Grid, Result, Spinner } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import React from "react";
import { Edit3, Trash2 } from "react-feather";
import { Address } from "../../../../domain/address";
import { SelectableCard } from "../SelectableCard";
import { ShippingDescription } from "./ShippingDescription";

export const AddressesList = ({
  isLoadingAddresses,
  addresses,
  selectedAddress,
  setSelectedAddress,
  setAddressToEdit,
  handleRemoveAddress,
  setShowAddModal,
}: {
  isLoadingAddresses: boolean;
  addresses: Address[];
  selectedAddress?: Address;
  setSelectedAddress?: (address: Address) => void;
  setAddressToEdit: (address: Address) => void;
  handleRemoveAddress: (addressId: string) => void;
  setShowAddModal: (shouldShow: boolean) => void;
}) => {
  const { t } = useTranslation("translation");

  return (
    <Spinner isLoaded={!isLoadingAddresses}>
      {/* @ts-ignore */}
      <Grid spacing={5} minChildWidth={["20rem", "24rem", "26rem"]}>
        {addresses?.length > 0 &&
          addresses.map((address) => {
            const isChecked =
              selectedAddress && selectedAddress._id === address._id;
            return (
              <SelectableCard
                key={address._id}
                isChecked={!!isChecked}
                onClick={() => setSelectedAddress?.(address)}
                width="100%"
                maxWidth={["26rem", "30rem", "28rem"]}
              >
                <ShippingDescription
                  address={address}
                  actions={
                    <Flex>
                      <Button
                        mr={1}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddressToEdit(address);
                          setShowAddModal(true);
                        }}
                        variant="ghost"
                        leftIcon={<Edit3 size="1.2rem" />}
                      />

                      <Button
                        ml={1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAddress(address._id);
                        }}
                        variant="ghost"
                        leftIcon={<Trash2 size="1.2rem" />}
                      />
                    </Flex>
                  }
                />
              </SelectableCard>
            );
          })}

        {addresses?.length === 0 && !isLoadingAddresses && (
          <Flex align="center" justify="center" direction="column" p={3}>
            <Result
              status="empty"
              // icon={
              //   <NoAddress
              //     primary={theme.colors.primary["500"]}
              //     background={theme.colors.background.dark}
              //   />
              // }
              title={t("address.noAddress")}
              description={t("address.noAddressExplanation")}
            />
          </Flex>
        )}
      </Grid>
    </Spinner>
  );
};

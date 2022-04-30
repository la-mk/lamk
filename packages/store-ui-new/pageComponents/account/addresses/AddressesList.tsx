import { Button, Flex, Grid, Result, Spinner } from "@la-mk/blocks-ui";
import { FinalBlocksTheme } from "@la-mk/blocks-ui/dist/theme";
import { useTranslation } from "next-i18next";
import React from "react";
import { Edit3, Trash2 } from "react-feather";
import { CustomCard } from "../../../components/CustomCard";
import { NoAddress } from "../../../components/icons/NoAddress";
import { SelectableCard } from "../../../components/SelectableCard";
import { ShippingDescription } from "../../../components/ShippingDescription";
import { Address } from "../../../domain/address";

export const AddressesList = ({
  isLoadingAddresses,
  addresses,
  selectedAddress,
  setSelectedAddress,
  setAddressToEdit,
  handleRemoveAddress,
  setShowAddModal,
  theme,
}: {
  isLoadingAddresses: boolean;
  addresses: Address[];
  selectedAddress?: Address;
  setSelectedAddress?: (address: Address) => void;
  setAddressToEdit: (address: Address) => void;
  handleRemoveAddress: (addressId: string) => void;
  setShowAddModal: (shouldShow: boolean) => void;
  theme: FinalBlocksTheme;
}) => {
  const { t } = useTranslation("translation");
  const CardForAddress = setSelectedAddress ? SelectableCard : CustomCard;

  return (
    <Spinner isLoaded={!isLoadingAddresses}>
      {/* @ts-ignore */}
      <Grid spacing={6}>
        {addresses?.length > 0 &&
          addresses.map((address) => {
            const isChecked =
              selectedAddress && selectedAddress._id === address._id;
            return (
              <CardForAddress
                key={address._id}
                isChecked={!!isChecked}
                onClick={() => setSelectedAddress?.(address)}
                width="100%"
              >
                <ShippingDescription
                  inverse={isChecked}
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
                        // @ts-ignore
                        color={isChecked ? "heading.light" : "heading.dark"}
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
                        // @ts-ignore
                        color={isChecked ? "heading.light" : "heading.dark"}
                        leftIcon={<Trash2 size="1.2rem" />}
                      />
                    </Flex>
                  }
                />
              </CardForAddress>
            );
          })}

        {addresses?.length === 0 && !isLoadingAddresses && (
          <Flex align="center" justify="center" direction="column" p={3}>
            <Result
              status="empty"
              icon={
                <NoAddress
                  primary={theme.colors.primary["500"]}
                  background={theme.colors.background.dark}
                />
              }
              title={t("address.noAddress")}
              description={t("address.noAddressExplanation")}
            />
          </Flex>
        )}
      </Grid>
    </Spinner>
  );
};

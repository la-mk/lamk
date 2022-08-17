import React, { useState } from "react";
import { Heading, Button, Flex, hooks } from "@la-mk/blocks-ui";
import { Plus } from "react-feather";
import { useTranslation } from "next-i18next";
import { User } from "../../../domain/user";
import { Address } from "../../../domain/address";
import { Addresses } from "../components/addresses/Addresses";

interface SelectAddressProps {
  storeId: string;
  user: User;
  deliverTo: Address | undefined;
  setDeliverTo: (address: Address) => void;
}

export const SelectAddress = ({
  storeId,
  user,
  deliverTo,
  setDeliverTo,
}: SelectAddressProps) => {
  const { t } = useTranslation("translation");
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const addAddressText = hooks.useBreakpoint([
    t("actions.add"),
    t("actions.add"),
    t("address.addNewAddress"),
  ]);

  return (
    <>
      <Flex mb={4} mt={8} align="center" justify="space-between">
        <Heading as="h3" size="md" noOfLines={1} mr={3}>
          {t("address.chooseShippingAddress")}
        </Heading>
        <Button
          variant="link"
          onClick={() => setAddressModalVisible(true)}
          leftIcon={<Plus size="1.2rem" />}
        >
          {addAddressText}
        </Button>
      </Flex>

      <Flex mt={3} mb={7} direction="column">
        <Addresses
          storeId={storeId}
          user={user}
          showAddModal={addressModalVisible}
          setShowAddModal={setAddressModalVisible}
          selectedAddress={deliverTo}
          onSelected={setDeliverTo}
        />
      </Flex>
    </>
  );
};

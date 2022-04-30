import * as React from "react";
import { NewForm, Button, Box, Flex, hooks } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { Address } from "../../../domain/address";
import { sdk } from "../../../sdk/sdk";

interface AddAddressFormProps {
  userId: string;
  address?: Address;
  onAddAddress: (address: Address) => void;
  onPatchAddress: (address: Address) => void;
  onCancel: () => void;
}

export const AddressForm = ({
  userId,
  address,
  onAddAddress,
  onPatchAddress,
  onCancel,
}: AddAddressFormProps) => {
  const { t } = useTranslation("translation");
  const [formData, setFormData] = hooks.useFormState<Address>(
    address,
    { addressFor: userId },
    [address, userId]
  );

  return (
    <Box width="100%">
      <NewForm<Address>
        schema={sdk.address.schema as any}
        uiSchema={{
          _id: {
            "ui:widget": "hidden",
          },
          createdAt: {
            "ui:widget": "hidden",
          },
          modifiedAt: {
            "ui:widget": "hidden",
          },
          addressFor: {
            "ui:widget": "hidden",
          },
          name: {
            "ui:title": t("common.name"),
            "ui:placeholder": t("common.addressExample"),
            "ui:options": {
              emphasized: true,
            },
          },
          // We don't need the region for now
          region: {
            "ui:widget": "hidden",
          },
          country: {
            "ui:title": t("common.country"),
            "ui:widget": "select",
            "ui:options": {
              emphasized: true,
              customEnumOptions: [{ value: "MK", label: t("countries.mk") }],
            },
          },
          city: {
            "ui:title": t("common.city"),
            "ui:options": {
              emphasized: true,
            },
          },
          zip: {
            "ui:title": t("common.zipcode"),
            "ui:options": {
              emphasized: true,
            },
          },
          street: {
            "ui:title": t("common.street"),
            "ui:placeholder": t("common.streetExample"),
            "ui:widget": "textarea",
            "ui:options": {
              emphasized: true,
              rows: 2,
            },
          },
          person: {
            "ui:title": t("common.addressee"),
            "ui:options": {
              emphasized: true,
            },
          },
          phoneNumber: {
            "ui:title": t("common.phoneNumber"),
            "ui:options": {
              emphasized: true,
            },
          },
        }}
        formData={formData as Address}
        onChange={({ formData }) => setFormData(formData)}
        onSubmit={({ formData }) =>
          address ? onPatchAddress(formData) : onAddAddress(formData)
        }
        getErrorMessage={(errorName, context) =>
          t(`errors.${errorName}`, context)
        }
      >
        <Flex width="100%" direction="column">
          <Button isFullWidth size={"lg"} type="submit">
            {address ? t("actions.update") : t("actions.create")}
          </Button>
          <Button
            mt={3}
            isFullWidth
            variant="outline"
            size={"lg"}
            onClick={onCancel}
          >
            {t("actions.cancel")}
          </Button>
        </Flex>
      </NewForm>
    </Box>
  );
};

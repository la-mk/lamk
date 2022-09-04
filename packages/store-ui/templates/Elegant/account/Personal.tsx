import React from "react";
import { useTranslation } from "next-i18next";
import { PersonalProps } from "../../../containers/account/Personal";
import { BasicUserForm, Spinner } from "@la-mk/blocks-ui";
import { sdk } from "../../../sdk/sdk";

export const Personal = ({
  isLoading,
  onPatchAccount,
  userForm,
  setUserForm,
}: PersonalProps) => {
  const { t } = useTranslation("translation");
  return (
    <Spinner isLoaded={!isLoading}>
      <BasicUserForm
        schema={sdk.utils.schema.pick(sdk.user.schema, [
          "firstName",
          "lastName",
          "phoneNumber",
        ])}
        emphasized
        onSubmit={onPatchAccount}
        onChange={({ formData }) => setUserForm(formData)}
        formData={userForm}
        getErrorMessage={(errorName, context) =>
          t(`errors.${errorName}`, context)
        }
      />
    </Spinner>
  );
};

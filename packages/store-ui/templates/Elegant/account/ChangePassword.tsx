import React from "react";
import { useTranslation } from "next-i18next";
import { ChangePasswordProps } from "../../../containers/account/ChangePassword";
import { sdk } from "../../../sdk/sdk";
import { Box, ChangePasswordForm, Spinner } from "@la-mk/blocks-ui";

export const ChangePassword = ({
  isLoading,
  onPatchAccount,
}: ChangePasswordProps) => {
  const { t } = useTranslation("translation");
  // currentPassword is a special field and is not part of the schema, but we want it to have the same characteristics as the standard password.
  const changePasswordSchema = sdk.utils.schema.pick(sdk.user.schema, [
    "password",
  ]);
  changePasswordSchema.properties = {
    currentPassword: changePasswordSchema.properties.password,
    password: changePasswordSchema.properties.password,
  };
  changePasswordSchema.required.push("currentPassword");

  return (
    <Spinner isLoaded={!isLoading}>
      <ChangePasswordForm
        schema={changePasswordSchema}
        emphasized
        onSubmit={onPatchAccount}
        getErrorMessage={(errorName, context) =>
          t(`errors.${errorName}`, context)
        }
      />
    </Spinner>
  );
};

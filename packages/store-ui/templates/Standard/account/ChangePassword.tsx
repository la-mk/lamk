import { ChangePasswordForm, Spinner } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import React from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Page } from "../Page";
import { sdk } from "../../../sdk/sdk";
import { urls } from "../../../tooling/url";
import { BackButton } from "./BackButton";
import { ChangePasswordProps } from "../../../containers/account/ChangePassword";

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
    <>
      <Breadcrumbs
        breadcrumbs={[
          { url: urls.home, title: t("pages.home") },
          { url: urls.accountChangePassword, title: t("pages.changePassword") },
        ]}
      />
      <Page maxWidth="86rem">
        <BackButton />
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
      </Page>
    </>
  );
};

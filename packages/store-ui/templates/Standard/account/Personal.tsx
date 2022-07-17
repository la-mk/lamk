import { BasicUserForm, Spinner } from "@la-mk/blocks-ui";
import React from "react";
import { BackButton } from "./BackButton";
import { useTranslation } from "next-i18next";
import { Page } from "../Page";
import { sdk } from "../../../sdk/sdk";
import { urls } from "../../../tooling/url";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PersonalProps } from "../../../containers/account/Personal";

export const Personal = ({
  isLoading,
  onPatchAccount,
  userForm,
  setUserForm,
}: PersonalProps) => {
  const { t } = useTranslation("translation");
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { url: urls.home, title: t("pages.home") },
          { url: urls.accountPersonal, title: t("pages.personalDetails") },
        ]}
      />
      <Page maxWidth={"86rem"}>
        <BackButton />
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
      </Page>
    </>
  );
};

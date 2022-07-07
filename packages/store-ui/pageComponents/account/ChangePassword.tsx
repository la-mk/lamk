import { ChangePasswordForm, Spinner, toast } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import React from "react";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { User } from "../../domain/user";
import { useAuth } from "../../hooks/useAuth";
import { Page } from "../../layout/Page";
import { sdk } from "../../sdk/sdk";
import { useMutation } from "../../sdk/useMutation";
import { urls } from "../../tooling/url";
import { BackButton } from "./BackButton";

export const ChangePassword = ({ user }: { user: User }) => {
  const { t } = useTranslation("translation");
  const { updateUser } = useAuth();
  const [patchUser, isPatching] = useMutation("user", "patch");

  const handlePatchAccount = React.useCallback(
    async ({ formData }: { formData: Partial<User> }) => {
      try {
        const updatedUser = await patchUser([user._id, formData]);
        updateUser(updatedUser);
        toast.success(t("auth.accountUpdateSuccess"));
      } catch (err) {
        console.error(err);
        toast.error(t("results.genericError"));
      }
    },
    [patchUser, updateUser, t, user._id]
  );

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
        <Spinner isLoaded={!isPatching}>
          <ChangePasswordForm
            schema={changePasswordSchema}
            emphasized
            onSubmit={handlePatchAccount}
            getErrorMessage={(errorName, context) =>
              t(`errors.${errorName}`, context)
            }
          />
        </Spinner>
      </Page>
    </>
  );
};

import { BasicUserForm, hooks, Spinner, toast } from "@la-mk/blocks-ui";
import pick from "lodash/pick";
import React from "react";
import { BackButton } from "./BackButton";
import { useTranslation } from "next-i18next";
import { Page } from "../../layout/Page";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { useMutation } from "../../sdk/useMutation";
import { User } from "../../domain/user";
import { sdk } from "../../sdk/sdk";
import { useAuth } from "../../hooks/useAuth";

export const Personal = ({ user }: { user: User }) => {
  const { t } = useTranslation("translation");
  const { updateUser } = useAuth();
  useBreadcrumbs([
    { url: "/", title: t("pages.home") },
    { url: "/account/personal", title: t("pages.personalDetails") },
  ]);

  const [patchUser, isPatching] = useMutation("user", "patch");

  const [userFormData, setUserFormData] = hooks.useFormState<Partial<User>>(
    pick(user, ["firstName", "lastName", "phoneNumber"]),
    {},
    [user]
  );

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

  return (
    <Page maxWidth={"86rem"}>
      <BackButton />
      <Spinner isLoaded={!isPatching}>
        <BasicUserForm
          schema={sdk.utils.schema.pick(sdk.user.schema, [
            "firstName",
            "lastName",
            "phoneNumber",
          ])}
          emphasized
          onSubmit={handlePatchAccount}
          onChange={({ formData }) => setUserFormData(formData)}
          formData={userFormData}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </Spinner>
    </Page>
  );
};

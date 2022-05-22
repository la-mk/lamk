import { ResetPasswordForm, Spinner, toast } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Page } from "../../layout/Page";
import { sdk } from "../../sdk/sdk";
import { useMutation } from "../../sdk/useMutation";

export const ResetPassword = ({
  resetToken,
}: {
  resetToken: string | undefined;
}) => {
  const { t } = useTranslation("translation");
  const { login } = useAuth();
  const [patchUser, isPatchingUser] = useMutation("user", "patch");
  const router = useRouter();

  const handleResetPasswordSubmitted = async ({ formData }: any) => {
    try {
      await patchUser([
        null,
        { password: formData.password },
        { query: { email: formData.email.toLowerCase(), resetToken } },
      ]);
      toast.success(t("auth.resetPasswordSuccess"));
      router.replace("/");
    } catch (err) {
      console.error(err);
      toast.success(t("results.genericError"));
    }
  };

  return (
    <Page>
      <Spinner isLoaded={!isPatchingUser}>
        <ResetPasswordForm
          schema={
            sdk.utils.schema.pick(sdk.user.schema, ["email", "password"]) as any
          }
          onLoginInstead={login}
          onSubmit={handleResetPasswordSubmitted}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </Spinner>
    </Page>
  );
};

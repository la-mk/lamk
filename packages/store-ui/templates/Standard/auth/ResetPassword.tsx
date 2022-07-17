import { ResetPasswordForm, Spinner } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import React from "react";
import { Page } from "../Page";
import { sdk } from "../../../sdk/sdk";
import { ResetPasswordProps } from "../../../containers/auth/ResetPassword";

export const ResetPassword = ({
  isUpdating,
  onLogin,
  onSubmitResetPassword,
}: ResetPasswordProps) => {
  const { t } = useTranslation("translation");

  return (
    <Page>
      <Spinner isLoaded={!isUpdating}>
        <ResetPasswordForm
          schema={
            sdk.utils.schema.pick(sdk.user.schema, ["email", "password"]) as any
          }
          onLoginInstead={onLogin}
          onSubmit={onSubmitResetPassword}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
        />
      </Spinner>
    </Page>
  );
};

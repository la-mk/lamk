import { ResetPassword as StandardResetPassword } from "../../templates/Standard/auth/ResetPassword";
import { ResetPassword as ElegantResetPassword } from "../../templates/Elegant/auth/ResetPassword";
import { Templates } from "..";
import { useAuth } from "../../hooks/useAuth";
import { useMutation } from "../../sdk/useMutation";
import { useRouter } from "next/router";
import { toast } from "@la-mk/blocks-ui";
import { urls } from "../../tooling/url";
import { useTranslation } from "next-i18next";

export interface ResetFormData {
  formData: { password: string; email: string };
}

export interface ResetPasswordProps {
  isUpdating: boolean;
  onLogin: () => void;
  onSubmitResetPassword: (formData: ResetFormData) => void;
}

export const ResetPassword = ({
  template,
  resetToken,
}: {
  template: Templates;
  resetToken: string | undefined;
}) => {
  const { t } = useTranslation("translation");
  const { login } = useAuth();
  const [patchUser, isPatchingUser] = useMutation("user", "patch");
  const router = useRouter();

  const handleResetPasswordSubmitted = async ({ formData }: ResetFormData) => {
    try {
      await patchUser([
        null,
        { password: formData.password },
        { query: { email: formData.email.toLowerCase(), resetToken } },
      ]);
      toast.success(t("auth.resetPasswordSuccess"));
      router.replace(urls.home);
    } catch (err) {
      console.error(err);
      toast.success(t("results.genericError"));
    }
  };

  switch (template) {
    case "standard":
      return (
        <StandardResetPassword
          isUpdating={isPatchingUser}
          onLogin={login}
          onSubmitResetPassword={handleResetPasswordSubmitted}
        />
      );
    case "elegant":
      return (
        <ElegantResetPassword
          isUpdating={isPatchingUser}
          onLogin={login}
          onSubmitResetPassword={handleResetPasswordSubmitted}
        />
      );
  }
};

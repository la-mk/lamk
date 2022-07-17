import { ChangePassword as StandardChangePassword } from "../../templates/Standard/account/ChangePassword";
import { ChangePassword as ElegantChangePassword } from "../../templates/Elegant/account/ChangePassword";
import { Templates } from "..";
import { User } from "../../domain/user";
import { useAuth } from "../../hooks/useAuth";
import { useMutation } from "../../sdk/useMutation";
import { useCallback } from "react";
import { toast } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";

export interface ChangePasswordProps {
  isLoading: boolean;
  onPatchAccount: (formData: { formData: Partial<User> }) => void;
}

export const ChangePassword = ({
  template,
  user,
}: {
  template: Templates;
  user: User;
}) => {
  const { t } = useTranslation("translation");
  const { updateUser } = useAuth();
  const [patchUser, isPatching] = useMutation("user", "patch");

  const handlePatchAccount = useCallback(
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

  switch (template) {
    case "standard":
      return (
        <StandardChangePassword
          onPatchAccount={handlePatchAccount}
          isLoading={isPatching}
        />
      );
    case "elegant":
      return (
        <ElegantChangePassword
          onPatchAccount={handlePatchAccount}
          isLoading={isPatching}
        />
      );
  }
};

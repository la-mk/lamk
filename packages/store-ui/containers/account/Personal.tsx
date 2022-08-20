import { Personal as StandardPersonal } from "../../templates/Standard/account/Personal";
import { Personal as ElegantPersonal } from "../../templates/Elegant/account/Personal";
import { Templates } from "..";
import { User } from "../../domain/user";
import { useAuth } from "../../hooks/useAuth";
import { useMutation } from "../../sdk/useMutation";
import { hooks, toast } from "@la-mk/blocks-ui";
import { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { DeepPartial } from "@la-mk/blocks-ui/dist/theme";
import { pick } from "lodash";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";

export interface PersonalProps {
  isLoading: boolean;
  onPatchAccount: (formData: { formData: DeepPartial<User> }) => void;
  userForm: any;
  setUserForm: (user: any) => void;
}

export const Personal = ({
  template,
  user,
}: {
  template: Templates;
  user?: User;
}) => {
  const { t } = useTranslation("translation");
  useProtectedRoute();

  const { updateUser } = useAuth();
  const [patchUser, isPatching] = useMutation("user", "patch");
  const [userFormData, setUserFormData] = hooks.useFormState<Partial<User>>(
    pick(user, ["firstName", "lastName", "phoneNumber"]),
    {},
    [user]
  );

  const handlePatchAccount = useCallback(
    async ({ formData }: { formData: Partial<User> }) => {
      if (!user?._id) {
        return;
      }

      try {
        const updatedUser = await patchUser([user._id, formData]);
        updateUser(updatedUser);
        toast.success(t("auth.accountUpdateSuccess"));
      } catch (err) {
        console.error(err);
        toast.error(t("results.genericError"));
      }
    },
    [patchUser, updateUser, t, user?._id]
  );

  switch (template) {
    case "standard":
      return (
        <StandardPersonal
          isLoading={isPatching}
          userForm={userFormData}
          setUserForm={setUserFormData}
          onPatchAccount={handlePatchAccount}
        />
      );
    case "elegant":
      return (
        <ElegantPersonal
          isLoading={isPatching}
          userForm={userFormData}
          setUserForm={setUserFormData}
          onPatchAccount={handlePatchAccount}
        />
      );
  }
};

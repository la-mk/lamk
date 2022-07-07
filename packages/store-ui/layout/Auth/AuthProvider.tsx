import React, { useCallback, useMemo, useState } from "react";
import { toast } from "@la-mk/blocks-ui";
import { session } from "@la-mk/analytics";
import { Store } from "../../domain/store";
import { sdk } from "../../sdk/sdk";
import { AuthHandler } from "./AuthHandler";
import { User } from "../../domain/user";
import { analytics } from "../../tooling/analytics";
import { useTranslation } from "next-i18next";
import { useCart } from "../../hooks/useCart";

export const AuthContext = React.createContext({
  login: () => {},
  logout: () => {},
  isLoadingUser: (): boolean => false,
  user: undefined as User | undefined,
  updateUser: (user: User) => {},
});

export const AuthProvider = ({
  storeId,
  children,
}: {
  storeId: string;
  children: React.ReactElement;
}) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation("translation");
  const [user, setUser] = useState<User | undefined>();
  const { clearCart } = useCart(storeId, user, t);

  const isLoadingUser = useCallback(() => {
    return isLoading;
  }, [isLoading]);

  const updateUser = useCallback(
    (newUser?: User) => {
      setUser(newUser);

      // It means the user was once authenticated, but the token expired or they logged out.
      if (!newUser) {
        analytics?.reset?.();
        session.initializeSession();
        clearCart(true);
      }
    },
    [clearCart]
  );

  const onClose = useCallback(() => setShowAuth(false), []);

  const login = useCallback(() => {
    setShowAuth(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await sdk.auth.logout();
      updateUser(undefined);

      toast.success(t("auth.logoutSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("results.genericError"));
    }
  }, [t, updateUser]);

  const val = useMemo(
    () => ({
      login,
      logout,
      isLoadingUser,
      user,
      updateUser,
    }),
    [login, logout, isLoadingUser, user, updateUser]
  );

  return (
    <AuthContext.Provider value={val}>
      {children}
      <AuthHandler
        storeId={storeId}
        onClose={onClose}
        onAuthChanged={updateUser}
        onLoading={setIsLoading}
        showModal={showAuth}
      />
    </AuthContext.Provider>
  );
};

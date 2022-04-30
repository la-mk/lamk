import React, { useCallback, useState } from "react";
import { toast } from "@la-mk/blocks-ui";
import { session } from "@la-mk/analytics";
import { Store } from "../../domain/store";
import { sdk } from "../../sdk/sdk";
import { AuthHandler } from "./AuthHandler";
import { User } from "../../domain/user";
import { analytics } from "../../tooling/analytics";

export const AuthContext = React.createContext({
  login: () => {},
  logout: () => {},
  isLoadingUser: (): boolean => false,
  user: undefined as User | undefined,
  updateUser: (user: User) => {},
});

// TODO: clear stuff on logout or when onAuthSuccess is undefined
// export function* clearSessionSaga() {
//   sessionStorage.clear();
//   yield put(setUser(null));
//   yield put(setCartWithProducts(null));
// }

export const AuthProvider = ({
  store,
  children,
}: {
  store: Store;
  children: React.ReactElement;
}) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>();

  const login = useCallback(() => {
    setShowAuth(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      // TODO: translate
      await sdk.auth.logout();
      setUser(undefined);

      // Initialize a new session after logging out.
      analytics?.reset?.();
      session.initializeSession();

      toast.success("see you soon!");
    } catch (err) {
      toast.error("failed to log out");
    }
  }, []);

  const isLoadingUser = useCallback(() => {
    return isLoading;
  }, [isLoading]);

  const updateUser = useCallback((user: User) => {
    setUser(user);
  }, []);

  const onClose = useCallback(() => setShowAuth(false), []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoadingUser,
        user,
        updateUser,
      }}
    >
      {children}
      <AuthHandler
        storeId={store._id}
        onClose={onClose}
        onAuthSuccess={setUser}
        onLoading={setIsLoading}
        showModal={showAuth}
      />
    </AuthContext.Provider>
  );
};

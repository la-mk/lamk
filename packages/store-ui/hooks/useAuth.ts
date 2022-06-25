import { useContext } from "react";
import { AuthContext } from "../layout/Auth/AuthProvider";

export const useAuth = () => {
  const { login, logout, isLoadingUser, user, updateUser } =
    useContext(AuthContext);
  return { login, logout, isLoadingUser, user, updateUser };
};

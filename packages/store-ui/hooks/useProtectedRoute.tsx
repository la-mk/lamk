import { useRouter } from "next/router";
import { useEffect } from "react";
import { urls } from "../tooling/url";
import { useAuth } from "./useAuth";

export const useProtectedRoute = () => {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();

  useEffect(() => {
    if (!user && !isLoadingUser()) {
      router.push(urls.login);
    }
  }, [user, router, isLoadingUser]);
};

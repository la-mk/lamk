import { useRouter } from "next/router";
import { useEffect } from "react";
import { urls } from "../tooling/url";
import { useAuth } from "./useAuth";

export const useProtectedRoute = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push(urls.login);
    }
  }, [user, router]);
};

import { Button, Flex, Spinner } from "@la-mk/blocks-ui";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Templates } from "..";
import { useAuth } from "../../hooks/useAuth";
import { urls } from "../../tooling/url";

export const Login = ({ template }: { template: Templates }) => {
  const [hasShownLogin, setHasShownLogin] = useState(false);
  const { user, login, isAuthShown } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      login();
      setHasShownLogin(true);
    } else {
      router.back();
    }
  }, [user, login, router]);

  useEffect(() => {
    if (hasShownLogin && !isAuthShown) {
      router.replace(urls.home);
    }
  }, [isAuthShown, hasShownLogin, router]);

  return (
    <Flex align={"center"} justify="center">
      <Spinner isLoaded={false} />
    </Flex>
  );
};

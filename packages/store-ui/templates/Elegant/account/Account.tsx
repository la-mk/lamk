import React, { useEffect } from "react";
import { AccountProps } from "../../../containers/account";
import { Flex, Spinner } from "@la-mk/blocks-ui";
import { useRouter } from "next/router";
import { urls } from "../../../tooling/url";

export const Account = ({}: AccountProps) => {
  const router = useRouter();

  useEffect(() => {
    router.push(urls.accountPersonal);
  }, [router]);

  return (
    <Flex align={"center"} justify="center">
      <Spinner isLoaded={false} />
    </Flex>
  );
};

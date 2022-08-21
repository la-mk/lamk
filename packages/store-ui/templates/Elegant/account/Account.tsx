import React, { useEffect } from "react";
import { AccountProps } from "../../../containers/account";
import { Box, Flex, Spinner } from "@la-mk/blocks-ui";
import { useRouter } from "next/router";
import { urls } from "../../../tooling/url";

export const Account = ({}: AccountProps) => {
  const router = useRouter();

  useEffect(() => {
    router.push(urls.accountPersonal);
  }, [router]);

  // onClick={() => {
  //   logout();
  //   router.replace(urls.home);
  // }}
  return (
    <Flex align={"center"} justify="center">
      <Spinner isLoaded={false} />
    </Flex>
  );
};

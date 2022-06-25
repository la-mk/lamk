import { FacebookChat } from "@la-mk/blocks-ui";
import React from "react";
import { Store } from "../domain/store";
import { useQuery } from "../sdk/useQuery";

export const Integrations = ({ store }: { store: Store }) => {
  const [integrations, isLoading, error] = useQuery(
    "storeIntegrations",
    "findForStore",
    [store?._id],
    { enabled: !!store }
  );

  if (isLoading || error) {
    return null;
  }

  const services = integrations?.data?.[0]?.services;
  return (
    <>
      {services?.facebookChat?.pageId && (
        <FacebookChat pageId={services.facebookChat.pageId} />
      )}
    </>
  );
};

import { FacebookChat } from "@la-mk/blocks-ui";
import React from "react";
import { useQuery } from "../sdk/useQuery";

export const Integrations = ({ storeId }: { storeId: string }) => {
  const [integrations, isLoading, error] = useQuery(
    "storeIntegrations",
    "findForStore",
    [storeId],
    { enabled: !!storeId }
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

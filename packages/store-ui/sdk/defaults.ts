import { Store } from "../domain/store";
import { getQueryClient } from "./queryClient";

export const getDefaultPrefetch = (qc: ReturnType<typeof getQueryClient>, store: Store) => {
  return [
    qc.prefetchQuery("storeContents", "getLandingContentForStore", [store._id]),
    qc.prefetchQuery("storeCategory", "findForStore", [store._id]),
  ];
};

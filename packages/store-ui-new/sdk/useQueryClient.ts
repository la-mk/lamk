import { useQueryClient as useBaseQueryClient } from "react-query";
import { getQueryClient } from "./queryClient";

export const useQueryClient = () => {
  const bqc = useBaseQueryClient();

  return getQueryClient(bqc);
};

import {
  UseBaseQueryResult,
  UseQueryOptions,
  useQuery as useBaseQuery,
} from "react-query";
import { sdk } from "./sdk";

export type Models = typeof sdk;

export type Methods<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type SdkRequest<T> = T extends (...args: infer O) => any ? O : any;

export type SdkResponse<T> = T extends (...args: any[]) => Promise<infer O>
  ? O
  : any;

export type UseQueryResult<
  T extends keyof Models,
  K extends Methods<Models[T]>
> = [
  data: SdkResponse<Models[T][K]> | undefined,
  loading: boolean,
  error: Error | null,
  refresh: UseBaseQueryResult["refetch"],
  remove: () => void
];

export const useQuery = <T extends keyof Models, K extends Methods<Models[T]>>(
  model: T,
  methodName: K,
  query: SdkRequest<Models[T][K]>,
  config?: Pick<
    UseQueryOptions<SdkRequest<Models[T][K]>, Error, SdkResponse<Models[T][K]>>,
    | "enabled"
    | "keepPreviousData"
    | "cacheTime"
    | "refetchInterval"
    | "refetchOnMount"
    | "staleTime"
    | "onSuccess"
    | "onError"
  >
): UseQueryResult<T, K> => {
  const method = () => (sdk[model][methodName] as any)(...query);

  const { data, isLoading, isFetching, error, refetch, remove } = useBaseQuery<
    SdkRequest<Models[T][K]>,
    Error,
    SdkResponse<Models[T][K]>
  >([model, methodName, ...query], method, config);

  return [data, isLoading || isFetching, error, refetch, remove];
};

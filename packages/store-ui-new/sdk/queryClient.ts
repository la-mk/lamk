import {
  dehydrate,
  InvalidateQueryFilters,
  QueryClient,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { sdk } from "./sdk";
import { Methods, Models, SdkRequest, SdkResponse } from "./useQuery";

export interface RequestData<
  T extends keyof Models,
  K extends Methods<Models[T]>
> {
  model: T;
  methodName: K;
  query: SdkRequest<Models[T][K]>;
}

export const newClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 2,
        cacheTime: 1000 * 60 * 2,
        staleTime: 1000 * 20,
        onError: (error: unknown) => {
          console.debug(error);
        },
      },
      mutations: {
        retry: false,
      },
    },
  });

  return getQueryClient(queryClient);
};

export const getProps = (qc: ReturnType<typeof getQueryClient>) => {
  const dehydratedState = dehydrate(qc._qc);
  qc._qc.clear();
  return { dehydratedState };
};

export const getQueryClient = (bqc: QueryClient) => {
  return {
    _qc: bqc,
    getQueryData: <T extends keyof Models, K extends Methods<Models[T]>>(
      model: T,
      methodName: K,
      query: SdkRequest<Models[T][K]>
    ) =>
      bqc.getQueryData<SdkResponse<Models[T][K]>>([
        model,
        methodName,
        ...query,
      ]),

    setQueryData: <T extends keyof Models, K extends Methods<Models[T]>>(
      model: T,
      methodName: K,
      query: SdkRequest<Models[T][K]>,
      data: SdkResponse<Models[T][K]>
    ) =>
      bqc.setQueryData<SdkResponse<Models[T][K]>>(
        [model, methodName, ...query],
        data
      ),

    prefetchQuery: <T extends keyof Models, K extends Methods<Models[T]>>(
      model: T,
      methodName: K,
      query: SdkRequest<Models[T][K]>
    ) => {
      const method = () => (sdk[model][methodName] as any)(...query);
      return bqc.prefetchQuery<SdkResponse<Models[T][K]>>(
        [model, methodName, ...query],
        method
      );
    },

    invalidateQueries: <T extends keyof Models, K extends Methods<Models[T]>>(
      model: T,
      methodName: K,
      query: SdkRequest<Models[T][K]>,
      filters?: InvalidateQueryFilters
    ) => bqc.invalidateQueries([model, methodName, ...query], filters),

    removeQueries: <T extends keyof Models, K extends Methods<Models[T]>>(
      model: T,
      methodName: K,
      query: SdkRequest<Models[T][K]>,
      filters?: InvalidateQueryFilters
    ) => bqc.removeQueries([model, methodName, ...query], filters),

    refetch: <T extends keyof Models, K extends Methods<Models[T]>>(
      model: T,
      methodName: K,
      query: SdkRequest<Models[T][K]>,
      filters?: RefetchQueryFilters<SdkRequest<Models[T][K]>>,
      options?: RefetchOptions
    ) => bqc.refetchQueries([model, methodName, ...query], filters, options),
  };
};

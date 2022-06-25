import {
  UseMutateAsyncFunction,
  useMutation as useBaseMutation,
  UseMutationOptions,
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

export type UseMutationResult<
  T extends keyof Models,
  K extends Methods<Models[T]>
> = [
  UseMutateAsyncFunction<
    SdkResponse<Models[T][K]>,
    Error,
    SdkRequest<Models[T][K]>
  >,
  boolean,
  Error | null,
  SdkResponse<Models[T][K]> | undefined
];

export const useMutation = <
  T extends keyof Models,
  K extends Methods<Models[T]>
>(
  model: T,
  methodName: K,
  config?: Pick<
    UseMutationOptions<
      SdkResponse<Models[T][K]>,
      Error,
      SdkRequest<Models[T][K]>
    >,
    "onMutate" | "onSuccess" | "onError" | "onSettled"
  >
): UseMutationResult<T, K> => {
  const method = (req: SdkRequest<Models[T][K]>) =>
    (sdk[model][methodName] as any)(...req);

  const { data, mutateAsync, isLoading, error } = useBaseMutation<
    SdkResponse<Models[T][K]>,
    Error,
    SdkRequest<Models[T][K]>
  >(method, { mutationKey: [model, methodName], retry: false, ...config });

  return [mutateAsync, isLoading, error, data];
};

// const method = <TVariables, TData>(req: TVariables) =>
//   sdk[model][methodName](req).response as TData;

// const { data, mutateAsync, isLoading, error } = useBaseMutation<
//   UnaryResponse<Models[T][K]>,
//   RequestError,
//   Parameters<Models[T][K]>[0]
// >(method, { mutationKey: [model, methodName], retry: false, ...config });

// return [mutateAsync, isLoading, error, data];

import { from } from "env-var";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const vars = {
  API_ENDPOINT:
    process.env.NEXT_PUBLIC_API_ENDPOINT || publicRuntimeConfig.API_ENDPOINT,
  ARTIFACTS_ENDPOINT:
    process.env.NEXT_PUBLIC_ARTIFACTS_ENDPOINT ||
    publicRuntimeConfig.ARTIFACTS_ENDPOINT,
  IMAGES_PROXY_ENDPOINT:
    process.env.NEXT_PUBLIC_IMAGES_PROXY_ENDPOINT ||
    publicRuntimeConfig.IMAGES_PROXY_ENDPOINT,
  ANALYTICS_TRACKING_ID:
    process.env.NEXT_PUBLIC_ANALYTICS_TRACKING_ID ||
    publicRuntimeConfig.ANALYTICS_TRACKING_ID,
  NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV || publicRuntimeConfig.NODE_ENV,
  NESTPAY_GATEWAY_ENDPOINT:
    process.env.NEXT_PUBLIC_NESTPAY_GATEWAY_ENDPOINT ||
    publicRuntimeConfig.NESTPAY_GATEWAY_ENDPOINT,
  DEV_STORE_URL:
    process.env.NEXT_PUBLIC_DEV_STORE_URL || publicRuntimeConfig.DEV_STORE_URL,
};

const envvar = from(vars as any);

export let envvars: ReturnType<typeof loadEnv>;
export const loadEnv = () => {
  const tmpEnv = {
    API_ENDPOINT: envvar.get("API_ENDPOINT").required().asString(),
    ARTIFACTS_ENDPOINT: envvar.get("ARTIFACTS_ENDPOINT").required().asString(),
    IMAGES_PROXY_ENDPOINT: envvar
      .get("IMAGES_PROXY_ENDPOINT")
      .required()
      .asString(),
    ANALYTICS_TRACKING_ID: envvar.get("ANALYTICS_TRACKING_ID").asString(),
    NODE_ENV: envvar
      .get("NODE_ENV")
      .required()
      .asEnum(["development", "production"]),
    NESTPAY_GATEWAY_ENDPOINT: envvar
      .get("NESTPAY_GATEWAY_ENDPOINT")
      .required()
      .asString(),
    DEV_STORE_URL: envvar.get("DEV_STORE_URL").asString(),
  };
  envvars = tmpEnv;
  return tmpEnv;
};

import { sdk } from "@la-mk/la-sdk";
import { ImageParameters } from "@la-mk/la-sdk/dist/models/artifact";

export const getImageURL = (
  artifactId: string,
  storeId: string,
  params?: ImageParameters
) => {
  if (artifactId.startsWith("http")) {
    return artifactId;
  }

  return sdk.artifact.getUrlForImage(artifactId, storeId, params);
};

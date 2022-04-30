import React from "react";
import { Flex, Image } from "@la-mk/blocks-ui";
import { getImageURL } from "../../hacks/imageUrl";
import { Media } from "../../domain/media";

export interface ThumbnailsProps {
  media: Media[];
  imageBucket: string;
  selectedImage: string;
  onImageClick: (imageId: string) => void;
}

export const Thumbnails = ({
  media,
  imageBucket,
  selectedImage,
  onImageClick,
}: ThumbnailsProps) => {
  return (
    <Flex direction="row" wrap="wrap" justify="center">
      {media.map((mediaFile, index) => {
        return (
          <Flex
            key={mediaFile._id}
            // @ts-ignore
            style={
              selectedImage === mediaFile._id
                ? { border: "1px solid lightgray" }
                : {}
            }
            justify="center"
            align="center"
            height={"5rem"}
            width={"5rem"}
            m={2}
          >
            <Image
              height={70}
              alt={`product-thumbnail-${index}`}
              style={{ cursor: "pointer" }}
              onClick={() => onImageClick(mediaFile._id)}
              getSrc={(params) =>
                getImageURL(mediaFile._id, imageBucket, params)
              }
            />
          </Flex>
        );
      })}
    </Flex>
  );
};

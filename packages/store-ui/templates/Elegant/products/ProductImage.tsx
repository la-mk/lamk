import React, { useState } from "react";
import { Flex, Box, Image, ImageMagnifier, Carousel } from "@la-mk/blocks-ui";
import { Product } from "../../../domain/product";
import { Store } from "../../../domain/store";
import { getImageURL } from "../../../hacks/imageUrl";
import { Thumbnails } from "./Thumbnails";
import { Media } from "../../../domain/media";
import { ImageBackgroundBox } from "../../../components/ImageBackgroundBox";
import styled from "@emotion/styled";

const MagnifierWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProductImage = ({
  product,
  store,
}: {
  product: Product;
  store: Store;
}) => {
  const [selectedImage, setSelectedImage] = useState(product.media[0]?._id);

  React.useEffect(() => {
    if (product._id && product?.media) {
      setSelectedImage(product.media[0]?._id);
    }
  }, [product._id, product?.media]);

  return (
    <>
      <Box width="100%" display={["initial", "initial", "none"]}>
        <Carousel
          navigation="dots"
          fullscreen
          items={product.media}
          renderItem={(item: Media) => (
            <ImageBackgroundBox
              url={getImageURL(item._id, store._id, {}) ?? ""}
              height={["22rem", "36rem", "32rem"]}
              width="100%"
            />
          )}
        />
      </Box>
      <Flex
        display={["none", "none", "initial"]}
        width={"65%"}
        align="center"
        justify="flex-start"
        direction="column"
        mr={2}
      >
        <Box height={"36rem"} minWidth={"12rem"}>
          <MagnifierWrapper>
            <ImageMagnifier
              magnifierSize={320}
              zoomFactor={0.5}
              src={getImageURL(selectedImage, store._id)!}
            >
              {(imageProps) => (
                <Image
                  width={"100%"}
                  style={{ objectFit: "contain" }}
                  {...imageProps}
                  getSrc={(params) =>
                    getImageURL(selectedImage, store._id, params)
                  }
                  height={440}
                  alt={product.name}
                />
              )}
            </ImageMagnifier>
          </MagnifierWrapper>
        </Box>
        <Box mt={4} maxWidth={"80%"}>
          <Thumbnails
            media={product.media}
            imageBucket={store._id}
            selectedImage={selectedImage}
            onImageClick={setSelectedImage}
          />
        </Box>
      </Flex>
    </>
  );
};

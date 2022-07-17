import React, { useState } from "react";
import { Flex, Box, Image, ImageMagnifier } from "@la-mk/blocks-ui";
import { Product } from "../../../domain/product";
import { Store } from "../../../domain/store";
import { useTranslation } from "next-i18next";
import { getImageURL } from "../../../hacks/imageUrl";
import { ProductTags } from "../components/product/ProductTags";
import { Thumbnails } from "./Thumbnails";

export const ProductImage = ({
  product,
  store,
}: {
  product: Product;
  store: Store;
}) => {
  const { t } = useTranslation("translation");
  const [selectedImage, setSelectedImage] = useState(product.media[0]?._id);

  React.useEffect(() => {
    if (product._id && product?.media) {
      setSelectedImage(product.media[0]?._id);
    }
  }, [product._id, product?.media]);

  return (
    <Flex
      width={["100%", "50%", "50%"]}
      align="center"
      justify="flex-start"
      direction="column"
      mr={[0, 2, 2]}
    >
      <Box
        height={"28rem"}
        minWidth={"12rem"}
        // @ts-ignore
        style={{ position: "relative" }}
      >
        <ImageMagnifier
          magnifierSize={320}
          zoomFactor={0.5}
          src={getImageURL(selectedImage, store._id)!}
        >
          {(imageProps) => (
            <Image
              style={{ objectFit: "contain" }}
              {...imageProps}
              getSrc={(params) => getImageURL(selectedImage, store._id, params)}
              height={440}
              alt={product.name}
            />
          )}
        </ImageMagnifier>
        <ProductTags product={product} t={t} />
      </Box>
      <Box mt={4} maxWidth={["100%", "100%", "80%"]}>
        <Thumbnails
          media={product.media}
          imageBucket={store._id}
          selectedImage={selectedImage}
          onImageClick={setSelectedImage}
        />
      </Box>
    </Flex>
  );
};

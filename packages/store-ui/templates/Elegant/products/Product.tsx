import React from "react";
import { Flex, Box, Spinner } from "@la-mk/blocks-ui";
import { Page } from "../Page";
import { ProductDescription } from "./ProductDescription";
import { ProductImage } from "./ProductImage";
import { ProductOptions } from "./ProductOptions";
import { ProductDetails } from "./ProductDetails";
import { ProductSet } from "../components/sets/ProductSet";
import { ProductProps } from "../../../containers/products/Details";
import { getImageURL } from "../../../hacks/imageUrl";
import { ImageBackgroundBox } from "../../../components/ImageBackgroundBox";
import styled from "@emotion/styled";

const DetailsWrapper = styled(Flex)`
  @keyframes detailsAppear {
    0% {
      transform: translateY(7%);
      opacity: 0.2;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  & {
    animation: 1.3s ease-out 0s 1 detailsAppear;
  }
`;

export const Product = ({
  product,
  store,
  cart,
  delivery,
  sets,
  isLoadingSets,
  isLoadingProduct,
  outOfStock,
  selectedVariant,
  chosenAttributes,
  setChosenAttributes,
  quantity,
  setQuantity,
  onAddToCart,
}: ProductProps) => {
  const singleSet = (sets ?? [])[0];

  return (
    <>
      <Page>
        <Spinner isLoaded={!isLoadingProduct}>
          <Flex
            mt={[0, 0, 7]}
            direction={["column", "column", "row"]}
            align={["center", "center", "flex-start"]}
            justify="center"
          >
            <ProductImage product={product} store={store} />
            <DetailsWrapper
              mt={[4, 6, 0]}
              ml={[0, 0, 2]}
              px={[4, 6, 7]}
              width={["100%", "100%", "40%"]}
              maxWidth="36rem"
              align={["center", "center", "flex-start"]}
              justify="flex-start"
              direction="column"
            >
              <ProductDescription
                store={store}
                product={product}
                selectedVariant={selectedVariant}
                outOfStock={outOfStock}
              />

              <ProductOptions
                product={product}
                cart={cart}
                selectedVariant={selectedVariant}
                outOfStock={outOfStock}
                chosenAttributes={chosenAttributes}
                setChosenAttributes={setChosenAttributes}
                quantity={quantity}
                setQuantity={setQuantity}
                handleAddToCart={onAddToCart}
              />
              <Box width="100%" mx={[4, 4, 0]} mt={[6, 7, 7]}>
                <ProductDetails
                  store={store}
                  product={product}
                  delivery={delivery}
                />
              </Box>
            </DetailsWrapper>
          </Flex>

          {!!product.media[1] && (
            <Box mt={8} height={["32rem", "44rem", "52rem"]}>
              <ImageBackgroundBox
                url={getImageURL(product.media[1]?._id, store._id, {}) ?? ""}
                height="100%"
              />
            </Box>
          )}
        </Spinner>

        <Spinner isLoaded={!isLoadingSets}>
          {singleSet && (
            <Box mt={[8, 9, 9]} mb={[7, 7, 8]}>
              <ProductSet
                set={singleSet}
                store={store}
                key={singleSet.setTag.type + (singleSet.setTag.value || "")}
              />
            </Box>
          )}
        </Spinner>
      </Page>
    </>
  );
};

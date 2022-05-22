import difference from "lodash/difference";
import uniq from "lodash/uniq";
import { isEqual, omitBy, isNil } from "lodash";
import React from "react";
import { Flex, Text, Button, Input, PickerBoxes } from "@la-mk/blocks-ui";
import Link from "next/link";
import { Attributes, Product, Variant } from "../../domain/product";
import { useTranslation } from "next-i18next";
import { CartWithProducts } from "../../domain/cart";
import { urls } from "../../tooling/url";

export const areObjectsEquivalent = (
  a: object | undefined,
  b: object | undefined
) => {
  return isEqual(omitBy(a, isNil), omitBy(b, isNil));
};

export const ProductOptions = ({
  product,
  cart,
  selectedVariant,
  outOfStock,
  chosenAttributes,
  setChosenAttributes,
  quantity,
  setQuantity,
  handleAddToCart,
}: {
  product: Product;
  cart: CartWithProducts;
  selectedVariant?: Variant | null;
  outOfStock: boolean;
  chosenAttributes?: Attributes;
  setChosenAttributes: (attributes: Attributes) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
}) => {
  const { t } = useTranslation("translation");

  const isProductInCart =
    cart &&
    cart.items &&
    cart.items.some(
      (item) =>
        item.product._id === product._id &&
        areObjectsEquivalent(
          item.product?.attributes,
          selectedVariant?.attributes
        )
    );

  const allColors = uniq(
    product.variants
      .map((variant) => variant.attributes?.color)
      .filter((x) => !!x) as string[]
  );

  const allSizes = uniq(
    product.variants
      .map((variant) => variant.attributes?.size)
      .filter((x) => !!x) as string[]
  );

  const variantsWithStock = product.variants.filter(
    (variant) => variant.stock == null || variant.stock > 0
  );

  const remainingColorChoices = chosenAttributes?.size
    ? (variantsWithStock
        .filter((variant) => variant.attributes?.size === chosenAttributes.size)
        .map((variant) => variant.attributes?.color)
        .filter((x) => !!x) as string[])
    : (variantsWithStock
        .map((variant) => variant.attributes?.color)
        .filter((x) => !!x) as string[]);

  const remainingSizeChoices = chosenAttributes?.color
    ? (variantsWithStock
        .filter(
          (variant) => variant.attributes?.color === chosenAttributes.color
        )
        .map((variant) => variant.attributes?.size)
        .filter((x) => !!x) as string[])
    : (variantsWithStock
        .map((variant) => variant.attributes?.size)
        .filter((x) => !!x) as string[]);

  const disabledSizeChoices = difference(allSizes, remainingSizeChoices);
  const disabledColorChoices = difference(allColors, remainingColorChoices);

  return (
    <>
      {allColors.length > 0 && (
        <Flex align="center" justify="center" mt={3}>
          <Text mr={2}>{t("attributes.color")}:</Text>
          <PickerBoxes
            size="sm"
            variant="color"
            disabled={disabledColorChoices}
            values={allColors}
            selected={chosenAttributes?.color}
            onSelect={(color: string | undefined) =>
              setChosenAttributes({ ...(chosenAttributes ?? {}), color })
            }
          />
        </Flex>
      )}

      {allSizes.length > 0 && (
        <Flex align="center" justify="center" mt={3}>
          <Text mr={2}>{t("attributes.size")}:</Text>
          <PickerBoxes
            size="sm"
            disabled={disabledSizeChoices}
            values={allSizes}
            selected={chosenAttributes?.size}
            onSelect={(size: string | undefined) =>
              setChosenAttributes({ ...(chosenAttributes ?? {}), size })
            }
          />
        </Flex>
      )}

      <Flex mt={[4, 6, 6]} direction="row" align="center">
        {!isProductInCart && (
          <>
            <Input
              type="number"
              isDisabled={outOfStock || !selectedVariant}
              width="6rem"
              size="lg"
              min={1}
              max={selectedVariant?.stock || 9999}
              value={quantity}
              onChange={(_e, val) => setQuantity(val as number)}
              mr={3}
            />
          </>
        )}
        {isProductInCart ? (
          <>
            <Text color="mutedText.dark">{t("cart.productAlreadyInCart")}</Text>
            <Link passHref href={urls.cart}>
              <Button as="a" size="lg" ml={2}>
                {t("actions.goToCart")}
              </Button>
            </Link>
          </>
        ) : (
          <Button
            isDisabled={outOfStock || !selectedVariant}
            onClick={handleAddToCart}
            ml={2}
            size="lg"
          >
            {t("actions.addToCart")}
          </Button>
        )}
      </Flex>
    </>
  );
};

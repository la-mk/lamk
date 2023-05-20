import React from "react";
import { Text, PickerBox, Flex } from "@la-mk/blocks-ui";
import { TFunction } from "next-i18next";
import { Attributes } from "../../../../domain/product";

const getColorNames = (color: string | undefined, t: TFunction): string => {
  color = color?.toUpperCase();
  if (color === "#800000") {
    return t("wood.walnut");
  } else if (color === "#FFD700") {
    return t("wood.cherry");
  }
  return "";
};

export const VariantName = ({
  attributes,
  tCustom,
}: {
  attributes?: Attributes;
  tCustom: TFunction;
}) => {
  const values = Object.entries(attributes ?? {})
    .filter(([_, val]) => !!val)
    .map(([key, value], index) => {
      switch (key) {
        case "color": {
          return (
            <>
              {index > 0 && <Text mx={1}>·</Text>}
              {/* TODO: This is a hack for mokudo where the colors indicate material, otherwise we should use color variant of the picker */}
              <PickerBox
                size="sm"
                value={getColorNames(value, tCustom)}
                variant="text"
              />
            </>
          );
        }

        default:
          return (
            <>
              {index > 0 && <Text mx={1}>·</Text>}
              {value}
            </>
          );
      }
    });

  if (!values.length) {
    return null;
  }

  return (
    <Flex mt={3} align="center">
      {values}
    </Flex>
  );
};

import React from 'react';
import { Attributes } from '@la-mk/la-sdk/dist/models/product';
import { Text, PickerBox, Flex } from '@la-mk/blocks-ui';
import { TFunction } from 'next-i18next';

export const VariantName = ({
  attributes,
  t,
}: {
  attributes: Attributes;
  t: TFunction;
}) => {
  const values = Object.entries(attributes ?? {})
    .filter(([_, val]) => !!val)
    .map(([key, value], index) => {
      switch (key) {
        case 'color': {
          return (
            <>
              {index > 0 && <Text mx={1}>·</Text>}
              <PickerBox size='sm' value={value} variant='color' />
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

  return <Flex align='center'>{values}</Flex>;
};

import React from 'react';
import { Attributes } from '@sradevski/la-sdk/dist/models/product';
import { Text, PickerBox, Flex } from '@sradevski/blocks-ui';
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
              <PickerBox size='small' value={value} type='color' />
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
    return <Text>{t('product.chooseAttributes')}</Text>;
  }

  return <Flex alignItems='center'>{values}</Flex>;
};

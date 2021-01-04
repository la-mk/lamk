import React from 'react';
import { Attributes } from '@la-mk/la-sdk/dist/models/product';
import { Text, Flex, PickerBox } from '@la-mk/blocks-ui';
import { TFunction } from 'i18next';

export const VariantName = ({
  attributes,
  shouldShowAttributes,
  t,
}: {
  attributes?: Attributes;
  shouldShowAttributes?: boolean;
  t: TFunction;
}) => {
  if (!shouldShowAttributes) {
    return null;
  }

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
    return <Text>{t('product.chooseAttributes')}</Text>;
  }

  return <Flex align='center'>{values}</Flex>;
};

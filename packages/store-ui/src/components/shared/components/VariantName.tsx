import React from 'react';
import { Attributes } from '@sradevski/la-sdk/dist/models/product';
import { PickerBox, Flex, Label } from '@sradevski/blocks-ui';
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
              {index > 0 && <Label mx={1}>·</Label>}
              <PickerBox size='mini' value={value} type='color' />
            </>
          );
        }

        default:
          return (
            <>
              {index > 0 && <Label mx={1}>·</Label>}
              {value}
            </>
          );
      }
    });

  if (!values.length) {
    return null;
  }

  return <Flex alignItems='center'>{values}</Flex>;
};

import React from 'react';
import { WidgetProps } from '@rjsf/core';
import styled from '@emotion/styled';
import { Box } from '../../Box';
import { Cascader } from '../../Cascader';

const CascaderStyles = styled(Box)``;

const CascaderWidget = ({ onChange, value, options }: WidgetProps) => {
  const { fullValue, cascadeOptions } = options;
  return (
    <CascaderStyles>
      <Cascader
        items={(cascadeOptions as any) || []}
        onChange={React.useCallback(
          val => {
            fullValue ? onChange(val[val.length - 1]) : onChange(val);
          },
          [fullValue]
        )}
        // The cascader expects a full array of all values, but we want to store only the last value, so we pass a custom value to the component
        value={fullValue ?? value}
      />
    </CascaderStyles>
  );
};

export default CascaderWidget;

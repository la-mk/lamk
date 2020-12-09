import React from 'react';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import { Box } from '../../Box';

// const cascaderFilter = (inputValue: string, path: any[]) => {
//   return path.some(
//     option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
//   );
// };

const CascaderStyles = styled(Box)``;

const CascaderWidget = ({}: /*onChange, value, options*/ WidgetProps) => {
  // const { fullValue, cascadeOptions } = options;
  return (
    <CascaderStyles>
      {/* <Cascader
        options={(cascadeOptions as any) || []}
        onChange={val => {
          fullValue ? onChange(val[val.length - 1]) : onChange(val);
        }}
        showSearch={{ filter: cascaderFilter }}
        // The cascader expects a full array of all values, but we want to store only the last value, so we pass a custom value to the component
        value={fullValue ?? value}
      /> */}
    </CascaderStyles>
  );
};

export default CascaderWidget;

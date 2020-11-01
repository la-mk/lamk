import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Cascader } from '../../Cascader';

const cascaderFilter = (inputValue: string, path: any[]) => {
  return path.some(
    option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
};

const CascaderWidget = ({ onChange, value, options }: WidgetProps) => {
  const { fullValue, cascadeOptions } = options;

  return (
    <Cascader
      width="100%"
      options={(cascadeOptions as any) || []}
      onChange={val => {
        fullValue ? onChange(val[value.length - 1]) : onChange(val);
      }}
      showSearch={{ filter: cascaderFilter }}
      // The cascader expects a full array of all values, but we want to store only the last value, so we pass a custom value to the component
      value={fullValue ?? value}
    />
  );
};

export default CascaderWidget;

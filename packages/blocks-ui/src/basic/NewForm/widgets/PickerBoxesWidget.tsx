import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { PickerBoxes } from '../../PickerBoxes';

const PickerBoxesWidget = ({ onChange, value, options }: WidgetProps) => {
  const { values, type, size } = options;

  return (
    <PickerBoxes
      values={(values as any) ?? []}
      type={type as any}
      size={size as any}
      onSelect={onChange}
      selected={value}
    />
  );
};

export default PickerBoxesWidget;

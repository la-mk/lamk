import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { PickerBoxes } from '../../PickerBoxes';

const PickerBoxesWidget = ({ onChange, value, options }: WidgetProps) => {
  const { values, variant, size } = options;

  return (
    <PickerBoxes
      values={(values as any) ?? []}
      variant={variant as any}
      size={size as any}
      onSelect={onChange}
      selected={value}
    />
  );
};

export default PickerBoxesWidget;

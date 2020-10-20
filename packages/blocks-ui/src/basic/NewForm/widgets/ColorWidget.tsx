import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { ColorPicker } from '../../ColorPicker';

const ColorPickerWidget = ({ onChange, value }: WidgetProps) => {
  return <ColorPicker onChange={onChange} value={value} />;
};

export default ColorPickerWidget;

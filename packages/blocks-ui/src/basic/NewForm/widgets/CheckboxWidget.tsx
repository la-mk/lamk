import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Checkbox } from '../../Checkbox';

const CheckboxWidget = ({
  autofocus,
  disabled,
  id,
  options,
  onChange,
  readonly,
  value,
}: WidgetProps) => {
  const { label } = options;

  return (
    <Checkbox
      autoFocus={autofocus}
      checked={typeof value === 'undefined' ? false : value}
      disabled={disabled || readonly}
      id={id}
      name={id}
      onChange={
        !readonly ? ({ target }: any) => onChange(target.checked) : undefined
      }
    >
      {label}
    </Checkbox>
  );
};

export default CheckboxWidget;

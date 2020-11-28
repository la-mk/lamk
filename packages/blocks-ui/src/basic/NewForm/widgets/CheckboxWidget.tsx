import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Checkbox } from '../../Checkbox';

const CheckboxWidget = ({
  // autofocus,
  disabled,
  id,
  options,
  onChange,
  onBlur,
  onFocus,
  readonly,
  value,
}: WidgetProps) => {
  const { label } = options;
  const handleBlur = ({ target }: any) => onBlur(id, target.value);
  const handleFocus = ({ target }: any) => onFocus(id, target.value);

  return (
    <Checkbox
      // autoFocus={autofocus}
      isChecked={typeof value === 'undefined' ? false : value}
      isDisabled={disabled}
      isReadOnly={readonly}
      id={id}
      name={id}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChange={
        !readonly ? ({ target }: any) => onChange(target.checked) : undefined
      }
    >
      {label}
    </Checkbox>
  );
};

export default CheckboxWidget;

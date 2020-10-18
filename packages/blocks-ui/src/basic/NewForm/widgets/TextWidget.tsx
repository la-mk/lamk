import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Input } from '../../Input';
import { InputNumber } from '../../InputNumber';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

const TextWidget = ({
  autofocus,
  disabled,
  id,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  readonly,
  schema,
  value,
}: WidgetProps) => {
  const { emphasized } = options;
  const handleNumberChange = (nextValue: any) => onChange(nextValue);

  const handleTextChange = ({ target }: any) =>
    onChange(target.value === '' ? options.emptyValue : target.value);

  const handleBlur = ({ target }: any) => onBlur(id, target.value);

  const handleFocus = ({ target }: any) => onFocus(id, target.value);
  const defaultProps = {
    autoFocus: autofocus,
    disabled: disabled || readonly,
    id: id,
    name: id,
    onBlur: !readonly ? handleBlur : undefined,
    onFocus: !readonly ? handleFocus : undefined,
    placeholder: placeholder,
    value: value,
    size: (emphasized ? 'large' : 'default') as SizeType,
  };

  return schema.type === 'number' || schema.type === 'integer' ? (
    <InputNumber
      {...defaultProps}
      onChange={!readonly ? handleNumberChange : undefined}
      type="number"
    />
  ) : (
    <Input
      {...defaultProps}
      type={(options.inputType as string) || 'text'}
      onChange={!readonly ? handleTextChange : undefined}
    />
  );
};

export default TextWidget;

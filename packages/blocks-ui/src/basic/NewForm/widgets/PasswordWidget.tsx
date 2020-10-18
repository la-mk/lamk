import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Password } from '../../Input';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

const PasswordWidget = ({
  autofocus,
  disabled,
  id,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  readonly,
  value,
}: WidgetProps) => {
  const { emphasized } = options;
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
    onChange: !readonly ? handleTextChange : undefined,
    placeholder: placeholder,
    value: value,
    size: (emphasized ? 'large' : 'default') as SizeType,
  };

  return <Password {...defaultProps} />;
};

export default PasswordWidget;

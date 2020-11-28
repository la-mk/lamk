import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Input } from '../../Input';

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
    isDisabled: disabled,
    isReadOnly: readonly,
    id: id,
    onBlur: !readonly ? handleBlur : undefined,
    onFocus: !readonly ? handleFocus : undefined,
    onChange: !readonly ? handleTextChange : undefined,
    placeholder: placeholder,
    value: value,
    size: emphasized ? 'lg' : ('md' as 'lg' | 'md'),
  };

  return <Input type="password" {...defaultProps} />;
};

export default PasswordWidget;

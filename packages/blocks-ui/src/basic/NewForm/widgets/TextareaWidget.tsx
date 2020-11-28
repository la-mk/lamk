import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Textarea } from '../../Textarea';

const TextareaWidget = ({
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
  const handleTextChange = ({ target }: any) =>
    onChange(target.value === '' ? options.emptyValue : target.value);

  const handleBlur = ({ target }: any) => onBlur(id, target.value);

  const handleFocus = ({ target }: any) => onFocus(id, target.value);
  const defaultProps = {
    autoFocus: autofocus,
    isDisabled: disabled,
    isReadOnly: readonly,
    id: id,
    name: id,
    rows: (options.rows || 6) as number,
    onBlur: !readonly ? handleBlur : undefined,
    onFocus: !readonly ? handleFocus : undefined,
    onChange: !readonly ? handleTextChange : undefined,
    placeholder: placeholder,
    value: value,
  };

  return <Textarea {...defaultProps} />;
};

export default TextareaWidget;

import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Input } from '../../Input';
import { InputNumber } from '../../InputNumber';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { isSchemaOfType } from '../utils';

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
  const { emphasized, suffix, prefix } = options;
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

  const numberFix = React.useMemo(
    () =>
      prefix || suffix
        ? {
            formatter: (value: string | number | undefined) => {
              if (!value) {
                return '';
              }
              return `${prefix ?? ''} ${value} ${suffix ?? ''}`.trim();
            },

            parser: (value: string | number | undefined) =>
              (value || '').toString().replace(/[^0-9.]/g, ''),
          }
        : {},
    [prefix, suffix]
  );

  return isSchemaOfType(schema, 'number') ||
    isSchemaOfType(schema, 'integer') ? (
    <InputNumber
      {...defaultProps}
      width="100%"
      onChange={!readonly ? handleNumberChange : undefined}
      decimalSeparator="."
      {...numberFix}
    />
  ) : (
    <Input
      {...defaultProps}
      width="100%"
      type={(options.inputType as string) || 'text'}
      onChange={!readonly ? handleTextChange : undefined}
      addonAfter={suffix}
      addonBefore={prefix}
    />
  );
};

export default TextWidget;

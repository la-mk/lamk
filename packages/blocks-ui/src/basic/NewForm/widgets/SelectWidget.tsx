import React from 'react';
import { WidgetProps, utils } from '@rjsf/core';
import { Select, Option } from '../../Select';
import { Spin } from '../../Spin';
import { isSchemaOfType } from '../utils';

const nums = new Set(['number', 'integer']);
const { asNumber, guessType } = utils;

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema: WidgetProps['schema'], value: any) => {
  if (value === '') {
    return undefined;
  } else if (
    isSchemaOfType(schema, 'array') &&
    schema.items &&
    nums.has((schema.items as any).type)
  ) {
    return value.map(asNumber);
  } else if (isSchemaOfType(schema, 'boolean')) {
    return value === 'true';
  } else if (isSchemaOfType(schema, 'number')) {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every((x: any) => guessType(x) === 'number')) {
      return asNumber(value);
    } else if (schema.enum.every((x: any) => guessType(x) === 'boolean')) {
      return value === 'true';
    }
  }

  return value;
};

const SelectWidget = ({
  autofocus,
  disabled,
  id,
  onBlur,
  onChange,
  onFocus,
  options,
  multiple,
  placeholder,
  readonly,
  value,
  schema,
  uiSchema,
}: WidgetProps) => {
  const { enumOptions, customEnumOptions, enumDisabled, emphasized } = options;
  const { mode, loading } = uiSchema?.['ui:options'] ?? {};

  const handleChange = (nextValue: any) =>
    onChange(processValue(schema, nextValue));

  const handleBlur = () => onBlur(id, processValue(schema, value));

  const handleFocus = () => onFocus(id, processValue(schema, value));

  const stringify = (currentValue: any) =>
    Array.isArray(currentValue) ? value.map(String) : String(value);

  return (
    <Select
      width="100%"
      autoFocus={autofocus}
      disabled={disabled || readonly}
      id={id}
      mode={typeof multiple !== 'undefined' ? 'multiple' : (mode as any)}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      value={typeof value !== 'undefined' ? stringify(value) : undefined}
      size={emphasized ? 'large' : undefined}
      notFoundContent={loading ? <Spin size="small" /> : undefined}
    >
      {((customEnumOptions ?? enumOptions) as any[])?.map(
        ({ value: optionValue, label: optionLabel }) => (
          <Option
            disabled={
              enumDisabled && (enumDisabled as any[])?.indexOf(value) !== -1
            }
            key={String(optionValue)}
            value={String(optionValue)}
          >
            {optionLabel}
          </Option>
        )
      )}
    </Select>
  );
};

export default SelectWidget;

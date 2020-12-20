import React from 'react';
import { WidgetProps, utils } from '@rjsf/core';
import { Select } from '../../Select';
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
  // multiple,
  placeholder,
  readonly,
  value,
  schema,
}: WidgetProps) => {
  const {
    enumOptions,
    customEnumOptions,
    // enumDisabled,
    emphasized,
    // mode,
    // loading,
  } = options;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onChange(processValue(schema, e.target.value));
  const handleBlur = () => onBlur(id, processValue(schema, value));
  const handleFocus = () => onFocus(id, processValue(schema, value));

  return (
    <Select
      isFullWidth
      autoFocus={autofocus}
      isDisabled={disabled || readonly}
      id={id}
      // mode={mode as any}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      // tokenSeparators={[',']}
      value={value}
      size={emphasized ? 'lg' : undefined}
      // isLoaded={!loading}
      options={customEnumOptions ?? (enumOptions as any)}
      // disabled={
      //   !!enumDisabled && (enumDisabled as any[])?.indexOf(value) !== -1
      // }
    />
  );
};

export default SelectWidget;

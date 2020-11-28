import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Input as AntInput } from 'antd';
import { Input } from '../../Input';
import { Select, Option } from '../../Select';
import { InputNumber } from '../../InputNumber';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { isSchemaOfType } from '../utils';

interface InputMode {
  id: string;
  previewSuffix: string;
  suffix: string;
  baseConverter: (val: number, id: string) => number;
  inputConverter: (val: number, id: string) => number;
  previewConverter: (val: number, id: string) => number;
  min?: number;
  max?: number;
}

const InputWithLenses = ({
  inputModes,
  onChange,
  value,
  ...props
}: {
  inputModes: InputMode[];
} & React.ComponentProps<typeof InputNumber>) => {
  const [selectedModeId, setSelectedModeId] = React.useState(
    inputModes?.[0]?.id
  );
  const selectedMode = inputModes?.find(mode => mode.id === selectedModeId);

  if (!selectedMode) {
    return null;
  }

  const selectedProps = {
    width: 'calc(100% - 210px)',
    suffix: selectedMode.suffix,
    min: selectedMode.min,
    max: selectedMode.max,
    onChange: (val: number) => {
      const baseValue = selectedMode.baseConverter(val, props.id);
      onChange?.(baseValue);
    },
    value: selectedMode.inputConverter(value, props.id),
  };

  const previewProps = {
    width: 120,
    disabled: true,
    value: selectedMode.previewConverter(value, props.id),
    suffix: selectedMode.previewSuffix,
  };

  return (
    <AntInput.Group compact style={{ width: '100%' }}>
      <InputNumber {...props} {...selectedProps} />
      <Select
        style={{ width: 90 }}
        onChange={val => setSelectedModeId(val)}
        value={selectedModeId}
      >
        {inputModes.map(mode => {
          return <Option value={mode.id}>{mode.suffix}</Option>;
        })}
      </Select>
      <InputNumber {...props} {...previewProps} />
    </AntInput.Group>
  );
};

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
  const { emphasized, suffix, prefix, numberInputModes } = options;
  const handleNumberChange = (nextValue: any) => onChange(nextValue);

  const handleTextChange = ({ target }: any) =>
    onChange(target.value === '' ? options.emptyValue : target.value);

  const handleBlur = ({ target }: any) => onBlur(id, target.value);

  const handleFocus = ({ target }: any) => onFocus(id, target.value);

  const defaultProps = {
    width: '100%',
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

  if (numberInputModes) {
    return (
      <InputWithLenses
        inputModes={numberInputModes as InputMode[]}
        onChange={!readonly ? handleNumberChange : undefined}
        decimalSeparator="."
        {...defaultProps}
      />
    );
  }

  return isSchemaOfType(schema, 'number') ||
    isSchemaOfType(schema, 'integer') ? (
    <InputNumber
      {...defaultProps}
      onChange={!readonly ? handleNumberChange : undefined}
      decimalSeparator="."
      suffix={suffix as string}
      prefix={prefix as string}
    />
  ) : (
    <Input
      {...defaultProps}
      isFullWidth={true}
      autoFocus={autofocus}
      isDisabled={disabled}
      isReadOnly={readonly}
      id={id}
      onBlur={!readonly ? handleBlur : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      onChange={!readonly ? handleTextChange : undefined}
      placeholder={placeholder}
      value={value}
      size={emphasized ? 'lg' : 'md'}
      type={(options.inputType as string) || 'text'}
      rightAddon={suffix}
      leftAddon={prefix}
    />
  );
};

export default TextWidget;

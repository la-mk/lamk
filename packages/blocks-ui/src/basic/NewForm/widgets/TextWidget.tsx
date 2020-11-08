import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Input, InputGroup } from '../../Input';
import { Select, Option } from '../../Select';
import { InputNumber } from '../../InputNumber';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { isSchemaOfType } from '../utils';

interface InputMode {
  id: string;
  previewSuffix: string;
  suffix: string;
  baseConverter: (val: number) => number;
  previewConverter: (val: number) => number;
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
      const baseValue = selectedMode.baseConverter(val);
      onChange?.(baseValue);
    },
    value,
  };

  const previewProps = {
    width: 120,
    disabled: true,
    value: selectedMode.previewConverter(value),
    suffix: selectedMode.previewSuffix,
  };

  return (
    <InputGroup compact width="100%">
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
    </InputGroup>
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
      type={(options.inputType as string) || 'text'}
      onChange={!readonly ? handleTextChange : undefined}
      addonAfter={suffix}
      addonBefore={prefix}
    />
  );
};

export default TextWidget;

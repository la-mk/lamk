import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Input as AntInput } from 'antd';
import { Input } from '../../Input';
import { NumberInput } from '../../NumberInput';
import { Select, Option } from '../../Select';
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
} & React.ComponentProps<typeof NumberInput>) => {
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
    onChange: (_valAsString: string, valAsNum: number) => {
      const baseValue = selectedMode.baseConverter(valAsNum, props.id!);
      onChange?.(baseValue?.toString(), baseValue);
    },
    value: selectedMode.inputConverter(value as any, props.id!),
  };

  const previewProps = {
    width: '120px',
    disabled: true,
    value: selectedMode.previewConverter(value as any, props.id!),
    suffix: selectedMode.previewSuffix,
  };

  return (
    <AntInput.Group compact style={{ width: '100%' }}>
      <NumberInput {...props} {...selectedProps} />
      <Select
        style={{ width: 90 }}
        onChange={val => setSelectedModeId(val)}
        value={selectedModeId}
      >
        {inputModes.map(mode => {
          return <Option value={mode.id}>{mode.suffix}</Option>;
        })}
      </Select>
      <NumberInput {...props} {...previewProps} />
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
  const handleNumberChange = (_nextAsString: string, nextAsNum: number) => {
    console.log(_nextAsString, nextAsNum, value);
    return onChange(nextAsNum);
  };

  const handleTextChange = ({ target }: any) =>
    onChange(target.value === '' ? options.emptyValue : target.value);

  const handleBlur = ({ target }: any) => onBlur(id, target.value);

  const handleFocus = ({ target }: any) => onFocus(id, target.value);

  const defaultProps = {
    isFullWidth: true,
    autoFocus: autofocus,
    isDisabled: disabled,
    isReadOnly: readonly,
    id: id,
    onBlur: !readonly ? handleBlur : undefined,
    onFocus: !readonly ? handleFocus : undefined,
    placeholder: placeholder,
    value: value,
    size: (emphasized ? 'lg' : 'md') as 'lg' | 'md',
  };

  if (numberInputModes) {
    return (
      <InputWithLenses
        inputModes={numberInputModes as InputMode[]}
        onChange={!readonly ? handleNumberChange : undefined}
        {...defaultProps}
      />
    );
  }

  return isSchemaOfType(schema, 'number') ||
    isSchemaOfType(schema, 'integer') ? (
    <NumberInput
      {...defaultProps}
      onChange={!readonly ? handleNumberChange : undefined}
      suffix={suffix as string}
      prefix={prefix as string}
    />
  ) : (
    <Input
      {...defaultProps}
      type={(options.inputType as string) || 'text'}
      onChange={!readonly ? handleTextChange : undefined}
      rightAddon={suffix}
      leftAddon={prefix}
    />
  );
};

export default TextWidget;

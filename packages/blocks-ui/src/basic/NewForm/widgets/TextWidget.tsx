import React from 'react';
import { WidgetProps } from '@rjsf/core';
import { Input } from '../../Input';
import { Flex } from '../../Flex';
import { Select } from '../../Select';
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
} & React.ComponentProps<typeof Input>) => {
  const [selectedModeId, setSelectedModeId] = React.useState(
    inputModes?.[0]?.id
  );
  const selectedMode = inputModes?.find((mode) => mode.id === selectedModeId);

  if (!selectedMode) {
    return null;
  }

  const change = React.useCallback(
    (_e: any, val?: string | number) => {
      const baseValue = selectedMode.baseConverter(val as number, props.id!);
      // @ts-ignore
      onChange?.(null, baseValue);
    },
    [selectedMode, onChange, props.id]
  );

  return (
    <Flex direction="row" align="center">
      <Input
        {...props}
        min={selectedMode.min}
        max={selectedMode.max}
        value={
          selectedMode.inputConverter(value as any, props.id!) ?? undefined
        }
        onChange={change}
        type="number"
        leftAddon={
          <Select
            width="70px"
            variant="flushed"
            onChange={(e) => setSelectedModeId(e.target.value)}
            value={selectedModeId}
            options={inputModes.map((mode) => ({
              label: mode.suffix,
              value: mode.id,
            }))}
          />
        }
        rightAddon={
          <div>
            {selectedMode.previewConverter(value as any, props.id!)}{' '}
            {selectedMode.previewSuffix}
          </div>
        }
      />
    </Flex>
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
  const handleNumberChange = React.useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, val?: string | number) => {
      return onChange(val);
    },
    [onChange]
  );

  const handleTextChange = React.useCallback(
    ({ target }: any) =>
      onChange(target.value === '' ? options.emptyValue : target.value),
    [onChange]
  );

  const type =
    isSchemaOfType(schema, 'number') || isSchemaOfType(schema, 'integer')
      ? 'number'
      : (options.inputType as string);

  const changeHandler =
    type === 'number' ? handleNumberChange : handleTextChange;

  const handleBlur = React.useCallback(
    ({ target }: any) => {
      if (target.value && type !== 'number') {
        onChange(
          target.value === '' ? options.emptyValue : target.value.trim()
        );
      }
      onBlur(id, target.value);
    },
    [type, onBlur]
  );

  const handleFocus = React.useCallback(
    ({ target }: any) => onFocus(id, target.value),
    [onFocus]
  );

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

  return (
    <Input
      {...defaultProps}
      type={type ?? 'text'}
      step={isSchemaOfType(schema, 'integer') ? 1 : undefined}
      onChange={!readonly ? changeHandler : undefined}
      rightAddon={suffix as any}
      leftAddon={prefix as any}
    />
  );
};

export default TextWidget;

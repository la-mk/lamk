import React from 'react';
import {
  Radio as ChakraRadio,
  RadioGroup as ChakraRadioGroup,
  RadioGroupProps,
  RadioProps as ChakraRadioProps,
  SpaceProps,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';
import { InputSize, RadioVariant } from '../../system';
import { Flex } from '../Flex';
import { Box } from '../Box';

export interface RadioProps
  extends Pick<
      ChakraRadioProps,
      // | 'autoFocus'
      | 'width'
      | 'isRequired'
      | 'isReadOnly'
      | 'isDisabled'
      | 'isInvalid'
      | 'id'
      | 'name'
    >,
    Pick<RadioGroupProps, 'onChange' | 'value' | 'onBlur' | 'onFocus'>,
    SpaceProps {
  variant?: RadioVariant;
  size?: InputSize;
  options: Array<{
    children: React.ReactNode;
    value: string | number;
  }>;
}

const ButtonRadio = ({
  isFirst,
  isLast,
  children,
  ...props
}: any & {
  isFirst?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        // @ts-ignore
        cursor="pointer"
        borderWidth="1px"
        borderTopLeftRadius={isFirst ? 'md' : undefined}
        borderBottomLeftRadius={isFirst ? 'md' : undefined}
        borderTopRightRadius={isLast ? 'md' : undefined}
        borderBottomRightRadius={isLast ? 'md' : undefined}
        borderColor="gray.200"
        _checked={{
          borderColor: 'primary.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        // TODO: Add size support and make it match with button
        px={3}
        py={1}
      >
        {children}
      </Box>
    </Box>
  );
};

const ButtonRadioGroup = ({
  options,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}: RadioProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value,
    onChange,
  });

  const group = getRootProps({
    onFocus,
    onBlur,
  });

  return (
    <Flex {...group}>
      {options.map((option, idx) => {
        const radio = getRadioProps({ value: option.value, ...(props as any) });
        return (
          <ButtonRadio
            key={option.value}
            isFirst={idx === 0}
            isLast={idx === options.length - 1}
            size={props.size}
            {...radio}
          >
            {option.children}
          </ButtonRadio>
        );
      })}
    </Flex>
  );
};

export const Radio = ({
  options,
  name,
  variant,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}: RadioProps) => {
  if (variant === 'button') {
    return (
      <ButtonRadioGroup
        options={options}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
    );
  }

  return (
    <ChakraRadioGroup
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {options.map((option, idx) => {
        return (
          <ChakraRadio
            {...props}
            ml={idx > 0 ? 4 : 0}
            key={option.value}
            value={option.value}
          >
            {option.children}
          </ChakraRadio>
        );
      })}
    </ChakraRadioGroup>
  );
};

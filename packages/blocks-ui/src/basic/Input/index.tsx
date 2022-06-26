import React, { useRef } from 'react';
import {
  Input as ChakraInput,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputProps as ChakraInputProps,
  SpaceProps,
  InputRightElement,
  NumberInputProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { Search as SearchIcon, Eye, EyeOff } from 'react-feather';
import { InputSize, InputVariant } from '../../system';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { Button } from '../Button';

export interface InputProps
  extends Pick<
      ChakraInputProps,
      | 'type'
      | 'placeholder'
      | 'value'
      | 'autoFocus'
      | 'width'
      | 'isRequired'
      | 'isReadOnly'
      | 'isDisabled'
      | 'isInvalid'
      | 'id'
      | 'name'
      | 'onBlur'
      | 'onFocus'
    >,
    Pick<NumberInputProps, 'max' | 'min' | 'precision' | 'step'>,
    SpaceProps {
  isFullWidth?: boolean;
  size?: InputSize;
  variant?: InputVariant;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  onSearch?: (value: string) => void;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value?: string | number
  ) => void;
}

const spaceProps = [
  'm',
  'mx',
  'my',
  'ml',
  'mr',
  'mt',
  'mb',
  'p',
  'px',
  'py',
  'pl',
  'pr',
  'pt',
  'pb',
];

interface InputTypeComponentProps {
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  groupProps: SpaceProps & { size?: InputSize };
  inputProps: Omit<InputProps, keyof SpaceProps | 'size'>;
}

const Password = ({
  leftAddon,
  rightAddon,
  groupProps,
  inputProps,
}: InputTypeComponentProps) => {
  const [show, setShow] = React.useState(false);
  const handleClick = React.useCallback(() => setShow(x => !x), [setShow]);

  return (
    <InputGroup {...groupProps}>
      {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}

      <ChakraInput
        {...inputProps}
        pr="4.5rem"
        type={show ? 'text' : 'password'}
      />
      <InputRightElement width="4.5rem">
        <Button
          aria-label="Show password"
          variant="ghost"
          size="sm"
          onClick={handleClick}
          leftIcon={show ? <EyeOff size="1.2rem" /> : <Eye size="1.2rem" />}
        />
      </InputRightElement>

      {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
    </InputGroup>
  );
};

const Search = ({
  onSearch,
  leftAddon,
  rightAddon,
  groupProps,
  inputProps,
}: InputTypeComponentProps & { onSearch?: (value: string) => void }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleOnSearch = () => {
    if (!onSearch) {
      return;
    }

    onSearch?.(inputRef.current?.value ?? (inputProps.value as string));
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOnSearch();
    }
  };

  return (
    <InputGroup {...groupProps}>
      {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}

      <ChakraInput
        {...inputProps}
        ref={inputRef}
        pr="4.5rem"
        type={'search'}
        onKeyUp={handleSearchSubmit}
      />
      <InputRightElement width="4.5rem">
        <Button
          aria-label="Search"
          variant="ghost"
          size="sm"
          onClick={handleOnSearch}
          leftIcon={<SearchIcon size="1.2rem" />}
        />
      </InputRightElement>

      {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
    </InputGroup>
  );
};

const Number = ({
  groupProps,
  inputProps,
  leftAddon,
  rightAddon,
}: InputTypeComponentProps) => {
  const [shownVal, setShownVal] = React.useState(
    inputProps.value?.toString() ?? ''
  );

  React.useEffect(() => {
    if (inputProps.value === parseFloat(shownVal)) {
      return;
    }

    setShownVal(inputProps.value?.toString() ?? '');
  }, [inputProps.value]);

  const onChange = inputProps.onChange;

  const parsedOnChange = React.useCallback(
    (val: string) => {
      let cleaned = (val || '').toString().replace(/[^0-9.]/g, '');
      if (cleaned.length === 0) {
        setShownVal('');
        // @ts-ignore
        return onChange?.(null, null);
      }

      setShownVal(cleaned);
      const parsed = parseFloat(cleaned);
      // @ts-ignore
      onChange?.(null, isNaN(parsed) ? 0 : parsed);
    },
    [onChange]
  );

  const leftRadius = leftAddon ? 0 : undefined;
  const rightRadius = rightAddon ? 0 : undefined;
  const borderProps = {
    borderTopLeftRadius: leftRadius,
    borderBottomLeftRadius: leftRadius,
    borderTopRightRadius: rightRadius,
    borderBottomRightRadius: rightRadius,
  };

  const input = (
    <ChakraNumberInput
      width="100%"
      {...inputProps}
      {...(leftAddon || rightAddon ? {} : groupProps)}
      // value={`${prefix ?? ''} ${value ?? ''} ${suffix ?? ''}`.trim()}
      value={shownVal}
      onChange={parsedOnChange}
    >
      <NumberInputField {...borderProps} />
      {!rightAddon && (
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      )}
    </ChakraNumberInput>
  );

  if (leftAddon || rightAddon) {
    return (
      <InputGroup {...groupProps}>
        {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
        {input}
        {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
      </InputGroup>
    );
  }

  return input;
};

export const Input = ({
  leftAddon,
  rightAddon,
  size,
  type,
  onSearch,
  min,
  max,
  step,
  precision,
  ...props
}: InputProps) => {
  if (
    type !== 'password' &&
    type !== 'search' &&
    type !== 'number' &&
    !leftAddon &&
    !rightAddon
  ) {
    return (
      <ChakraInput
        type={type}
        size={size}
        width={props.isFullWidth ? '100%' : undefined}
        {...props}
      />
    );
  }

  const spacing = pick(props, spaceProps);
  const propsWithoutSpacing = omit(props, spaceProps);

  if (type === 'password') {
    return (
      <Password
        leftAddon={leftAddon}
        rightAddon={rightAddon}
        groupProps={{ size, ...spacing }}
        inputProps={{ type, ...propsWithoutSpacing }}
      />
    );
  }

  if (type === 'search') {
    return (
      <Search
        onSearch={onSearch}
        leftAddon={leftAddon}
        rightAddon={rightAddon}
        groupProps={{ size, ...spacing }}
        inputProps={{ type, ...propsWithoutSpacing }}
      />
    );
  }

  if (type === 'number') {
    return (
      <Number
        leftAddon={leftAddon}
        rightAddon={rightAddon}
        groupProps={{ size, ...spacing }}
        inputProps={{ type, max, min, precision, step, ...propsWithoutSpacing }}
      />
    );
  }

  return (
    <InputGroup size={size} {...spacing}>
      {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
      <ChakraInput type={type} {...propsWithoutSpacing} />
      {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
    </InputGroup>
  );
};

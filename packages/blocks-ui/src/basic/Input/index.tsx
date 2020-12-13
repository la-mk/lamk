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
import {
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
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
      | 'isFullWidth'
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
          leftIcon={show ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
          leftIcon={<SearchOutlined />}
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
  const onChange = inputProps.onChange;

  const parsedOnChange = React.useCallback(
    (val: string) => {
      const cleaned = (val || '').toString().replace(/[^0-9.]/g, '');
      const resp = parseInt(cleaned);
      if (isNaN(resp)) {
        // @ts-ignore
        return onChange?.(null, undefined);
      }

      // @ts-ignore
      onChange?.(null, resp);
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

  const Wrapper = React.useMemo(
    () =>
      leftAddon || rightAddon
        ? ({ children }: any) => {
            return (
              <InputGroup {...groupProps}>
                {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
                {children}
                {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
              </InputGroup>
            );
          }
        : React.Fragment,
    [leftAddon, rightAddon]
  );

  return (
    <Wrapper>
      <ChakraNumberInput
        width="100%"
        {...inputProps}
        {...(leftAddon || rightAddon ? {} : groupProps)}
        // value={`${prefix ?? ''} ${value ?? ''} ${suffix ?? ''}`.trim()}
        value={inputProps.value as string | number}
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
    </Wrapper>
  );
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
    return <ChakraInput type={type} size={size} {...props} />;
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

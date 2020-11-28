import React, { useRef } from 'react';
import {
  Input as ChakraInput,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputProps as ChakraInputProps,
  SpaceProps,
  InputRightElement,
} from '@chakra-ui/react';
import {
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { InputVariant, Size } from '../../system';
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
      | 'onChange'
    >,
    SpaceProps {
  size?: Size;
  variant?: InputVariant;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  onSearch?: (value: string) => void;
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
  groupProps: SpaceProps & { size?: Size };
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
        >
          {show ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </Button>
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
        >
          <SearchOutlined />
        </Button>
      </InputRightElement>

      {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
    </InputGroup>
  );
};

export const Input = ({
  leftAddon,
  rightAddon,
  size,
  type,
  onSearch,
  ...props
}: InputProps) => {
  if (type !== 'password' && type !== 'search' && !leftAddon && !rightAddon) {
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

  return (
    <InputGroup size={size} {...spacing}>
      {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
      <ChakraInput type={type} {...propsWithoutSpacing} />
      {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
    </InputGroup>
  );
};

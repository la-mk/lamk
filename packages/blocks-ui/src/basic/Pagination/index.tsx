import React from 'react';
import { Button, ButtonProps, As, SpaceProps, HStack } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Size } from '../../system';
import hooks from '../../hooks';
import range from 'lodash/range';
import { Flex } from '../Flex';

const DOTS_JUMP_COUNT = 5;

interface PaginationButtonProps extends ButtonProps {
  isSelected?: boolean;
  children: React.ReactNode;
  totalPages: number;
}

const PaginationButton = ({
  isSelected,
  children,
  totalPages,
  variant,
  ...props
}: PaginationButtonProps) => {
  return (
    <Button
      variant={variant ?? 'outline'}
      colorScheme={isSelected ? 'primary' : 'gray'}
      px={1}
      {...props}
    >
      {/* This prevents the pagination size from jumping when the page turn two or three digits*/}
      <Flex
        align="center"
        justify="center"
        minWidth={`${Math.min(totalPages.toString().length, 3)}em`}
      >
        {children}
      </Flex>
    </Button>
  );
};

export interface PaginationProps extends SpaceProps {
  totalItems: number;
  currentPage: number;
  pageSize?: number;
  disabled?: boolean;
  onChange: (next: number, pageSize: number) => void;
  size?: Size;
  as?: As;
}

// TODO: Add a getHref function and open a PR to Chakra UI
export const Pagination = ({
  totalItems,
  currentPage,
  pageSize = 20,
  onChange,
  size,
  as,
  disabled,
  ...props
}: PaginationProps) => {
  const isMobile = hooks.useBreakpoint([true, false, false]);
  const totalPages = Math.ceil(totalItems / pageSize);
  const totalToShow = Math.min(totalPages, isMobile ? 5 : 7);
  const buttonProps = React.useMemo(() => ({ size, as, disabled }), [
    as,
    size,
    disabled,
  ]);

  const showLeftDots =
    totalPages > totalToShow && currentPage > Math.floor(totalToShow / 2);

  const showRightDots =
    totalPages > totalToShow &&
    currentPage < totalPages + 1 - Math.floor(totalToShow / 2);

  const buttonsToShow =
    totalToShow - (showLeftDots ? 1 : 0) - (showRightDots ? 1 : 0);

  const buttonsStartFrom = Math.min(
    Math.max(currentPage - Math.floor(buttonsToShow / 2), 1),
    totalPages - buttonsToShow + 1
  );

  const buttonsEndAt = buttonsStartFrom + buttonsToShow;

  return (
    <HStack wrap="wrap" spacing={2} {...props}>
      {!isMobile && (
        <PaginationButton
          totalPages={totalPages}
          onClick={() => onChange(currentPage - 1, pageSize)}
          {...buttonProps}
          disabled={currentPage <= 1 || buttonProps.disabled}
        >
          <ChevronLeft />
        </PaginationButton>
      )}

      {showLeftDots && (
        <>
          <PaginationButton
            totalPages={totalPages}
            onClick={() => onChange(1, pageSize)}
            {...buttonProps}
          >
            1
          </PaginationButton>
          <PaginationButton
            variant="ghost"
            totalPages={totalPages}
            onClick={() =>
              onChange(Math.max(currentPage - DOTS_JUMP_COUNT, 1), pageSize)
            }
            {...buttonProps}
          >
            ···
          </PaginationButton>
        </>
      )}

      {range(buttonsStartFrom, buttonsEndAt).map(i => (
        <PaginationButton
          key={i}
          totalPages={totalPages}
          onClick={() => onChange(i, pageSize)}
          isSelected={currentPage === i}
          {...buttonProps}
        >
          {i}
        </PaginationButton>
      ))}

      {showRightDots && (
        <>
          <PaginationButton
            variant="ghost"
            totalPages={totalPages}
            onClick={() =>
              onChange(
                Math.min(currentPage + DOTS_JUMP_COUNT, totalPages),
                pageSize
              )
            }
            {...buttonProps}
          >
            ···
          </PaginationButton>
          <PaginationButton
            totalPages={totalPages}
            onClick={() => onChange(totalPages, pageSize)}
            {...buttonProps}
          >
            {totalPages}
          </PaginationButton>
        </>
      )}

      {!isMobile && (
        <PaginationButton
          totalPages={totalPages}
          onClick={() => onChange(currentPage + 1, pageSize)}
          {...buttonProps}
          disabled={currentPage >= totalPages || buttonProps.disabled}
        >
          <ChevronRight />
        </PaginationButton>
      )}
    </HStack>
  );
};

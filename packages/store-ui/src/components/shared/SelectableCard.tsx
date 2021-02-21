import React from 'react';
import { CardProps, Positioner } from '@la-mk/blocks-ui';
import { Check } from 'react-feather';
import { withTheme } from 'styled-components';
import { CustomCard } from './components/CustomCard';

interface SelectableCardProps extends CardProps {
  onClick: () => void;
  isChecked: boolean;
  theme: any;
}

export const SelectableCard = withTheme(
  ({ isChecked, children, theme, ...props }: SelectableCardProps) => {
    return (
      <Positioner
        overlayContent={
          isChecked ? (
            <Check color={theme.colors.green['500']} size='1.4rem' />
          ) : null
        }
      >
        <CustomCard
          inverse={isChecked}
          // @ts-ignore
          style={{ cursor: 'pointer' }}
          {...props}
        >
          {children}
        </CustomCard>
      </Positioner>
    );
  },
);

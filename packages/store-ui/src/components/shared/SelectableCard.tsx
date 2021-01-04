import React from 'react';
import { CardProps, Positioner, Text } from '@la-mk/blocks-ui';
import { CheckCircleFilled } from '@ant-design/icons';
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
            <CheckCircleFilled
              style={{
                color: theme.colors.primary['500'],
                fontSize: 20,
              }}
            />
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

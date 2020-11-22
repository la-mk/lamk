import React from 'react';
import { Badge } from '@sradevski/blocks-ui';
import { CheckCircleFilled } from '@ant-design/icons';
import { CardProps } from 'antd/lib/card';
import { SystemProps } from '@sradevski/blocks-ui/dist/system';
import { withTheme } from 'styled-components';
import { CustomCard } from './components/CustomCard';

interface SelectableCardProps extends CardProps, Omit<SystemProps, 'color'> {
  isChecked: boolean;
  theme: any;
}

export const SelectableCard = withTheme(
  ({ isChecked, children, theme, ...props }: SelectableCardProps) => {
    return (
      <Badge
        width='100%'
        style={{ backgroundColor: 'transparent' }}
        count={
          isChecked ? (
            <CheckCircleFilled
              style={{
                color: theme.colors.primary,
                fontSize: 20,
              }}
            />
          ) : undefined
        }
      >
        <CustomCard
          inverse={isChecked}
          style={{ cursor: 'pointer' }}
          {...props}
        >
          {children}
        </CustomCard>
      </Badge>
    );
  },
);

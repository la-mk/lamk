import React from 'react';
import { Badge, Card } from '@sradevski/blocks-ui';
import { CheckCircleFilled } from '@ant-design/icons';
import { CardProps } from 'antd/lib/card';
import { SystemProps } from '@sradevski/blocks-ui/dist/system';
import { withTheme } from 'styled-components';

interface SelectableCardProps extends CardProps, Omit<SystemProps, 'color'> {
  isChecked: boolean;
  theme: any;
}

export const SelectableCard = withTheme(
  ({ isChecked, children, theme, ...props }: SelectableCardProps) => {
    return (
      <Badge
        style={{ backgroundColor: 'white' }}
        count={
          isChecked ? (
            <CheckCircleFilled
              style={{ color: theme.colors.primary, fontSize: 20 }}
            />
          ) : (
            undefined
          )
        }
      >
        <Card
          style={
            isChecked
              ? {
                  border: `2px solid ${theme.colors.primary}`,
                  transition: 'border 200ms',
                }
              : { transition: 'border 200ms' }
          }
          hoverable={true}
          {...props}
        >
          {children}
        </Card>
      </Badge>
    );
  },
);

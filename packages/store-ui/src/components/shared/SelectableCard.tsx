import React from 'react';
import { Badge, Card, Icon } from '@sradevski/blocks-ui';
import { CardProps } from 'antd/lib/card';
import { SystemProps } from '@sradevski/blocks-ui/dist/system';

interface SelectableCardProps extends CardProps, SystemProps {
  isChecked: boolean;
}

export const SelectableCard = ({
  isChecked,
  children,
  ...props
}: SelectableCardProps) => {
  return (
    <Badge
      style={{ backgroundColor: 'white' }}
      count={
        isChecked ? (
          <Icon
            style={{ color: '#1890ff', fontSize: 20 }}
            type='check-circle'
            theme='filled'
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
                border: '2px solid #1890ff',
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
};

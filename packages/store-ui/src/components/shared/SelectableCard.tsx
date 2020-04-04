import React from 'react';
import { Badge, Card } from '@sradevski/blocks-ui';
import { CheckCircleFilled } from '@ant-design/icons';
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
          <CheckCircleFilled style={{ color: '#1890ff', fontSize: 20 }} />
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

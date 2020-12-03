import React from 'react';
import { Box, Card, Flex, Title } from '@sradevski/blocks-ui';

export const CustomCard = ({
  title,
  children,
  headerAction,
  inverse,
  ...props
}: React.ComponentProps<typeof Card> & {
  title?: string;
  headerAction?: any;
  inverse?: boolean;
}) => {
  return (
    <Card
      // @ts-ignore
      border='none'
      bg={inverse ? 'background.dark' : 'background.light'}
      {...props}
    >
      {title && (
        <Flex
          bg={inverse ? 'background.light' : 'background.dark'}
          py={[2, 3, 3]}
          px={[3, 4, 4]}
          align='center'
          justify='space-between'
        >
          <Title
            color={inverse ? 'heading.dark' : 'heading.light'}
            m={0}
            fontSize={2}
            level={3}
          >
            {title}
          </Title>
          {!!headerAction && headerAction}
        </Flex>
      )}

      <Box p={4}>{children}</Box>
    </Card>
  );
};

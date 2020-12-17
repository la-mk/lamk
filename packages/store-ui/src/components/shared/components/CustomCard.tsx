import React from 'react';
import { Box, Card, Flex, Heading } from '@sradevski/blocks-ui';

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
          my={[1, 2, 2]}
          mb={[2, 3, 4]}
          px={[0, 3, 4]}
          align='center'
          justify='space-between'
        >
          <Heading
            color={inverse ? 'heading.light' : 'heading.dark'}
            size='lg'
            as='h3'
          >
            {title}
          </Heading>
          {!!headerAction && headerAction}
        </Flex>
      )}

      <Box px={[0, 3, 4]}>{children}</Box>
    </Card>
  );
};

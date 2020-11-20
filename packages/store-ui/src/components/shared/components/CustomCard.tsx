import React from 'react';
import { Box, Flex, Label } from '@sradevski/blocks-ui';
import styled from 'styled-components';

const Card = styled(Box)`
  border-radius: ${props => props.theme.radii[1]}px;
  overflow: hidden;
  z-index: 1;
`;

export const CustomCard = ({
  title,
  children,
  headerAction,
  inverse,
  ...props
}: React.ComponentProps<typeof Box>) => {
  return (
    <Card bg={inverse ? 'background.dark' : 'background.light'} {...props}>
      {title && (
        <Flex
          bg={inverse ? 'background.light' : 'background.dark'}
          py={[2, 3, 3]}
          px={[3, 4, 4]}
          alignItems='center'
          justifyContent='space-between'
        >
          <Label color={inverse ? 'contentPrimary' : 'contentInversePrimary'}>
            {title}
          </Label>
          {!!headerAction && headerAction}
        </Flex>
      )}

      <Box p={4}>{children}</Box>
    </Card>
  );
};

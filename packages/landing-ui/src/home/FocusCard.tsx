import React from 'react';
import {
  Card,
  Flex,
  Image,
  Title,
  Text,
  Button,
  Box,
} from '@sradevski/blocks-ui';

export const FocusCard = ({ icon, title, description, ...props }: any) => {
  return (
    <Card
      {...props}
      bg={'primary'}
      width={['90%', '75%', '65%', '65%']}
      maxWidth={920}
      mx='auto'
    >
      <Flex
        justifyContent='space-between'
        alignItems='center'
        flexDirection={['column', 'row', 'row']}
        style={{ position: 'relative' }}
        p={[2, 3, 4]}
        pr={[0, '15%', '15%']}
      >
        <Box mb={[5, 0, 0]} mr={[0, 4, 4]} maxWidth={350}>
          <Image src={icon} />
          <Title mt={2} color='white' level={4}>
            {title}
          </Title>
          <Text color='white' fontSize={18}>
            {description}
          </Text>
        </Box>
        <Button size='large' onClick={() => null}>
          Start now
        </Button>

        <Box style={{ position: 'absolute', bottom: -60, right: -40 }}>
          <Image src='/radiating-dots.svg' />
        </Box>
      </Flex>
    </Card>
  );
};

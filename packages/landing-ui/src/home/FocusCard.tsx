import React from 'react';
import { Flex, Image, Title, Text, Button, Box } from '@sradevski/blocks-ui';

type FocusCardProps = {
  icon: string;
  title: string;
  description: string;
} & React.ComponentProps<typeof Box>;

export const FocusCard = ({
  icon,
  title,
  description,
  ...props
}: FocusCardProps) => {
  return (
    <Box
      {...props}
      bg={'primary'}
      width={['90%', '75%', '65%', '65%']}
      maxWidth={920}
      borderRadius={0}
      p={4}
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
          <Image src={icon} alt='Example logo' />
          <Title mt={2} color='text.light' level={4}>
            {title}
          </Title>
          <Text color='text.light' fontSize={1}>
            {description}
          </Text>
        </Box>
        <Button style={{ zIndex: 2 }} size='large' href='https://admin.la.mk'>
          Start now
        </Button>

        <Box style={{ position: 'absolute', bottom: -60, right: -40 }}>
          <Image src='/radiating-dots.svg' alt='dots decoration' />
        </Box>
      </Flex>
    </Box>
  );
};

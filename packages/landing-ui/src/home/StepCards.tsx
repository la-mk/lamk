import React from 'react';
import { Flex, Card, Image, Title, Text } from '@sradevski/blocks-ui';

const StepCard = ({ icon, title, subtitle, ...props }) => {
  return (
    <Card {...props} bg={'quaternary'} width={[260, 300, 320]} height={330}>
      <Flex justifyContent='center' alignItems='center' flexDirection='column'>
        <Image m={3} src={icon} />
        <Title textAlign='center' level={4} fontSize={[3, 4, 4]}>
          {title}
        </Title>
        <Text color='secondary' fontSize={[2, 18, 18]} textAlign='center'>
          {subtitle}
        </Text>
      </Flex>
    </Card>
  );
};

export const StepCards = () => {
  return (
    <Flex
      mt={[-40, -120, -200]}
      flexDirection={['column', 'column', 'row']}
      alignItems='center'
      justifyContent='center'
    >
      <StepCard
        mr={[0, 0, 5]}
        icon='/pencil-create.svg'
        title='Create your store'
        subtitle="Sign up, tell us your store name, add your logo, 
        and you're ready to go"
      />
      <StepCard
        my={[4, 4, 0]}
        icon='/product-box.svg'
        title='Add your products'
        subtitle='We have no limits, so add as many as you want'
      />
      <StepCard
        ml={[0, 0, 5]}
        icon='/start-rocket.svg'
        title='Start selling'
        subtitle='Add your preferred delivery and payment methods, and start selling'
      />
    </Flex>
  );
};

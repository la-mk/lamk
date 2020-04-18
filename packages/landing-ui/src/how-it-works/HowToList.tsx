import React from 'react';
import { Box, Title, Text } from '@sradevski/blocks-ui';
import styled from 'styled-components';

const HowToOrderedList = styled.ol`
  list-style: none;
  counter-reset: my-awesome-counter;
  margin: 0;
  padding: 0;
  & > li {
    counter-increment: my-awesome-counter;
    display: flex;
    margin-top: 80px;

    :first-child {
      margin-top: 0;
    }
  }

  & > li:before {
    content: counter(my-awesome-counter) ' ';
    color: ${(props) => props.theme.colors.primary};
    font-weight: bold;
    font-size: 132px;
    line-height: 0.8;
    margin-right: 16px;
  }
`;

const Step = ({ title, children }) => {
  return (
    <Box>
      <Box mb={3} bg='secondary'>
        <Text>{title}</Text>
      </Box>
      {children}
    </Box>
  );
};

const HowToItem = ({ title, description }) => {
  return (
    <li>
      <Box>
        <Title level={4}>{title}</Title>
        <Text mt={3}>{description}</Text>
        <Step title={'test'}>Hi</Step>
      </Box>
    </li>
  );
};

export const HowToList = () => {
  return (
    <Box mx={'auto'} px={[3, 5, 6]} maxWidth={1280}>
      <HowToOrderedList>
        <HowToItem
          title='Create a store'
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque atque dicta quibusdam dignissimos culpa ullam dolore iusto maxime eius ducimus. Soluta distinctio, ipsum ullam fugiat quas reprehenderit perspiciatis adipisci vel.'
          }
        />

        <HowToItem
          title='Add products to your store'
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque atque dicta quibusdam dignissimos culpa ullam dolore iusto maxime eius ducimus. Soluta distinctio, ipsum ullam fugiat quas reprehenderit perspiciatis adipisci vel.'
          }
        />

        <HowToItem
          title='Specify your delivery and payment preferences'
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque atque dicta quibusdam dignissimos culpa ullam dolore iusto maxime eius ducimus. Soluta distinctio, ipsum ullam fugiat quas reprehenderit perspiciatis adipisci vel.'
          }
        />

        <HowToItem
          title='Manage orders, create discount campaigns, and more...'
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque atque dicta quibusdam dignissimos culpa ullam dolore iusto maxime eius ducimus. Soluta distinctio, ipsum ullam fugiat quas reprehenderit perspiciatis adipisci vel.'
          }
        />
      </HowToOrderedList>
    </Box>
  );
};

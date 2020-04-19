import React from 'react';
import {
  Box,
  Title,
  Text,
  Flex,
  Image,
  Button,
  Paragraph,
} from '@sradevski/blocks-ui';
import styled from 'styled-components';

const HowToOrderedList = styled.ol`
  list-style: none;
  counter-reset: my-awesome-counter;
  margin: 0;
  padding: 0;
  & > li {
    counter-increment: my-awesome-counter;
    display: flex;
    margin-top: 100px;

    :first-child {
      margin-top: 0;
    }
  }

  & > li:before {
    z-index: 2;
    content: counter(my-awesome-counter) ' ';
    color: ${(props) => props.theme.colors.primary};
    font-weight: bold;
    font-size: 132px;
    line-height: 0.8;
    margin-right: 16px;

    @media screen and (max-width: 1128px) {
      font-size: 90px;
    }

    @media screen and (max-width: 788px) {
      font-size: 60px;
    }
  }
`;

const ColorCircle = ({ color }) => {
  return (
    <svg
      width='10'
      height='10'
      viewBox='0 0 10 10'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='5' cy='5' r='5' fill={color} />
    </svg>
  );
};

const Step = ({ title, children }) => {
  return (
    <Box
      style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', zIndex: 1 }}
      width='160px'
      bg='lightBackground'
    >
      <Flex bg='tertiary' p={1} alignItems='center' justifyContent='center'>
        <Text>{title}</Text>
      </Flex>
      <Box height='150px' p={3}>
        {children}
      </Box>
    </Box>
  );
};

const StepEntry = ({ children, ...props }) => {
  return (
    <Flex
      width='100%'
      flexDirection='row'
      alignItems='center'
      justifyContent='center'
      p={1}
      bg='white'
      {...props}
    >
      {children}
    </Flex>
  );
};

const StepSuccess = () => {
  return (
    <Flex
      height='100%'
      width='100%'
      alignItems='center'
      justifyContent='center'
    >
      <Image src='/step-success.svg' />
    </Flex>
  );
};

const HowToItem = ({ title, description, children }) => {
  return (
    <li>
      <Box width='85%' maxWidth={860} style={{ zIndex: 2 }}>
        <Title mb={4} level={4}>
          {title}
        </Title>
        <Paragraph ml={['-60px', 0, 0]} px={3}>
          {description}
        </Paragraph>
        <Box ml={['-60px', 0, 0]} py={2} mt={5} style={{ overflowX: 'auto' }}>
          <Flex
            minWidth='860px'
            px={3}
            justifyContent='space-between'
            style={{ position: 'relative' }}
          >
            <Image
              style={{
                position: 'absolute',
                left: 30,
                top: '40%',
                zIndex: 0,
                margin: '0 8px',
                width: '90%',
              }}
              src='/steps-connector.svg'
            />
            {children}
          </Flex>
        </Box>
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
        >
          <Step title={'Store name'}>
            <StepEntry>Cactus shop</StepEntry>
          </Step>
          <Step title={'Store URL'}>
            <StepEntry>
              cactus
              <Text strong color='primary'>
                .la.mk
              </Text>
            </StepEntry>
          </Step>
          <Step title={'Store logo'}>
            <StepEntry>
              <Image src='/cactus-logo.svg' />
            </StepEntry>

            <Button
              style={{ fontSize: 14 }}
              type='primary'
              mt={4}
              size='small'
              width='100%'
            >
              Create
            </Button>
          </Step>
          <Step title={'Success'}>
            <StepSuccess />
          </Step>
        </HowToItem>

        <HowToItem
          title='Add products to your store'
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque atque dicta quibusdam dignissimos culpa ullam dolore iusto maxime eius ducimus. Soluta distinctio, ipsum ullam fugiat quas reprehenderit perspiciatis adipisci vel.'
          }
        >
          <Step title={'Product name'}>
            <StepEntry>Cactus shop</StepEntry>
          </Step>
          <Step title={'Product image'}>
            <StepEntry>
              <Image src='/cactus-1.svg' />
            </StepEntry>
          </Step>
          <Step title={'Product description'}>
            <StepEntry>
              <Text textAlign='center'>Happy green cactus</Text>
            </StepEntry>
          </Step>
          <Step title={'Product price'}>
            <StepEntry>400 MKD</StepEntry>
            <Button
              style={{ fontSize: 14 }}
              type='primary'
              mt={5}
              size='small'
              width='100%'
            >
              Add to store
            </Button>
          </Step>
        </HowToItem>

        <HowToItem
          title='Specify your delivery and payment preferences'
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque atque dicta quibusdam dignissimos culpa ullam dolore iusto maxime eius ducimus. Soluta distinctio, ipsum ullam fugiat quas reprehenderit perspiciatis adipisci vel.'
          }
        >
          <Step title={'Delivery method'}>
            <StepEntry>
              <Text textAlign='center'>Door to door delivery</Text>
            </StepEntry>
          </Step>
          <Step title={'Delivery fee'}>
            <StepEntry>100 MKD</StepEntry>
            <Box mt={3}>
              <Text type='secondary'>Free over:</Text>
              <StepEntry>1200 MKD</StepEntry>
            </Box>
          </Step>
          <Step title={'Payment options'}>
            <Flex
              width='100%'
              mb={2}
              alignItems='center'
              justifyContent='center'
            >
              <Image mr={2} src='/checkbox.svg' />
              <StepEntry>Credit card</StepEntry>
            </Flex>
            <Flex width='100%' alignItems='center' justifyContent='center'>
              <Image mr={2} src='/checkbox.svg' />
              <StepEntry>On delivery</StepEntry>
            </Flex>

            <Button
              style={{ fontSize: 14 }}
              type='primary'
              mt={3}
              size='small'
              width='100%'
            >
              Start selling
            </Button>
          </Step>
          <Step title={'Success'}>
            <StepSuccess />
          </Step>
        </HowToItem>

        <HowToItem
          title='Manage orders'
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque atque dicta quibusdam dignissimos culpa ullam dolore iusto maxime eius ducimus. Soluta distinctio, ipsum ullam fugiat quas reprehenderit perspiciatis adipisci vel.'
          }
        >
          <Step title={'My orders'}>
            <StepEntry>
              <ColorCircle color='#F6376D' />
              <Text ml={2}>1 New Order</Text>
            </StepEntry>
            <StepEntry mt={2}>
              <ColorCircle color='#27AE60' />
              <Text ml={2}>2 Complete</Text>
            </StepEntry>
            <StepEntry mt={2}>
              <ColorCircle color='#F1C40F' />
              <Text ml={2}>1 Preparing</Text>
            </StepEntry>
          </Step>
          <Step title={'Order details'}>
            <StepEntry>1 Green Cactus</StepEntry>
            <StepEntry mt={2}>2 Happy Cacti</StepEntry>
          </Step>
          <Step title={'Buyer details'}>
            <StepEntry>Kara Snow</StepEntry>
            <StepEntry mt={2}>57 Theatre St.</StepEntry>
            <StepEntry mt={2}>Skopje, MK</StepEntry>
          </Step>

          <Step title={'Send order'}>
            <Flex
              width='100%'
              height='100%'
              alignItems='center'
              justifyContent='center'
            >
              <Image src='/package-truck.svg' />
            </Flex>
          </Step>
        </HowToItem>

        <HowToItem
          title='Create discount campaigns, and more...'
          description={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque atque dicta quibusdam dignissimos culpa ullam dolore iusto maxime eius ducimus. Soluta distinctio, ipsum ullam fugiat quas reprehenderit perspiciatis adipisci vel.'
          }
        >
          <Step title={'Campaign name'}>
            <StepEntry>Summer sale</StepEntry>
          </Step>
          <Step title={'Product groups'}>
            <StepEntry>Green Cacti</StepEntry>
            <StepEntry>Spiky Cacti</StepEntry>
            <StepEntry>Baby Cacti</StepEntry>
          </Step>
          <Step title={'Reward'}>
            <StepEntry>30 %</StepEntry>
          </Step>
          <Step title={'Promote'}>
            <Flex>
              <Image mr={2} src='/checkbox.svg' />
              <StepEntry>
                <Box width='100%'>
                  <Text display='block'>promote</Text>
                  <Text display='block' fontSize={10}>
                    show banner
                  </Text>
                </Box>
              </StepEntry>
            </Flex>

            <Button
              style={{ fontSize: 14 }}
              type='primary'
              mt={4}
              size='small'
              width='100%'
            >
              Activate
            </Button>
          </Step>
        </HowToItem>
      </HowToOrderedList>
    </Box>
  );
};

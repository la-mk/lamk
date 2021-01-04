import React from 'react';
import { Box, Heading, Flex, Image, Text } from '@la-mk/blocks-ui';
import styled from 'styled-components';
import { useTranslation } from '../common/i18n';
import { Card } from '../common/Card';

const FakeButton = styled(Box)`
  border-radius: 4px;
  background-color: ${props => props.theme.colors.primary['500']};
  padding: 4px;
  color: white;
  text-align: center;
`;

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
    color: ${props => props.theme.colors.primary['500']};
    font-weight: 500;
    font-size: 124px;
    line-height: 0.8;
    margin-right: 16px;

    @media screen and (max-width: ${props => props.theme.breakpoints.md}) {
      font-size: 90px;
    }

    @media screen and (max-width: ${props => props.theme.breakpoints.sm}) {
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
    <Card width='12rem' bg='background.light'>
      <Flex bg='secondary' p={2} py={2} align='center' justify='center'>
        <Text color='text.light'>{title}</Text>
      </Flex>
      <Box height='160px' p={4}>
        {children}
      </Box>
    </Card>
  );
};

const StepEntry = ({ children, ...props }) => {
  return (
    <Flex
      width='100%'
      direction='row'
      align='center'
      justify='center'
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
    <Flex height='100%' width='100%' p={3} align='center' justify='center'>
      <Image src='/step-success.svg' alt='success step illustration' />
    </Flex>
  );
};

const HowToItem = ({ title, description, children }) => {
  return (
    <li>
      {/* @ts-ignore */}
      <Box width='85%' maxWidth={'60rem'} style={{ zIndex: 2 }}>
        <Heading mb={5} as='h3'>
          {title}
        </Heading>
        <Text as='p' ml={['-3rem', 0, 0]} px={3}>
          {description}
        </Text>
        {/* @ts-ignore */}
        <Box ml={['-3rem', 0, 0]} py={2} mt={5} style={{ overflowX: 'auto' }}>
          <Flex
            minWidth={'60rem'}
            width='90%'
            px={4}
            my={2}
            bg='#fff'
            justify='space-between'
            // @ts-ignore
            style={{ position: 'relative' }}
          >
            <Image
              style={{
                position: 'absolute',
                left: '30px',
                top: '40%',
                zIndex: 0,
              }}
              src='/steps-connector.svg'
              alt='steps connector illustration'
            />
            {children}
          </Flex>
        </Box>
      </Box>
    </li>
  );
};

export const HowToList = () => {
  const { t } = useTranslation();

  return (
    <Box mx={'auto'} px={[3, 5, 6]} maxWidth={'76rem'}>
      <HowToOrderedList>
        <HowToItem
          title={t('howItWorks.listCreateStore')}
          description={t('howItWorks.listCreateStoreDetails')}
        >
          <Step title={t('howItWorks.storeName')}>
            <StepEntry>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleStoreName')}
              </Text>
            </StepEntry>
          </Step>

          <Step title={t('howItWorks.storeUrl')}>
            <StepEntry>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleStoreUrl')}
              </Text>
              <Text as='strong' color='primary.500'>
                .la.mk
              </Text>
            </StepEntry>
          </Step>

          <Step title={t('howItWorks.storeLogo')}>
            <StepEntry>
              <Box p={2}>
                <Image src='/cactus-logo.svg' alt='example logo - cactus' />
              </Box>
            </StepEntry>

            <FakeButton mt={4} width='100%'>
              {t('actions.create')}
            </FakeButton>
          </Step>
          <Step title={t('common.success')}>
            <StepSuccess />
          </Step>
        </HowToItem>

        <HowToItem
          title={t('howItWorks.listAddProducts')}
          description={t('howItWorks.listAddProductsDetails')}
        >
          <Step title={t('howItWorks.productName')}>
            <StepEntry>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleProductName')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.productImage')}>
            <StepEntry>
              <Box p={2}>
                <Image src='/cactus-1.svg' alt='cactus illustration' />
              </Box>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.productDescription')}>
            <StepEntry>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleProductDescription')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.productPrice')}>
            <StepEntry>
              <Text color='mutedText.dark' align='center'>
                400 MKD
              </Text>
            </StepEntry>
            <FakeButton mt={5} width='100%'>
              {t('actions.addToStore')}
            </FakeButton>
          </Step>
        </HowToItem>

        <HowToItem
          title={t('howItWorks.listDeliveryPaymentPreferences')}
          description={t('howItWorks.listDeliveryPaymentPreferencesDetails')}
        >
          <Step title={t('howItWorks.deliveryMethod')}>
            <StepEntry>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleDeliveryMethod')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.deliveryFee')}>
            <StepEntry>
              <Text color='mutedText.dark' align='center'>
                100 MKD
              </Text>
            </StepEntry>
            <Box mt={3}>
              <Text color='text.dark'>
                {t('howItWorks.sampleFreeOverDelivery')}:
              </Text>
              <StepEntry>
                <Text color='mutedText.dark' align='center'>
                  1200 MKD
                </Text>
              </StepEntry>
            </Box>
          </Step>
          <Step title={t('howItWorks.paymentOptions')}>
            <Flex width='100%' mb={2} align='center' justify='center'>
              <Box mr={2}>
                <Image src='/checkbox.svg' alt='checkbox illustration' />
              </Box>
              <StepEntry>
                <Text color='mutedText.dark' align='center'>
                  {t('howItWorks.samplePaymentCreditCard')}
                </Text>
              </StepEntry>
            </Flex>
            <Flex width='100%' align='center' justify='center'>
              <Box mr={2}>
                <Image src='/checkbox.svg' alt='checkbox illustration' />
              </Box>
              <StepEntry>
                <Text color='mutedText.dark' align='center'>
                  {t('howItWorks.samplePaymentOnDelivery')}
                </Text>
              </StepEntry>
            </Flex>

            <FakeButton mt={3} width='100%'>
              {t('actions.save')}
            </FakeButton>
          </Step>
          <Step title={t('common.success')}>
            <StepSuccess />
          </Step>
        </HowToItem>

        <HowToItem
          title={t('howItWorks.listOrders')}
          description={t('howItWorks.listOrdersDetails')}
        >
          <Step title={t('howItWorks.myOrders')}>
            <StepEntry justify='flex-start'>
              <ColorCircle color='#EF4351' />
              <Text color='mutedText.dark' ml={2}>
                1 {t('howItWorks.sampleNewOrder')}
              </Text>
            </StepEntry>
            <StepEntry justify='flex-start' mt={2}>
              <ColorCircle color='#27AE60' />
              <Text color='mutedText.dark' ml={2}>
                2 {t('howItWorks.sampleCompletedOrder')}
              </Text>
            </StepEntry>
            <StepEntry justify='flex-start' mt={2}>
              <ColorCircle color='#F1C40F' />
              <Text color='mutedText.dark' ml={2}>
                1 {t('howItWorks.samplePreparingOrder')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.orderDetails')}>
            <StepEntry justify='flex-start'>
              <Text color='mutedText.dark' align='center'>
                1 {t('howItWorks.sampleProductName')}
              </Text>
            </StepEntry>
            <StepEntry justify='flex-start' mt={2}>
              <Text color='mutedText.dark' align='center'>
                2 {t('howItWorks.sampleProductName2_plural')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.buyerDetails')}>
            <StepEntry>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleAddressRecepient')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleAddressStreet')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleAddressCityCountry')}
              </Text>
            </StepEntry>
          </Step>

          <Step title={t('howItWorks.sendOrder')}>
            <Flex
              width='100%'
              height='100%'
              p={3}
              align='center'
              justify='center'
            >
              <Image
                src='/package-truck.svg'
                alt='packages truck illustration'
              />
            </Flex>
          </Step>
        </HowToItem>

        <HowToItem
          title={t('howItWorks.listDiscountCampaigns')}
          description={t('howItWorks.listDiscountCampaignsDetails')}
        >
          <Step title={t('howItWorks.campaignName')}>
            <StepEntry>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleCampaignName')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.productGroups')}>
            <StepEntry>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleProductGroup')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleProductGroup2')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <Text color='mutedText.dark' align='center'>
                {t('howItWorks.sampleProductGroup3')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.campaignReward')}>
            <StepEntry>
              <Text width='100%' color='mutedText.dark' align='center'>
                30%
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.campaignPromote')}>
            <Flex>
              <Box mr={2}>
                <Image src='/checkbox.svg' alt='checkbox illustration' />
              </Box>
              <StepEntry>
                <Box width='100%'>
                  <Text align='center' display='block'>
                    {t('actions.promote').toLowerCase()}
                  </Text>
                  <Text
                    display='block'
                    size='xs'
                    color='mutedText.dark'
                    align='center'
                  >
                    {t('actions.showBanner').toLowerCase()}
                  </Text>
                </Box>
              </StepEntry>
            </Flex>

            <FakeButton mt={4} width='100%'>
              {t('actions.activate')}
            </FakeButton>
          </Step>
        </HowToItem>
      </HowToOrderedList>
    </Box>
  );
};

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
import { useTranslation } from '../common/i18n';
import { Card } from '../common/Card';

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

    @media screen and (max-width: ${(props) => props.theme.breakpoints[1]}) {
      font-size: 90px;
    }

    @media screen and (max-width: ${(props) => props.theme.breakpoints[0]}) {
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
    <Card width='180px' bg='background.light'>
      <Flex
        bg='secondary'
        p={1}
        py={2}
        alignItems='center'
        justifyContent='center'
      >
        <Text color='text.light'>{title}</Text>
      </Flex>
      <Box height='160px' p={3}>
        {children}
      </Box>
    </Card>
  );
};

const StepEntry = ({ children, ...props }) => {
  return (
    <Flex
      width='100%'
      flexDirection='row'
      alignItems='center'
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
      <Box width='85%' maxWidth={960} style={{ zIndex: 2 }}>
        <Title mb={4} level={3}>
          {title}
        </Title>
        <Paragraph ml={['-60px', 0, 0]} px={3}>
          {description}
        </Paragraph>
        <Box ml={['-60px', 0, 0]} py={2} mt={5} style={{ overflowX: 'auto' }}>
          <Flex
            minWidth={960}
            px={3}
            bg='#fff'
            justifyContent='space-between'
            style={{ position: 'relative' }}
          >
            <Image
              my={2}
              width='90%'
              style={{
                position: 'absolute',
                left: 30,
                top: '40%',
                zIndex: 0,
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
  const { t } = useTranslation();

  return (
    <Box mx={'auto'} px={[3, 5, 6]} maxWidth={1280}>
      <HowToOrderedList>
        <HowToItem
          title={t('howItWorks.listCreateStore')}
          description={t('howItWorks.listCreateStoreDetails')}
        >
          <Step title={t('howItWorks.storeName')}>
            <StepEntry>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleStoreName')}
              </Text>
            </StepEntry>
          </Step>

          <Step title={t('howItWorks.storeUrl')}>
            <StepEntry>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleStoreUrl')}
              </Text>
              <Text strong color='primary'>
                .la.mk
              </Text>
            </StepEntry>
          </Step>

          <Step title={t('howItWorks.storeLogo')}>
            <StepEntry>
              <Image src='/cactus-logo.svg' />
            </StepEntry>

            <Button type='primary' mt={4} size='small' width='100%'>
              {t('actions.create')}
            </Button>
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
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleProductName')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.productImage')}>
            <StepEntry>
              <Image src='/cactus-1.svg' />
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.productDescription')}>
            <StepEntry>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleProductDescription')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.productPrice')}>
            <StepEntry>
              <Text color='mutedText.dark' textAlign='center'>
                400 MKD
              </Text>
            </StepEntry>
            <Button type='primary' mt={5} size='small' width='100%'>
              {t('actions.addToStore')}
            </Button>
          </Step>
        </HowToItem>

        <HowToItem
          title={t('howItWorks.listDeliveryPaymentPreferences')}
          description={t('howItWorks.listDeliveryPaymentPreferencesDetails')}
        >
          <Step title={t('howItWorks.deliveryMethod')}>
            <StepEntry>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleDeliveryMethod')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.deliveryFee')}>
            <StepEntry>
              <Text color='mutedText.dark' textAlign='center'>
                100 MKD
              </Text>
            </StepEntry>
            <Box mt={3}>
              <Text color='text.dark'>
                {t('howItWorks.sampleFreeOverDelivery')}:
              </Text>
              <StepEntry>
                <Text color='mutedText.dark' textAlign='center'>
                  1200 MKD
                </Text>
              </StepEntry>
            </Box>
          </Step>
          <Step title={t('howItWorks.paymentOptions')}>
            <Flex
              width='100%'
              mb={2}
              alignItems='center'
              justifyContent='center'
            >
              <Image mr={2} src='/checkbox.svg' />
              <StepEntry>
                <Text color='mutedText.dark' textAlign='center'>
                  {t('howItWorks.samplePaymentCreditCard')}
                </Text>
              </StepEntry>
            </Flex>
            <Flex width='100%' alignItems='center' justifyContent='center'>
              <Image mr={2} src='/checkbox.svg' />
              <StepEntry>
                <Text color='mutedText.dark' textAlign='center'>
                  {t('howItWorks.samplePaymentOnDelivery')}
                </Text>
              </StepEntry>
            </Flex>

            <Button
              style={{ fontSize: 14 }}
              type='primary'
              mt={3}
              size='small'
              width='100%'
            >
              Start
            </Button>
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
            <StepEntry>
              <ColorCircle color='#EF4351' />
              <Text color='mutedText.dark' ml={2}>
                1 {t('howItWorks.sampleNewOrder')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <ColorCircle color='#27AE60' />
              <Text color='mutedText.dark' ml={2}>
                2 {t('howItWorks.sampleCompletedOrder')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <ColorCircle color='#F1C40F' />
              <Text color='mutedText.dark' ml={2}>
                1 {t('howItWorks.samplePreparingOrder')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.orderDetails')}>
            <StepEntry>
              <Text color='mutedText.dark' textAlign='center'>
                1 {t('howItWorks.sampleProductName')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <Text color='mutedText.dark' textAlign='center'>
                2 {t('howItWorks.sampleProductName2_plural')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.buyerDetails')}>
            <StepEntry>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleAddressRecepient')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleAddressStreet')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleAddressCityCountry')}
              </Text>
            </StepEntry>
          </Step>

          <Step title={t('howItWorks.sendOrder')}>
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
          title={t('howItWorks.listDiscountCampaigns')}
          description={t('howItWorks.listDiscountCampaignsDetails')}
        >
          <Step title={t('howItWorks.campaignName')}>
            <StepEntry>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleCampaignName')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.productGroups')}>
            <StepEntry>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleProductGroup')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleProductGroup2')}
              </Text>
            </StepEntry>
            <StepEntry mt={2}>
              <Text color='mutedText.dark' textAlign='center'>
                {t('howItWorks.sampleProductGroup3')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.campaignReward')}>
            <StepEntry>
              <Text width='100%' color='mutedText.dark' textAlign='center'>
                30%
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.campaignPromote')}>
            <Flex>
              <Image mr={2} src='/checkbox.svg' />
              <StepEntry>
                <Box width='100%'>
                  <Text textAlign='center' display='block'>
                    {t('actions.promote').toLowerCase()}
                  </Text>
                  <Text
                    display='block'
                    fontSize={0}
                    color='mutedText.dark'
                    textAlign='center'
                  >
                    {t('actions.showBanner').toLowerCase()}
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
              {t('actions.activate')}
            </Button>
          </Step>
        </HowToItem>
      </HowToOrderedList>
    </Box>
  );
};

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
  const { t } = useTranslation();

  return (
    <Box mx={'auto'} px={[3, 5, 6]} maxWidth={1280}>
      <HowToOrderedList>
        <HowToItem
          title={t('howItWorks.listCreateStore')}
          description={t('howItWorks.listCreateStoreDetails')}
        >
          <Step title={t('howItWorks.storeName')}>
            <StepEntry>{t('howItWorks.sampleStoreName')}</StepEntry>
          </Step>

          <Step title={t('howItWorks.storeUrl')}>
            <StepEntry>
              {t('howItWorks.sampleStoreUrl')}
              <Text strong color='primary'>
                .la.mk
              </Text>
            </StepEntry>
          </Step>

          <Step title={t('howItWorks.storeLogo')}>
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
            <StepEntry>{t('howItWorks.sampleProductName')}</StepEntry>
          </Step>
          <Step title={t('howItWorks.productImage')}>
            <StepEntry>
              <Image src='/cactus-1.svg' />
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.productDescription')}>
            <StepEntry>
              <Text textAlign='center'>
                {t('howItWorks.sampleProductDescription')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.productPrice')}>
            <StepEntry>400 MKD</StepEntry>
            <Button
              style={{ fontSize: 14 }}
              type='primary'
              mt={5}
              size='small'
              width='100%'
            >
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
              <Text textAlign='center'>
                {t('howItWorks.sampleDeliveryMethod')}
              </Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.deliveryFee')}>
            <StepEntry>100 MKD</StepEntry>
            <Box mt={3}>
              <Text type='secondary'>
                {t('howItWorks.sampleFreeOverDelivery')}:
              </Text>
              <StepEntry>1200 MKD</StepEntry>
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
              <StepEntry>{t('howItWorks.samplePaymentCreditCard')}</StepEntry>
            </Flex>
            <Flex width='100%' alignItems='center' justifyContent='center'>
              <Image mr={2} src='/checkbox.svg' />
              <StepEntry>{t('howItWorks.samplePaymentOnDelivery')}</StepEntry>
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
              <ColorCircle color='#F6376D' />
              <Text ml={2}>1 {t('howItWorks.sampleNewOrder')}</Text>
            </StepEntry>
            <StepEntry mt={2}>
              <ColorCircle color='#27AE60' />
              <Text ml={2}>2 {t('howItWorks.sampleCompletedOrder')}</Text>
            </StepEntry>
            <StepEntry mt={2}>
              <ColorCircle color='#F1C40F' />
              <Text ml={2}>1 {t('howItWorks.samplePreparingOrder')}</Text>
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.orderDetails')}>
            <StepEntry>1 {t('howItWorks.sampleProductName')}</StepEntry>
            <StepEntry mt={2}>
              2 {t('howItWorks.sampleProductName2_plural')}
            </StepEntry>
          </Step>
          <Step title={t('howItWorks.buyerDetails')}>
            <StepEntry>{t('howItWorks.sampleAddressRecepient')}</StepEntry>
            <StepEntry mt={2}>{t('howItWorks.sampleAddressStreet')}</StepEntry>
            <StepEntry mt={2}>
              {t('howItWorks.sampleAddressCityCountry')}
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
            <StepEntry>{t('howItWorks.sampleCampaignName')}</StepEntry>
          </Step>
          <Step title={t('howItWorks.productGroups')}>
            <StepEntry>{t('howItWorks.sampleProductGroup')}</StepEntry>
            <StepEntry mt={2}>{t('howItWorks.sampleProductGroup2')}</StepEntry>
            <StepEntry mt={2}>{t('howItWorks.sampleProductGroup3')}</StepEntry>
          </Step>
          <Step title={t('howItWorks.campaignReward')}>
            <StepEntry>30 %</StepEntry>
          </Step>
          <Step title={t('howItWorks.campaignPromote')}>
            <Flex>
              <Image mr={2} src='/checkbox.svg' />
              <StepEntry>
                <Box width='100%'>
                  <Text display='block'>
                    {t('actions.promote').toLowerCase()}
                  </Text>
                  <Text display='block' fontSize={10}>
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

import React from 'react';
import { Flex, Card, Image, Title, Text } from '@sradevski/blocks-ui';
import { useTranslation } from '../common/i18n';

const StepCard = ({ icon, title, subtitle, ...props }) => {
  return (
    <Card {...props} bg={'quaternary'} width={[260, 300, 320]} height={330}>
      <Flex justifyContent='center' alignItems='center' flexDirection='column'>
        <Image m={3} src={icon} />
        <Title textAlign='center' level={4} fontSize={[3, 4, 4]}>
          {title}
        </Title>
        <Text fontSize={[2, 18, 18]} textAlign='center'>
          {subtitle}
        </Text>
      </Flex>
    </Card>
  );
};

export const StepCards = () => {
  const { t } = useTranslation();
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
        title={t('landing.stepCreateStore')}
        subtitle={t('landing.stepCreateStoreDetails')}
      />
      <StepCard
        my={[4, 4, 0]}
        icon='/product-box.svg'
        title={t('landing.stepAddProducts')}
        subtitle={t('landing.stepAddProductsDetails')}
      />
      <StepCard
        ml={[0, 0, 5]}
        icon='/start-rocket.svg'
        title={t('landing.stepStartSelling')}
        subtitle={t('landing.stepStartSellingDetails')}
      />
    </Flex>
  );
};

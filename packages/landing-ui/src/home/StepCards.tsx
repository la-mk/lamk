import React from 'react';
import { Flex, Image, Title, Text, Box } from '@sradevski/blocks-ui';
import { useTranslation } from '../common/i18n';

interface StepCardProps extends Omit<typeof Box, 'ref'> {
  icon: string;
  title: string;
  subtitle: string;
}

const StepCard = ({ icon, title, subtitle, ...props }: StepCardProps) => {
  return (
    <Box
      {...props}
      bg={'tertiary'}
      p={4}
      width={320}
      minHeight={[340, 340, 360]}
      borderRadius={0}
    >
      <Flex justifyContent='center' alignItems='center' flexDirection='column'>
        <Image mb={3} src={icon} />
        <Title textAlign='center' level={4} fontSize={[3, 4, 4]}>
          {title}
        </Title>
        <Text fontSize={[1, 1, 2]} textAlign='center'>
          {subtitle}
        </Text>
      </Flex>
    </Box>
  );
};

export const StepCards = () => {
  const { t } = useTranslation();
  return (
    <Flex
      mt={[-40, -120, -200]}
      alignItems='center'
      justifyContent='center'
      flexWrap='wrap'
    >
      <StepCard
        my={2}
        mx={3}
        icon='/pencil-create.svg'
        title={t('landing.stepCreateStore')}
        subtitle={t('landing.stepCreateStoreDetails')}
      />
      <StepCard
        my={2}
        mx={3}
        icon='/product-box.svg'
        title={t('landing.stepAddProducts')}
        subtitle={t('landing.stepAddProductsDetails')}
      />
      <StepCard
        my={2}
        mx={3}
        icon='/start-rocket.svg'
        title={t('landing.stepStartSelling')}
        subtitle={t('landing.stepStartSellingDetails')}
      />
    </Flex>
  );
};

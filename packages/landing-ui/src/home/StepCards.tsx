import React from 'react';
import { Flex, Image, Heading, Text, Box } from '@sradevski/blocks-ui';
import { useTranslation } from '../common/i18n';
import { Card } from '../common/Card';
import { HeroButtons } from '../common/HeroButtons';

type StepCardProps = {
  icon: string;
  title: string;
  subtitle: string;
} & React.ComponentProps<typeof Box>;

const StepCard = ({ icon, title, subtitle, ...props }: StepCardProps) => {
  return (
    <Card {...props} bg='#fff' p={4} width={300} minHeight={[300, 320, 360]}>
      <Flex justify='center' align='center' direction='column'>
        <Box mb={3}>
          <Image src={icon} alt='shop step icon' />
        </Box>
        <Heading align='center' as='h4' size='lg'>
          {title}
        </Heading>
        {/* @ts-ignore */}
        <Text size={['sm', 'sm', 'md']} align='center'>
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
      mt={[-40, -120, -240]}
      mx='auto'
      maxWidth={1200}
      direction='column'
      align='center'
      justify='center'
    >
      <Flex align='center' justify='center' wrap='wrap'>
        <StepCard
          my={3}
          mx={[2, 4, 4]}
          icon='/pencil-create.svg'
          title={t('landing.stepCreateStore')}
          subtitle={t('landing.stepCreateStoreDetails')}
        />
        <StepCard
          my={3}
          mx={[2, 4, 4]}
          icon='/product-box.svg'
          title={t('landing.stepAddProducts')}
          subtitle={t('landing.stepAddProductsDetails')}
        />
        <StepCard
          my={3}
          mx={[2, 4, 4]}
          icon='/start-rocket.svg'
          title={t('landing.stepStartSelling')}
          subtitle={t('landing.stepStartSellingDetails')}
        />
      </Flex>
      <Box display={['none', 'none', 'block']} mt={4} width='100%'>
        <Flex align='center' justify='center' width='80%' mx='auto'>
          <Image src='/step-dots.svg' alt='dots decoration' />
        </Flex>
      </Box>

      <HeroButtons mt={5} noDemo />
    </Flex>
  );
};

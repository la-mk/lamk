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
    <Card
      {...props}
      bg='#fff'
      p={6}
      width={'18rem'}
      minHeight={['18rem', '20rem', '22rem']}
    >
      <Flex justify='center' align='center' direction='column'>
        <Box mb={5}>
          <Image src={icon} alt='shop step icon' />
        </Box>
        <Heading align='center' as='h2' size='lg' mb={5}>
          {title}
        </Heading>
        <Text size={'md'} align='center'>
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
      mt={['-40px', '-120px', '-240px']}
      mx='auto'
      maxWidth={'76rem'}
      direction='column'
      align='center'
      justify='center'
    >
      <Flex align='center' justify='center' wrap='wrap'>
        <StepCard
          my={4}
          mx={[3, 5, 6]}
          icon='/pencil-create.svg'
          title={t('landing.stepCreateStore')}
          subtitle={t('landing.stepCreateStoreDetails')}
        />
        <StepCard
          my={4}
          mx={[3, 5, 6]}
          icon='/product-box.svg'
          title={t('landing.stepAddProducts')}
          subtitle={t('landing.stepAddProductsDetails')}
        />
        <StepCard
          my={4}
          mx={[3, 5, 6]}
          icon='/start-rocket.svg'
          title={t('landing.stepStartSelling')}
          subtitle={t('landing.stepStartSellingDetails')}
        />
      </Flex>
      <Box display={['none', 'none', 'block']} mt={5} width='100%'>
        <Flex align='center' justify='center' width='80%' mx='auto'>
          <Image src='/step-dots.svg' alt='dots decoration' />
        </Flex>
      </Box>

      <HeroButtons mt={7} noDemo />
    </Flex>
  );
};

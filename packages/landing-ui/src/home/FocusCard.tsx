import React from 'react';
import { Flex, Image, Heading, Text, Button, Box } from '@sradevski/blocks-ui';
import { useTranslation } from '../common/i18n';

type FocusCardProps = {
  icon: string;
  title: string;
  description: string;
} & React.ComponentProps<typeof Box>;

export const FocusCard = ({
  icon,
  title,
  description,
  ...props
}: FocusCardProps) => {
  const { t } = useTranslation();
  return (
    <Box
      {...props}
      bg={'primary'}
      width={['90%', '75%', '65%', '65%']}
      maxWidth={920}
      // @ts-ignore
      borderRadius={'xs'}
      p={4}
      mx='auto'
    >
      <Flex
        justify='space-between'
        align='center'
        direction={['column', 'row', 'row']}
        // @ts-ignore
        style={{ position: 'relative' }}
        p={[2, 3, 4]}
        pr={[0, '15%', '15%']}
      >
        <Box mb={[5, 0, 0]} mr={[0, 4, 4]} maxWidth={350}>
          <Image src={icon} alt='Example logo' />
          <Heading mt={2} color='text.light' as='h4'>
            {title}
          </Heading>
          <Text color='text.light' size='xs'>
            {description}
          </Text>
        </Box>
        <Button
          as='a'
          // @ts-ignore
          style={{ zIndex: 2 }}
          target='_blank'
          rel='noreferrer noopener'
          size='lg'
          href='https://admin.la.mk'
        >
          {t('actions.startNow')}
        </Button>

        {/* @ts-ignore */}
        <Box style={{ position: 'absolute', bottom: -60, right: -40 }}>
          <Image src='/radiating-dots.svg' alt='dots decoration' />
        </Box>
      </Flex>
    </Box>
  );
};

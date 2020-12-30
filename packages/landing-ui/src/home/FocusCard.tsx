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
      bg={'primary.500'}
      width={['90%', '75%', '65%', '65%']}
      maxWidth={'60rem'}
      // @ts-ignore
      borderRadius={'lg'}
      p={[5, 7, 7]}
      mx='auto'
    >
      <Flex
        justify='space-between'
        align='center'
        direction={['column', 'row', 'row']}
        // @ts-ignore
        style={{ position: 'relative' }}
        p={[3, 4, 6]}
        pr={[0, '15%', '15%']}
      >
        <Box mb={[6, 0, 0]} mr={[0, 5, 5]} maxWidth={'26rem'}>
          <Image src={icon} alt='Example logo' />
          <Heading mt={3} color='text.light' as='h4' size='lg' mb={4}>
            {title}
          </Heading>
          <Text color='text.light' size='md'>
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
        <Box style={{ position: 'absolute', bottom: '-60px', right: '-40px' }}>
          <Image src='/radiating-dots.svg' alt='dots decoration' />
        </Box>
      </Flex>
    </Box>
  );
};

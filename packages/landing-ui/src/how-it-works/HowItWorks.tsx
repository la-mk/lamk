import React from 'react';
import { Modal, Flex, Button, Box, Image } from '@sradevski/blocks-ui';
import { Video } from '../common/Video';
import { Hero } from './Hero';
import { HowToList } from './HowToList';
import { GeneratedStoreExample } from './GeneratedStoreExample';
import { ContactUsFooter } from '../common/ContactUsFooter';
import { useTranslation } from '../common/i18n';

const RadiatingCircles = () => {
  return (
    <>
      <Image
        key='dot1'
        style={{ position: 'absolute', left: 0, top: '5%' }}
        src='/radiating-dots-colored.svg'
      />
      <Image
        key='dot2'
        style={{
          position: 'absolute',
          right: 0,
          top: '15%',
          transform: 'rotate(180deg)',
        }}
        src='/radiating-dots-colored.svg'
      />
      <Image
        key='dot3'
        style={{ position: 'absolute', left: 0, top: '40%' }}
        src='/radiating-dots-colored.svg'
      />
      <Image
        key='dot4'
        style={{
          position: 'absolute',
          right: 0,
          top: '80%',
          transform: 'rotate(180deg)',
        }}
        src='/radiating-dots-colored.svg'
      />
    </>
  );
};

export const HowItWorks = () => {
  const [showVideo, setShowVideo] = React.useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Hero />
      <Box style={{ position: 'relative' }}>
        <RadiatingCircles />
        <HowToList />
      </Box>
      <GeneratedStoreExample />

      <Flex alignItems='center' justifyContent='center' my={80}>
        <Button mr={2} type='primary' size='large' width={140}>
          {t('actions.startNow')}
        </Button>
        <Button ml={2} width={140} size='large'>
          {t('actions.watchDemo')}
        </Button>
      </Flex>

      <ContactUsFooter />
      <Modal
        bodyStyle={{ padding: 0 }}
        width={'80%'}
        height={'80vh'}
        centered
        destroyOnClose
        visible={showVideo}
        footer={null}
        onCancel={() => setShowVideo(false)}
      >
        <Video height={'80vh'} webm='/elephants-dream.webm' />
      </Modal>
    </>
  );
};

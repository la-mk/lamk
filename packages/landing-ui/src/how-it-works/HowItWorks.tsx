import React from 'react';
import { Modal, Flex, Button, Box, Image } from '@sradevski/blocks-ui';
import { Video } from '../common/Video';
import { Hero } from './Hero';
import { HowToList } from './HowToList';
import { GeneratedStoreExample } from './GeneratedStoreExample';
import { ContactUsFooter } from '../common/ContactUsFooter';

const RadiatingCircles = () => {
  return (
    <>
      <Image
        style={{ position: 'absolute', left: 0, top: '5%' }}
        src='/radiating-dots-colored.svg'
      />
      <Image
        style={{
          position: 'absolute',
          right: 0,
          top: '15%',
          transform: 'rotate(180deg)',
        }}
        src='/radiating-dots-colored.svg'
      />
      <Image
        style={{ position: 'absolute', left: 0, top: '40%' }}
        src='/radiating-dots-colored.svg'
      />
      <Image
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

  return (
    <>
      <Hero setShowVideo={setShowVideo} />
      <Box style={{ position: 'relative' }}>
        <RadiatingCircles />
        <HowToList />
      </Box>
      <GeneratedStoreExample />

      <Flex alignItems='center' justifyContent='center' my={80}>
        <Button mr={2} type='primary' size='large' width={140}>
          Start now
        </Button>
        <Button ml={2} width={140} size='large'>
          Watch demo
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

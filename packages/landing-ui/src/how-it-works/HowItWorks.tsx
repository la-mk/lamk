import React from 'react';
import { Modal, Flex, Button } from '@sradevski/blocks-ui';
import { Video } from '../common/Video';
import { Hero } from './Hero';
import { HowToList } from './HowToList';
import { GeneratedStoreExample } from './GeneratedStoreExample';
import { ContactUsFooter } from '../common/ContactUsFooter';

export const HowItWorks = () => {
  const [showVideo, setShowVideo] = React.useState(false);

  return (
    <>
      <Hero setShowVideo={setShowVideo} />
      <HowToList />
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

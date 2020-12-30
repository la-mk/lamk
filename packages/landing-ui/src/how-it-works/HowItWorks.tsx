import React from 'react';
import { Flex, Box, Image } from '@sradevski/blocks-ui';
// import { Video } from '../common/Video';
import { Hero } from './Hero';
import { HowToList } from './HowToList';
import { GeneratedStoreExample } from './GeneratedStoreExample';
import { ContactUsFooter } from '../common/ContactUsFooter';
import { HeroButtons } from '../common/HeroButtons';

const RadiatingCircles = () => {
  return (
    <>
      <Image
        key='dot1'
        style={{ position: 'absolute', left: 0, top: '5%' }}
        src='/radiating-dots-colored.svg'
        alt='dots decoration'
      />
      <Image
        key='dot2'
        style={{
          position: 'absolute',
          right: 0,
          top: '15%',
          transform: 'rotate(180deg)',
        }}
        alt='dots decoration'
        src='/radiating-dots-colored.svg'
      />
      <Image
        key='dot3'
        style={{ position: 'absolute', left: 0, top: '40%' }}
        src='/radiating-dots-colored.svg'
        alt='dots decoration'
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
        alt='dots decoration'
      />
    </>
  );
};

export const HowItWorks = () => {
  // const [showVideo, setShowVideo] = React.useState(false);
  // const { t } = useTranslation();

  return (
    <>
      <Hero />
      {/* @ts-ignore */}
      <Box style={{ position: 'relative' }}>
        <RadiatingCircles />
        <HowToList />
      </Box>
      <GeneratedStoreExample />
      <Flex mt={7} align='center' justify='center'>
        <HeroButtons />
      </Flex>

      <ContactUsFooter />
      {/* <Modal
        width={'80%'}
        height={'80vh'}
        centered
        destroyOnClose
        visible={showVideo}
        footer={null}
        onCancel={() => setShowVideo(false)}
      >
        <Video height={'80vh'} webm='/elephants-dream.webm' />
      </Modal> */}
    </>
  );
};

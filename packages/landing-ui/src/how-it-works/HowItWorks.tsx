import React from 'react';
import { Page } from '../common/Page';
import {
  Box,
  Paragraph,
  Title,
  Image,
  Button,
  Flex,
  Modal,
} from '@sradevski/blocks-ui';
import { Video } from '../common/Video';

interface SectionProps {
  title: string;
  image: string;
  description: string;
}

const Section = ({ title, image, description }: SectionProps) => {
  return (
    <Box mt={5}>
      <Title level={2}>{title}</Title>
      <Image maxHeight={250} src={image} />
      <Paragraph mt={2}>{description}</Paragraph>
    </Box>
  );
};

export const HowItWorks = () => {
  const [showVideo, setShowVideo] = React.useState(false);

  return (
    <Page title='How it works'>
      <Box mt={5}>
        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          voluptatibus optio tempora vero, odio velit earum fugiat eveniet
          assumenda ullam ab reprehenderit illo eum dolores omnis dignissimos
          natus, voluptatem maiores.
        </Paragraph>
        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          voluptatibus optio tempora vero, odio velit earum fugiat eveniet
          assumenda ullam ab reprehenderit illo eum dolores omnis dignissimos
          natus, voluptatem maiores.
        </Paragraph>
      </Box>
      <Flex>
        <Button
          mr={2}
          mb={4}
          type='primary'
          size='large'
          onClick={() => setShowVideo(true)}
        >
          Watch the video
        </Button>
        <Button ml={2} size='large'>
          See demo shop
        </Button>
      </Flex>
      <Section
        title='Create a store'
        image='/products.png'
        description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
        consectetur voluptas facere totam at cumque quasi. Necessitatibus
        doloremque hic quam voluptatum esse a modi nihil reiciendis quas iusto,
        obcaecati cumque.'
      />

      <Section
        title='Add products to your store'
        image='/products.png'
        description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
        consectetur voluptas facere totam at cumque quasi. Necessitatibus
        doloremque hic quam voluptatum esse a modi nihil reiciendis quas iusto,
        obcaecati cumque.'
      />

      <Section
        title='Define your delivery and payment preferences'
        image='/products.png'
        description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
        consectetur voluptas facere totam at cumque quasi. Necessitatibus
        doloremque hic quam voluptatum esse a modi nihil reiciendis quas iusto,
        obcaecati cumque.'
      />

      <Section
        title='Manage orders, activate campaigns, and ...'
        image='/products.png'
        description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
        consectetur voluptas facere totam at cumque quasi. Necessitatibus
        doloremque hic quam voluptatum esse a modi nihil reiciendis quas iusto,
        obcaecati cumque.'
      />

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
    </Page>
  );
};

import React from 'react';
import {
  Paragraph,
  Collapse,
  CollapsePanel,
  Box,
  Title,
  Flex,
  Text,
} from '@sradevski/blocks-ui';
import { CurvedSection } from '../common/CurvedSection';
import { withTheme } from 'styled-components';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqGroup {
  title: string;
  items: FaqItem[];
}

const pricingItems: FaqItem[] = [
  { question: 'How much does it cost?', answer: "It's completely free!" },
  {
    question: 'Do I need to sign a contract?',
    answer:
      'There are no contracts or obligations, you can stop using the platform whenever you want.',
  },
];

const paymentItems: FaqItem[] = [
  {
    question: 'What payment methods can I use?',
    answer:
      "Currently we support payment on delivery and credit card payments. If we currently don't support your bank, we can work together and add support for it within 1-2 weeks",
  },
];

const faqGroups: FaqGroup[] = [
  {
    title: 'Pricing',
    items: pricingItems,
  },
  {
    title: 'Payments',
    items: paymentItems,
  },
];

export const Faq = withTheme(({ theme }) => {
  return (
    <Box>
      <CurvedSection
        direction='down'
        backgroundColor={theme.colors.lightBackground}
      >
        <Flex
          alignItems='center'
          justifyContent='center'
          flexDirection={['column', 'row', 'row']}
          mt={[4, 4, 5]}
        >
          <Box maxWidth={600}>
            <Title
              color='primary'
              level={1}
              mb={2}
              textAlign={'center'}
              fontSize={[6, 6, 7]}
            >
              Frequently <Text color='secondary'>Asked Questions</Text>
            </Title>

            <Paragraph mt={4} textAlign={['center', 'start', 'start']}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
              voluptatibus optio tempora vero, odio velit earum fugiat eveniet
              assumenda ullam ab reprehenderit illo eum dolores omnis
              dignissimos natus, voluptatem maiores.
            </Paragraph>
          </Box>
        </Flex>
      </CurvedSection>

      <Box maxWidth={960} mx={'auto'} px={[3, 4, 4]} mb={5}>
        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa harum
          animi dolores et fuga aliquam incidunt natus quaerat, minima mollitia?
          Adipisci, suscipit odit reprehenderit repellat minus laudantium error
          velit illum.
        </Paragraph>

        <Box width='100%'>
          {faqGroups.map((group) => {
            return (
              <Box mt={4}>
                <Title mb={3} level={3}>
                  {group.title}
                </Title>
                <Collapse width='100%' style={{ background: 'transparent' }}>
                  {group.items.map((faqItem) => {
                    return (
                      <CollapsePanel
                        key={faqItem.question}
                        header={faqItem.question}
                      >
                        <Paragraph>{faqItem.answer}</Paragraph>
                      </CollapsePanel>
                    );
                  })}
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
});

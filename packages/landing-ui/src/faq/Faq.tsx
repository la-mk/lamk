import React from 'react';
import { Page } from '../common/Page';
import {
  Paragraph,
  Collapse,
  CollapsePanel,
  Box,
  Title,
} from '@sradevski/blocks-ui';

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

export const Faq = () => {
  return (
    <Page title='Frequently asked questions'>
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
    </Page>
  );
};
